import React, { useState, useEffect } from 'react';
import { tankService } from '../services/api';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  Info,
  TrendingDown,
  Edit,
  Save,
  X
} from 'lucide-react';

import { useDistrict } from '../context/DistrictContext';

export default function TankManagementPage() {
  const { selectedDistrict } = useDistrict();
  const [tanks, setTanks] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTank, setSelectedTank] = useState(null);
  const [newVolumeInput, setNewVolumeInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState('');

  // Fallback initial history data for Recharts line chart
  const defaultHistory = [
    { day: 'Mon', Minneriya: 35, Parakrama: 85, NuwaraWewa: 28, Ridiyagama: 25 },
    { day: 'Tue', Minneriya: 30, Parakrama: 83, NuwaraWewa: 22, Ridiyagama: 20 },
    { day: 'Wed', Minneriya: 26, Parakrama: 81, NuwaraWewa: 19, Ridiyagama: 16 },
    { day: 'Thu', Minneriya: 22, Parakrama: 80, NuwaraWewa: 16, Ridiyagama: 13 },
    { day: 'Fri', Minneriya: 20, Parakrama: 79, NuwaraWewa: 15, Ridiyagama: 12 },
    { day: 'Sat', Minneriya: 19, Parakrama: 78, NuwaraWewa: 15, Ridiyagama: 12 },
    { day: 'Today', Minneriya: 18, Parakrama: 78, NuwaraWewa: 15, Ridiyagama: 12 },
  ];

  const fetchTanks = async () => {
    setLoading(true);
    try {
      const res = await tankService.getAll(selectedDistrict);
      if (res.data && (res.data.tanks || res.data.data)) {
        setTanks(res.data.tanks || res.data.data);
      }
      setHistoryData(defaultHistory);
    } catch (err) {
      console.warn("Using fallback tank list:", err);
      setTanks([
        { id: 'tnk-1', _id: 'tnk-1', district: 'Polonnaruwa', villageId: 'v-siripura', name: 'Minneriya Tank (Polonnaruwa)', capacity: 500000, currentVolume: 90000, levelPercentage: 18, status: 'CRITICAL', locationCoordinates: '8.0321° N, 80.9022° E' },
        { id: 'tnk-2', _id: 'tnk-2', district: 'Polonnaruwa', villageId: 'v-medirigiriya', name: 'Parakrama Samudraya Reservoir', capacity: 1000000, currentVolume: 780000, levelPercentage: 78, status: 'NORMAL', locationCoordinates: '7.9403° N, 81.0028° E' },
        { id: 'tnk-5', _id: 'tnk-5', district: 'Anuradhapura', villageId: 'v-mihintale', name: 'Nuwara Wewa Reservoir (Anuradhapura)', capacity: 450000, currentVolume: 67500, levelPercentage: 15, status: 'CRITICAL', locationCoordinates: '8.3451° N, 80.4121° E' },
        { id: 'tnk-7', _id: 'tnk-7', district: 'Hambantota', villageId: 'v-suriyawewa', name: 'Ridiyagama Reservoir (Hambantota)', capacity: 600000, currentVolume: 72000, levelPercentage: 12, status: 'CRITICAL', locationCoordinates: '6.2110° N, 81.0120° E' },
      ]);
      setHistoryData(defaultHistory);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTanks();
  }, [selectedDistrict]);

  const getStatusBadge = (percentage) => {
    if (percentage < 20) {
      return <span className="badge badge-critical">0 - 19%: CRITICAL</span>;
    } else if (percentage < 40) {
      return <span className="badge badge-high" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>20 - 39%: WARNING</span>;
    } else if (percentage < 70) {
      return <span className="badge badge-medium">40 - 69%: LOW</span>;
    } else {
      return <span className="badge badge-low">70 - 100%: NORMAL</span>;
    }
  };

  const calculateStatus = (percentage) => {
    if (percentage < 20) return 'CRITICAL';
    if (percentage < 40) return 'WARNING';
    if (percentage < 70) return 'LOW';
    return 'NORMAL';
  };

  const handleOpenUpdateModal = (tank) => {
    setSelectedTank(tank);
    setNewVolumeInput(tank.currentVolume);
    setUpdateSuccessMsg('');
  };

  const handleSaveVolume = async (e) => {
    e.preventDefault();
    if (!selectedTank) return;

    const newVol = Number(newVolumeInput);
    if (isNaN(newVol) || newVol < 0 || newVol > selectedTank.capacity) {
      alert(`Please enter a valid volume between 0 and total capacity (${selectedTank.capacity} L).`);
      return;
    }

    const calculatedPct = Math.round((newVol / selectedTank.capacity) * 100);
    const newStatus = calculateStatus(calculatedPct);

    setIsUpdating(true);
    try {
      await tankService.updateLevel(selectedTank.id || selectedTank._id, {
        currentVolume: newVol,
        levelPercentage: calculatedPct,
        status: newStatus
      });

      // Update local state
      setTanks(tanks.map(t => {
        if ((t.id || t._id) === (selectedTank.id || selectedTank._id)) {
          return {
            ...t,
            currentVolume: newVol,
            levelPercentage: calculatedPct,
            status: newStatus
          };
        }
        return t;
      }));

      setUpdateSuccessMsg(`Successfully updated level for ${selectedTank.name} to ${calculatedPct}% (${newStatus})!`);
      setTimeout(() => {
        setSelectedTank(null);
      }, 1200);
    } catch (err) {
      console.warn("API error updating tank, applying locally:", err);
      setTanks(tanks.map(t => {
        if ((t.id || t._id) === (selectedTank.id || selectedTank._id)) {
          return {
            ...t,
            currentVolume: newVol,
            levelPercentage: calculatedPct,
            status: newStatus
          };
        }
        return t;
      }));
      setUpdateSuccessMsg(`Updated locally: ${selectedTank.name} level is now ${calculatedPct}% (${newStatus})`);
      setTimeout(() => {
        setSelectedTank(null);
      }, 1200);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ padding: '2rem 2rem 4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              background: 'rgba(59, 130, 246, 0.2)', 
              color: '#60a5fa', 
              border: '1px solid rgba(59, 130, 246, 0.4)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              Member 3 Component
            </span>
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            TANK MONITORING & CAPACITY MANAGEMENT
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Track main reservoirs, automate threshold alerts, update volumes, and analyze 7-day historical trends.
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={fetchTanks}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Sync Level Data
        </button>
      </div>

      {/* Threshold Rules Reference Card */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sliders size={18} color="#60a5fa" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
            AUTOMATED TANK LEVEL STATUS THRESHOLD RULES
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem' }}>
            <div style={{ color: '#f87171', fontWeight: '800', fontSize: '0.85rem' }}>0 - 19% → CRITICAL</div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.25rem' }}>Triggers priority dispatch pipeline</div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '0.5rem' }}>
            <div style={{ color: '#fbbf24', fontWeight: '800', fontSize: '0.85rem' }}>20 - 39% → WARNING</div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.25rem' }}>High priority monitoring state</div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '0.5rem' }}>
            <div style={{ color: '#facc15', fontWeight: '800', fontSize: '0.85rem' }}>40 - 69% → LOW</div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.25rem' }}>Moderate capacity available</div>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '0.5rem' }}>
            <div style={{ color: '#34d399', fontWeight: '800', fontSize: '0.85rem' }}>70 - 100% → NORMAL</div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.25rem' }}>Sufficient water supply</div>
          </div>
        </div>
      </div>

      {/* Recharts 7-Day History Chart */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
              7-Day Water Level Trend History (%)
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
              Historical capacity percentage across Polonnaruwa reservoirs
            </p>
          </div>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 100]} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="Minneriya" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Parakrama" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Giritale" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Kaudulla" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Managed Tank Cards Grid */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', marginBottom: '1rem' }}>
        Active Monitored Tanks
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {tanks.map((tank) => {
          const colorClass = 
            tank.levelPercentage < 20 ? '#ef4444' :
            tank.levelPercentage < 40 ? '#f59e0b' :
            tank.levelPercentage < 70 ? '#facc15' : '#10b981';

          return (
            <div 
              key={tank.id || tank._id}
              className="glass-card"
              style={{ padding: '1.5rem', borderTop: `4px solid ${colorClass}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                    {tank.name}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Coords: {tank.locationCoordinates || '8.000° N, 80.950° E'}
                  </div>
                </div>
                {getStatusBadge(tank.levelPercentage)}
              </div>

              {/* Progress Level Bar */}
              <div style={{ margin: '1.25rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Water Volume</span>
                  <span style={{ color: '#f8fafc', fontWeight: '700' }}>
                    {tank.levelPercentage}% ({tank.currentVolume?.toLocaleString()} / {tank.capacity?.toLocaleString()} L)
                  </span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${tank.levelPercentage}%`, 
                      background: colorClass, 
                      height: '100%',
                      transition: 'width 0.4s ease' 
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Village Ref: <span style={{ color: '#cbd5e1', fontWeight: '600' }}>{tank.villageId}</span>
                </div>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenUpdateModal(tank)}
                  style={{ gap: '0.35rem' }}
                >
                  <Edit size={14} /> Update Level
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Updating Tank Water Level */}
      {selectedTank && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                Update Tank Volume Level
              </h3>
              <button 
                onClick={() => setSelectedTank(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Target Tank: <strong style={{ color: '#f8fafc' }}>{selectedTank.name}</strong><br/>
              Maximum Capacity: <strong style={{ color: '#38bdf8' }}>{selectedTank.capacity?.toLocaleString()} Liters</strong>
            </p>

            {updateSuccessMsg && (
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {updateSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveVolume}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Current Water Volume (Liters):
                </label>
                <input 
                  type="number"
                  className="form-control"
                  value={newVolumeInput}
                  onChange={(e) => setNewVolumeInput(e.target.value)}
                  min={0}
                  max={selectedTank.capacity}
                  required
                  style={{ fontSize: '1.1rem', fontWeight: '700' }}
                />
                
                {/* Calculated preview */}
                {newVolumeInput !== '' && !isNaN(Number(newVolumeInput)) && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                    Calculated Percentage: <strong style={{ color: '#38bdf8' }}>{Math.round((Number(newVolumeInput) / selectedTank.capacity) * 100)}%</strong><br />
                    New Status: <strong>{getStatusBadge(Math.round((Number(newVolumeInput) / selectedTank.capacity) * 100))}</strong>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedTank(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  <Save size={16} />
                  {isUpdating ? 'Saving Level...' : 'Save & Re-calculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
