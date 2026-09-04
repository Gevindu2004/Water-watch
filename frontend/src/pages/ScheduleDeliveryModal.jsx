import React, { useState, useEffect } from 'react';
import { deliveryService } from '../services/api';
import { useDistrict, DRY_ZONE_DISTRICTS } from '../context/DistrictContext';
import { Calendar, Truck, MapPin, Clock, Users, Droplet, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ScheduleDeliveryModal({ bowsers, onClose, onSuccess }) {
  const { selectedDistrict } = useDistrict();

  // District to Village mapping dictionary
  const DISTRICT_VILLAGES = {
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

  const currentDistrict = selectedDistrict && selectedDistrict !== 'All' ? selectedDistrict : 'Polonnaruwa';
  const initialVillages = DISTRICT_VILLAGES[currentDistrict] || DISTRICT_VILLAGES['Polonnaruwa'];

  const [targetDistrict, setTargetDistrict] = useState(currentDistrict);
  const [availableVillages, setAvailableVillages] = useState(initialVillages);
  
  const [formData, setFormData] = useState({
    bowserId: bowsers.length > 0 ? bowsers[0].bowserId : 'WB-102',
    district: currentDistrict,
    villageId: initialVillages[0].village,
    distributionPoint: initialVillages[0].defaultPoint,
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedArrival: '2:00 PM',
    capacity: bowsers.length > 0 ? bowsers[0].capacity : 5000,
    peopleWaiting: 86
  });

  const [submitting, setSubmitting] = useState(false);

  // When target district changes, update villages and distribution point!
  const handleDistrictChange = (newDist) => {
    setTargetDistrict(newDist);
    const vList = DISTRICT_VILLAGES[newDist] || DISTRICT_VILLAGES['Polonnaruwa'];
    setAvailableVillages(vList);

    // Filter bowsers for district if possible
    const distBowsers = bowsers.filter(b => b.district === newDist);
    const chosenBowser = distBowsers.length > 0 ? distBowsers[0] : (bowsers[0] || { bowserId: 'WB-102', capacity: 5000 });

    setFormData(prev => ({
      ...prev,
      district: newDist,
      villageId: vList[0].village,
      distributionPoint: vList[0].defaultPoint,
      bowserId: chosenBowser.bowserId,
      capacity: chosenBowser.capacity
    }));
  };

  const handleVillageChange = (selectedVillageName) => {
    const vObj = availableVillages.find(v => v.village === selectedVillageName);
    setFormData(prev => ({
      ...prev,
      villageId: selectedVillageName,
      distributionPoint: vObj ? vObj.defaultPoint : `${selectedVillageName} Central Junction`
    }));
  };

  const handleBowserChange = (selectedBowserId) => {
    const selected = bowsers.find(b => b.bowserId === selectedBowserId);
    setFormData(prev => ({
      ...prev,
      bowserId: selectedBowserId,
      capacity: selected ? selected.capacity : prev.capacity
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await deliveryService.create(formData);
      onSuccess();
    } catch (err) {
      alert('Failed to schedule delivery: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Filter bowsers by target district or show all if empty
  const filteredBowsers = bowsers.filter(b => !b.district || b.district === targetDistrict || targetDistrict === 'All');
  const displayBowsers = filteredBowsers.length > 0 ? filteredBowsers : bowsers;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '580px', width: '100%', borderRadius: '20px' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(0, 242, 254, 0.2)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              Schedule Water Delivery
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#00f2fe', margin: '0.2rem 0 0 0', fontWeight: '600' }}>
              Dispatch emergency bowser tanker across Sri Lanka Dry Zone
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
          
          {/* Target District & Bowser Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.15rem' }}>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: '700', color: '#cbd5e1' }}>Target District</label>
              <select
                className="form-select"
                required
                value={targetDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                style={{ fontWeight: '700', color: '#00f2fe' }}
              >
                {DRY_ZONE_DISTRICTS.filter(d => d.id !== 'All').map(d => (
                  <option key={d.id} value={d.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                    {d.name} ({d.region})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: '700', color: '#cbd5e1' }}>Select Bowser Tanker</label>
              <select
                className="form-select"
                required
                value={formData.bowserId}
                onChange={(e) => handleBowserChange(e.target.value)}
              >
                {displayBowsers.length === 0 ? (
                  <option value="WB-102">WB-102 (5,000 L - Sarath Kumara)</option>
                ) : (
                  displayBowsers.map(b => (
                    <option key={b._id || b.bowserId} value={b.bowserId}>
                      🚛 {b.bowserId} ({b.capacity.toLocaleString()} L) [{b.status}]
                    </option>
                  ))
                )}
              </select>
            </div>

          </div>

          {/* Target Village & Distribution Point */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.15rem' }}>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: '700', color: '#cbd5e1' }}>Destination Village</label>
              <select
                className="form-select"
                required
                value={formData.villageId}
                onChange={(e) => handleVillageChange(e.target.value)}
              >
                {availableVillages.map(v => (
                  <option key={v.village} value={v.village}>{v.village}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: '700', color: '#cbd5e1' }}>Distribution Location</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Siripura Temple Junction"
                value={formData.distributionPoint}
                onChange={(e) => setFormData({ ...formData, distributionPoint: e.target.value })}
              />
            </div>

          </div>

          {/* Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.15rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Scheduled Date</label>
              <input
                type="date"
                className="form-input"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Estimated Arrival (ETA)</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="2:00 PM"
                value={formData.estimatedArrival}
                onChange={(e) => setFormData({ ...formData, estimatedArrival: e.target.value })}
              />
            </div>
          </div>

          {/* Capacity & Initial Queue */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.15rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Water Volume (Liters)</label>
              <input
                type="number"
                className="form-input"
                required
                min="500"
                step="500"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Initial People Waiting</label>
              <input
                type="number"
                className="form-input"
                min="0"
                value={formData.peopleWaiting}
                onChange={(e) => setFormData({ ...formData, peopleWaiting: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Rationing calculation summary */}
          {formData.peopleWaiting > 0 && (
            <div className="demand-box" style={{ marginBottom: '1.25rem', padding: '0.85rem 1rem', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Water Rationing Estimate:</span>
              <span style={{ fontWeight: '800', color: '#00f2fe', fontSize: '0.95rem' }}>
                ~{Math.round(formData.capacity / formData.peopleWaiting)} Liters / resident
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ background: 'linear-gradient(135deg, #00f2fe, #4facfe)', color: '#0f172a', fontWeight: '800', border: 'none' }}>
              {submitting ? 'Scheduling Dispatch...' : 'Confirm Delivery Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
