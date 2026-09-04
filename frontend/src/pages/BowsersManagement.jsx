import React, { useState, useEffect } from 'react';
import { bowserService } from '../services/api';
import { Truck, Plus, RefreshCw, Phone, User, MapPin, Edit, CheckCircle, AlertCircle, Search, Trash2 } from 'lucide-react';

export default function BowsersManagement() {
  const [bowsers, setBowsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBowser, setEditingBowser] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    bowserId: '',
    registrationNumber: '',
    capacity: 5000,
    currentLocation: 'Polonnaruwa Central Depot',
    status: 'Available',
    driverName: '',
    driverContact: ''
  });

  const fetchBowsers = async () => {
    setLoading(true);
    try {
      const res = await bowserService.getAll();
      setBowsers(res.data.data || []);
    } catch (err) {
      console.error('Error fetching bowsers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBowsers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bowserService.updateStatus(id, newStatus);
      fetchBowsers();
    } catch (err) {
      alert('Failed to update bowser status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, bowserId) => {
    if (window.confirm(`Are you sure you want to deactivate/delete Bowser ${bowserId}?`)) {
      try {
        await bowserService.delete(id || bowserId);
        fetchBowsers();
      } catch (err) {
        alert('Failed to delete bowser: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBowser) {
        await bowserService.update(editingBowser._id || editingBowser.bowserId, formData);
      } else {
        await bowserService.create(formData);
      }
      setShowAddModal(false);
      setEditingBowser(null);
      setFormData({
        bowserId: '',
        registrationNumber: '',
        capacity: 5000,
        currentLocation: 'Polonnaruwa Central Depot',
        status: 'Available',
        driverName: '',
        driverContact: ''
      });
      fetchBowsers();
    } catch (err) {
      alert('Error saving bowser: ' + (err.response?.data?.message || err.message));
    }
  };

  const openEditModal = (bowser) => {
    setEditingBowser(bowser);
    setFormData({
      bowserId: bowser.bowserId,
      registrationNumber: bowser.registrationNumber,
      capacity: bowser.capacity,
      currentLocation: bowser.currentLocation,
      status: bowser.status,
      driverName: bowser.driverName,
      driverContact: bowser.driverContact
    });
    setShowAddModal(true);
  };

  const filteredBowsers = bowsers.filter(b => {
    const matchesFilter = activeFilter === 'All' || b.status === activeFilter;
    const matchesSearch = b.bowserId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Bowser Fleet Management</h1>
          <p className="page-description">Manage municipal water tankers, driver contacts, and current locations</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={fetchBowsers}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={() => {
            setEditingBowser(null);
            setFormData({
              bowserId: '',
              registrationNumber: '',
              capacity: 5000,
              currentLocation: 'Polonnaruwa Central Depot',
              status: 'Available',
              driverName: '',
              driverContact: ''
            });
            setShowAddModal(true);
          }}>
            <Plus size={18} /> Add New Bowser
          </button>
        </div>
      </div>

      {/* Fleet Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Truck size={24} />
          </div>
          <div>
            <div className="stat-value">{bowsers.length}</div>
            <div className="stat-label">Total Fleet Size</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-value">{bowsers.filter(b => b.status === 'Available').length}</div>
            <div className="stat-label">Available for Dispatch</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#38bdf8' }}>
            <MapPin size={24} />
          </div>
          <div>
            <div className="stat-value">{bowsers.filter(b => b.status === 'On The Way' || b.status === 'Distributing').length}</div>
            <div className="stat-label">Currently In Transit / Distributing</div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="toolbar">
        <div className="filter-pills">
          {['All', 'Available', 'Assigned', 'On The Way', 'Distributing', 'Completed', 'Delayed'].map(filter => (
            <button
              key={filter}
              className={`filter-pill ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search bowser ID, vehicle plate, or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bowsers Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="spin" style={{ marginBottom: '0.5rem' }} />
          <div>Loading fleet records...</div>
        </div>
      ) : filteredBowsers.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-color)',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center'
        }}>
          <AlertCircle size={36} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
          <h3>No Bowsers Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            No bowser matches your selected filter or search term.
          </p>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredBowsers.map(b => (
            <div key={b._id || b.bowserId} className="card">
              <div>
                <div className="card-header">
                  <div>
                    <div className="card-title">🚛 {b.bowserId}</div>
                    <div className="card-subtitle">Plate: {b.registrationNumber}</div>
                  </div>
                  <span className={`badge badge-${b.status.replace(/\s+/g, '-')}`}>
                    {b.status}
                  </span>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="info-label"><Truck size={15} /> Water Capacity:</span>
                    <span className="info-value">{b.capacity.toLocaleString()} Liters</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label"><MapPin size={15} /> Current Location:</span>
                    <span className="info-value">{b.currentLocation}</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label"><User size={15} /> Assigned Driver:</span>
                    <span className="info-value">{b.driverName}</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label"><Phone size={15} /> Driver Contact:</span>
                    <span className="info-value">{b.driverContact}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <select
                  className="form-select"
                  style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', flex: 1 }}
                  value={b.status}
                  onChange={(e) => handleStatusChange(b._id || b.bowserId, e.target.value)}
                >
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="On The Way">On The Way</option>
                  <option value="Distributing">Distributing</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                </select>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => openEditModal(b)}
                  title="Edit Bowser Details"
                >
                  <Edit size={14} /> Edit
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#fb7185', borderColor: 'rgba(251, 113, 133, 0.3)' }}
                  onClick={() => handleDelete(b._id, b.bowserId)}
                  title="Deactivate / Delete Bowser"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Bowser Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingBowser ? 'Edit Bowser Details' : 'Register New Bowser'}</h3>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Bowser Identification ID (e.g. WB-102)</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  disabled={!!editingBowser}
                  placeholder="WB-102"
                  value={formData.bowserId}
                  onChange={(e) => setFormData({ ...formData, bowserId: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Registration Number (Plate)</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="WP CP-4821"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Water Capacity (Liters)</label>
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

              <div className="form-group">
                <label className="form-label">Current Base / Location</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Polonnaruwa Central Depot"
                  value={formData.currentLocation}
                  onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="On The Way">On The Way</option>
                  <option value="Distributing">Distributing</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Driver Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Sarath Kumara"
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Driver Phone / Contact</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+94 77 123 4567"
                  value={formData.driverContact}
                  onChange={(e) => setFormData({ ...formData, driverContact: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBowser ? 'Update Bowser' : 'Save Bowser'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
