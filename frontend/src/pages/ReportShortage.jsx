import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createWaterReport } from '../services/api';

const ReportShortage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    village: id,
    waterAvailable: 'false',
    lastReceivedDate: '',
    peopleAffected: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        waterAvailable: formData.waterAvailable === 'true',
        peopleAffected: parseInt(formData.peopleAffected) || 0
      };
      await createWaterReport(payload);
      navigate(`/reports/${id}`);
    } catch (error) {
      console.error("Error submitting report", error);
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h1 className="text-3xl font-bold mb-4">Report Water Shortage</h1>
        <p className="text-muted mb-4">Submit a report to notify officials of a water shortage in your area.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Is water currently available?</label>
            <select 
              name="waterAvailable" 
              value={formData.waterAvailable} 
              onChange={handleChange} 
              className="form-select"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">When was water last received?</label>
            <input 
              type="date" 
              name="lastReceivedDate" 
              value={formData.lastReceivedDate} 
              onChange={handleChange} 
              className="form-input" 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated number of people affected</label>
            <input 
              type="number" 
              name="peopleAffected" 
              value={formData.peopleAffected} 
              onChange={handleChange} 
              className="form-input" 
              placeholder="e.g., 120"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Information</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="form-textarea" 
              rows="4"
              placeholder="e.g., Tank completely dry, alternative sources exhausted..."
            ></textarea>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" className="btn btn-outline flex-1" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportShortage;
