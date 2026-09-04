import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getVillages, addVillage } from '../services/api';
import { MapPin, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const VillageSelection = () => {
  const { user } = useContext(AuthContext);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVillage, setNewVillage] = useState({ name: '', currentWaterStatus: 'Normal', daysWithoutWater: 0, affectedPopulation: 0, tankLevel: 100 });

  useEffect(() => {
    fetchVillages();
  }, []);

  const fetchVillages = async () => {
    try {
      const response = await getVillages();
      setVillages(response.data);
    } catch (error) {
      console.error("Error fetching villages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVillage(newVillage);
      setShowAddForm(false);
      setNewVillage({ name: '', currentWaterStatus: 'Normal', daysWithoutWater: 0, affectedPopulation: 0, tankLevel: 100 });
      fetchVillages();
    } catch (error) {
      console.error("Error adding village", error);
    }
  };

  if (loading) {
    return <div className="container text-center mt-4">Loading villages...</div>;
  }

  return (
    <div className="container">
      <div className="text-center mb-4 flex justify-between items-center flex-col sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Select Your Village</h1>
          <p className="text-muted mt-2">Choose your location to view water status and upcoming deliveries.</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn btn-primary mt-4 sm:mt-0" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={18} /> Add Area
          </button>
        )}
      </div>

      {showAddForm && user?.role === 'admin' && (
        <div className="card mb-4 bg-gray-50">
          <h2 className="text-lg font-bold mb-3">Add New Village</h2>
          <form onSubmit={handleAddSubmit} className="grid-2">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" required value={newVillage.name} onChange={e => setNewVillage({...newVillage, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Tank Level (%)</label>
              <input type="number" className="form-input" min="0" max="100" required value={newVillage.tankLevel} onChange={e => setNewVillage({...newVillage, tankLevel: parseInt(e.target.value)})} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-primary">Save Area</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-2">
        {villages.map(village => (
          <Link key={village._id} to={`/village/${village._id}`}>
            <div className="card text-center">
              <MapPin size={32} className="text-muted mb-4 mx-auto" style={{ display: 'block' }} />
              <h2 className="card-title">{village.name}</h2>
              <div className="mt-4">
                <span className={`status-badge status-${village.currentWaterStatus}`}>
                  <span className={`status-indicator indicator-${village.currentWaterStatus}`}></span>
                  {village.currentWaterStatus}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VillageSelection;
