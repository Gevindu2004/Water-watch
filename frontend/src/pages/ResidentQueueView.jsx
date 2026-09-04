import React, { useState, useEffect } from 'react';
import { deliveryService } from '../services/api';
import { useDistrict } from '../context/DistrictContext';
import { 
  Users, 
  Truck, 
  Clock, 
  MapPin, 
  Droplet, 
  CheckCircle2, 
  UserCheck, 
  AlertTriangle,
  Search,
  Building2,
  Navigation,
  Compass,
  Filter,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const DISTRICT_VILLAGES_MAP = {
  Polonnaruwa: [
    { village: 'Siripura', defaultPoint: 'Siripura Temple Junction' },
    { village: 'Bakamuna', defaultPoint: 'Bakamuna Maha Vidyalaya Grounds' },
    { village: 'Welikanda', defaultPoint: 'Welikanda Divisional Secretariat' },
    { village: 'Medirigiriya', defaultPoint: 'Medirigiriya Hospital Junction' },
    { village: 'Hingurakgoda', defaultPoint: 'Hingurakgoda Water Board Depot' },
    { village: 'Elahera', defaultPoint: 'Elahera Central Grounds' }
  ],
  Anuradhapura: [
    { village: 'Mihintale', defaultPoint: 'Mihintale Base Hospital Grounds' },
    { village: 'Rambewa', defaultPoint: 'Rambewa Divisional Secretariat' },
    { village: 'Kekirawa', defaultPoint: 'Kekirawa Central Bus Stand' },
    { village: 'Ipalogama', defaultPoint: 'Ipalogama Primary School' },
    { village: 'Medawachchiya', defaultPoint: 'Medawachchiya Station Grounds' }
  ],
  Hambantota: [
    { village: 'Suriyawewa', defaultPoint: 'Suriyawewa Hospital Grounds' },
    { village: 'Ambalantota', defaultPoint: 'Ambalantota Depot Center' },
    { village: 'Ridiyagama', defaultPoint: 'Ridiyagama Colony Junction' },
    { village: 'Tissamaharama', defaultPoint: 'Tissamaharama Bus Stand' },
    { village: 'Lunugamvehera', defaultPoint: 'Lunugamvehera Center Grounds' }
  ],
  Puttalam: [
    { village: 'Anamaduwa', defaultPoint: 'Anamaduwa Bus Stand Grounds' },
    { village: 'Karuwalagaswewa', defaultPoint: 'Karuwalagaswewa Hospital Junction' },
    { village: 'Wanathavilluwa', defaultPoint: 'Wanathavilluwa Primary School' },
    { village: 'Nawagattegama', defaultPoint: 'Nawagattegama Central Grounds' }
  ],
  Mannar: [
    { village: 'Giant\'s Tank Sector', defaultPoint: 'Giant\'s Tank Gate Station' },
    { village: 'Murunkan', defaultPoint: 'Murunkan Railway Station Yard' },
    { village: 'Mantai West', defaultPoint: 'Mantai West Divisional Secretariat' },
    { village: 'Musali', defaultPoint: 'Musali Hospital Grounds' }
  ],
  Batticaloa: [
    { village: 'Vavunathivu', defaultPoint: 'Vavunathivu School Grounds' },
    { village: 'Kokkadichcholai', defaultPoint: 'Kokkadichcholai Hospital Stand' },
    { village: 'Manmunai West', defaultPoint: 'Manmunai Junction Grounds' },
    { village: 'Chenkalady', defaultPoint: 'Chenkalady Central Market' }
  ],
  Ampara: [
    { village: 'Inginiyagala', defaultPoint: 'Inginiyagala Reservoir Gate' },
    { village: 'Damana', defaultPoint: 'Damana Divisional Secretariat' },
    { village: 'Uhana', defaultPoint: 'Uhana Central Grounds' },
    { village: 'Dehiattakandiya', defaultPoint: 'Dehiattakandiya Base Hospital' }
  ],
  Moneragala: [
    { village: 'Bibile', defaultPoint: 'Bibile Hospital Junction' },
    { village: 'Medagama', defaultPoint: 'Medagama School Grounds' },
    { village: 'Siyambalanduwa', defaultPoint: 'Siyambalanduwa Stand' },
    { village: 'Wellawaya', defaultPoint: 'Wellawaya Depot Grounds' }
  ]
};

export default function ResidentQueueView() {
  const { selectedDistrict, setSelectedDistrict, DRY_ZONE_DISTRICTS } = useDistrict();
  
  const [activeDistrict, setActiveDistrict] = useState(
    selectedDistrict && selectedDistrict !== 'All' ? selectedDistrict : 'Polonnaruwa'
  );

  const availableVillages = DISTRICT_VILLAGES_MAP[activeDistrict] || DISTRICT_VILLAGES_MAP['Polonnaruwa'];

  const [selectedVillage, setSelectedVillage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState({});

  // Sync with global district selector
  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== 'All' && selectedDistrict !== activeDistrict) {
      setActiveDistrict(selectedDistrict);
      setSelectedVillage('All');
    }
  }, [selectedDistrict]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await deliveryService.getAll(activeDistrict);
      const data = res.data.deliveries || res.data.data || [];
      setDeliveries(data);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [activeDistrict]);

  const handleDistrictChange = (distId) => {
    setActiveDistrict(distId);
    setSelectedVillage('All');
    if (setSelectedDistrict) {
      setSelectedDistrict(distId);
    }
  };

  const handleToggleAttendance = async (deliveryId) => {
    const isJoined = !!hasJoined[deliveryId];
    const action = isJoined ? 'decrement' : 'increment';

    try {
      await deliveryService.updateQueue(deliveryId, { action });
      setHasJoined(prev => ({ ...prev, [deliveryId]: !isJoined }));
      fetchDeliveries();
    } catch (err) {
      alert('Could not update queue: ' + (err.response?.data?.message || err.message));
    }
  };

  // Filter deliveries by village tab and text search query
  const filteredDeliveries = deliveries.filter(del => {
    const matchesVillage = selectedVillage === 'All' || 
      del.villageId.toLowerCase().includes(selectedVillage.toLowerCase());
    
    const matchesQuery = !searchQuery || 
      del.villageId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.distributionPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      del.bowserId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesVillage && matchesQuery;
  });

  return (
    <div className="page-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Droplet size={28} color="#00f2fe" /> Resident Bowser Delivery Portal
          </h1>
          <p className="page-description">
            Live Emergency Water Bowser Schedules & Queue Tracking across Sri Lanka Dry Zone
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm" 
          onClick={fetchDeliveries}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Live Schedule
        </button>
      </div>

      {/* District & Location Selection Control Center */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(16px)'
      }}>
        {/* District Selector Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MapPin size={20} color="#00f2fe" />
            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select District Sector:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              value={activeDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              style={{
                background: '#0f172a',
                border: '1px solid #00f2fe',
                color: '#00f2fe',
                fontWeight: '800',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {DRY_ZONE_DISTRICTS.filter(d => d.id !== 'All').map(d => (
                <option key={d.id} value={d.id}>
                  📍 {d.name} District ({d.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Village Selector Buttons */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Navigation size={14} color="#38bdf8" /> Select Village / Division in {activeDistrict}:
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${selectedVillage === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '8px', fontSize: '0.825rem' }}
              onClick={() => setSelectedVillage('All')}
            >
              🌐 All Villages in {activeDistrict}
            </button>

            {availableVillages.map(v => (
              <button
                key={v.village}
                className={`btn btn-sm ${selectedVillage === v.village ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '8px', fontSize: '0.825rem' }}
                onClick={() => setSelectedVillage(v.village)}
              >
                📍 {v.village}
              </button>
            ))}
          </div>
        </div>

        {/* Live Search Input Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            style={{
              paddingLeft: '2.75rem',
              background: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              fontSize: '0.9rem'
            }}
            placeholder={`Search landmark or distribution point in ${activeDistrict} (e.g. Temple Junction, Hospital Grounds)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Delivery Schedule Results */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
          <div className="spinner-border text-primary" role="status" style={{ marginBottom: '1rem' }} />
          <div>Loading live bowser distribution schedule for {activeDistrict}...</div>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px dashed rgba(0, 242, 254, 0.3)',
          borderRadius: '20px',
          padding: '3.5rem 2rem',
          textAlign: 'center'
        }}>
          <AlertTriangle size={42} color="#f59e0b" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
            No Active Bowser Delivery Found for {selectedVillage !== 'All' ? selectedVillage : activeDistrict}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem', maxWidth: '500px', marginInLine: 'auto' }}>
            No bowser tankers are currently scheduled for this location. Select another village or switch districts to inspect neighbor schedules.
          </p>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedVillage('All')}
            >
              View All Locations in {activeDistrict}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleDistrictChange('Polonnaruwa')}
            >
              Switch to Polonnaruwa Sector
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>Showing <strong>{filteredDeliveries.length}</strong> scheduled bowser dispatches in <strong>{activeDistrict}</strong></span>
            <span>Refreshed live</span>
          </div>

          {filteredDeliveries.map(del => {
            const lPerPerson = del.peopleWaiting > 0 
              ? Math.round(del.capacity / del.peopleWaiting) 
              : del.capacity;

            const isAttending = !!hasJoined[del._id];

            return (
              <div key={del._id} style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.85))',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                borderRadius: '20px',
                padding: '1.75rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.75rem',
                alignItems: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(12px)'
              }}>
                {/* Left side: Detailed Location & Delivery Meta */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span className={`badge badge-${del.status.replace(/\s+/g, '-')}`} style={{ fontWeight: '800' }}>
                      {del.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#00f2fe', background: 'rgba(0, 242, 254, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(0, 242, 254, 0.2)', fontWeight: '700' }}>
                      📍 {del.district || activeDistrict} Sector
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Date: {del.scheduledDate}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                    📍 Distribution Point: <span style={{ color: '#00f2fe' }}>{del.distributionPoint}</span>
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                    <div className="info-row">
                      <span className="info-label" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Navigation size={15} color="#38bdf8" /> Village / Division:
                      </span>
                      <span className="info-value" style={{ fontWeight: '700', color: '#f8fafc' }}>{del.villageId}</span>
                    </div>

                    <div className="info-row">
                      <span className="info-label" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Truck size={15} color="#34d399" /> Bowser Tanker ID:
                      </span>
                      <span className="info-value" style={{ fontWeight: '700', color: '#34d399' }}>🚛 {del.bowserId}</span>
                    </div>

                    <div className="info-row">
                      <span className="info-label" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={15} color="#fbbf24" /> Estimated Arrival (ETA):
                      </span>
                      <span className="info-value" style={{ fontWeight: '800', color: '#fbbf24' }}>
                        {del.estimatedArrival}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="info-label" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Droplet size={15} color="#00f2fe" /> Water Volume Capacity:
                      </span>
                      <span className="info-value" style={{ fontWeight: '700', color: '#f8fafc' }}>
                        {del.capacity ? del.capacity.toLocaleString() : '5,000'} Liters
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Queue Management & Rationing Card */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.775rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                        Residents in Queue
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#f8fafc', marginTop: '2px' }}>
                        {del.peopleWaiting} <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#94a3b8' }}>people</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.775rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                        Water Ration Share
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#00f2fe', marginTop: '2px' }}>
                        ~{lPerPerson} L <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>/ person</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`btn ${isAttending ? 'btn-success' : 'btn-primary'}`}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      fontSize: '0.95rem',
                      fontWeight: '800',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: isAttending ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #00f2fe, #4facfe)',
                      color: '#0f172a',
                      border: 'none',
                      boxShadow: isAttending ? '0 6px 16px rgba(16, 185, 129, 0.3)' : '0 6px 16px rgba(0, 242, 254, 0.3)'
                    }}
                    onClick={() => handleToggleAttendance(del._id)}
                  >
                    {isAttending ? (
                      <>
                        <UserCheck size={18} /> You Are In Queue! (Click to Leave)
                      </>
                    ) : (
                      <>
                        <Users size={18} /> I Intend to Attend Distribution
                      </>
                    )}
                  </button>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.5rem' }}>
                    Member 1 Queue Endpoint: <code>PATCH /api/deliveries/{del._id}/queue</code>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

