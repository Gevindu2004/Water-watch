import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getVillageStatus, joinDeliveryQueue, updateVillage } from '../services/api';
import { Truck, Droplet, Users, AlertTriangle, Clock, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const VillageDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editData, setEditData] = useState({ tankLevel: 100, currentWaterStatus: 'Normal' });

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line
  }, [id]);

  const fetchStatus = async () => {
    try {
      const response = await getVillageStatus(id);
      setData(response.data);
      setEditData({
        tankLevel: response.data.village.tankLevel,
        currentWaterStatus: response.data.village.currentWaterStatus
      });
    } catch (error) {
      console.error("Error fetching village status", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!data.nextDelivery) return;
    try {
      await joinDeliveryQueue(data.nextDelivery._id);
      setData(prev => ({
        ...prev,
        nextDelivery: {
          ...prev.nextDelivery,
          peopleWaiting: prev.nextDelivery.peopleWaiting + 1
        }
      }));
      setJoined(true);
    } catch (error) {
      console.error("Error joining queue", error);
    }
  };

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateVillage(id, editData);
      setShowAdminPanel(false);
      fetchStatus();
    } catch (error) {
      console.error("Error updating village", error);
    }
  };

  if (loading) return <div className="container text-center mt-4">Loading...</div>;
  if (!data || !data.village) return <div className="container text-center mt-4">Village not found</div>;

  const { village, nextDelivery } = data;

  const formatDays = (days) => {
    if (days === 0) return 'Received today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-4">
        <h1 className="text-3xl font-bold">{village.name}</h1>
        <div className="flex gap-2">
          {user?.role === 'admin' && (
            <button className="btn btn-outline" onClick={() => setShowAdminPanel(!showAdminPanel)}>
              <Settings size={18} /> Manage Area
            </button>
          )}
          <Link to={`/report-shortage/${village._id}`} className="btn btn-primary">
            <AlertTriangle size={18} /> Report Shortage
          </Link>
        </div>
      </div>

      {showAdminPanel && user?.role === 'admin' && (
        <div className="card mb-4 bg-orange-50 border-orange-200" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-orange-800">
            <Settings size={20} /> Admin Controls
          </h2>
          <form onSubmit={handleAdminUpdate} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="form-group mb-0 flex-1">
              <label className="form-label">Tank Level (%)</label>
              <input type="number" className="form-input" min="0" max="100" value={editData.tankLevel} onChange={e => setEditData({...editData, tankLevel: parseInt(e.target.value)})} />
            </div>
            <div className="form-group mb-0 flex-1">
              <label className="form-label">Status</label>
              <select className="form-select" value={editData.currentWaterStatus} onChange={e => setEditData({...editData, currentWaterStatus: e.target.value})}>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary h-full">Update</button>
          </form>
        </div>
      )}

      <div className="grid-2">
        {/* Status Card */}
        <div className="card">
          <div className="card-header">
            <Droplet size={24} className="text-primary mr-2" />
            <span className="card-title">Current Status</span>
          </div>
          
          <div className="mb-4">
            <span className={`status-badge status-${village.currentWaterStatus}`}>
              <span className={`status-indicator indicator-${village.currentWaterStatus}`}></span>
              {village.currentWaterStatus} Water Level
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-between">
              <span className="text-muted">Last received:</span>
              <span className="font-semibold">{formatDays(village.daysWithoutWater)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">People affected:</span>
              <span className="font-semibold">~{village.affectedPopulation}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4" style={{borderTop: '1px solid var(--border-color)'}}>
            <div className="flex justify-between mb-2">
              <span className="text-muted">Nearby Tank Level</span>
              <span className="font-semibold">{village.tankLevel}%</span>
            </div>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{
                  width: `${village.tankLevel}%`, 
                  backgroundColor: village.tankLevel < 20 ? 'var(--status-critical)' : village.tankLevel < 40 ? 'var(--status-warning)' : 'var(--primary)'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Next Bowser Card */}
        <div className="card">
          <div className="card-header">
            <Truck size={24} className="text-primary mr-2" />
            <span className="card-title">Next Water Bowser</span>
          </div>
          
          {nextDelivery ? (
            <>
              <div className="mb-4">
                <div className="font-bold text-lg">{new Date(nextDelivery.expectedArrival).toLocaleDateString()}</div>
                <div className="text-primary font-semibold flex items-center gap-2">
                  <Clock size={16} /> 
                  {new Date(nextDelivery.expectedArrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="text-muted mt-2">{nextDelivery.distributionPoint}</div>
              </div>

              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-4" style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Users size={20} />
                  <span>{nextDelivery.peopleWaiting} people expected</span>
                </div>
              </div>

              {!joined ? (
                <button className="btn btn-primary btn-full" onClick={handleJoinQueue}>
                  I'm coming
                </button>
              ) : (
                <button className="btn btn-outline btn-full" disabled>
                  ✓ Expected in queue
                </button>
              )}
            </>
          ) : (
            <div className="text-center text-muted py-4">
              No bowsers scheduled at the moment.
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <Link to={`/reports/${village._id}`} className="text-primary font-semibold hover:underline">
          View Report History
        </Link>
      </div>
    </div>
  );
};

export default VillageDashboard;
