import React, { useState } from 'react';
import { CheckCircle2, UserPlus } from 'lucide-react';
import { authService } from '../services/api';
import { useDistrict } from '../context/DistrictContext';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  district: ''
};

export default function OfficerRegistrationPage() {
  const { DRY_ZONE_DISTRICTS } = useDistrict();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (form.password !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setSubmitting(true);
    try {
      const { confirmPassword, ...details } = form;
      const response = await authService.registerOfficer(details);
      setStatus({ type: 'success', message: response.data.message || 'Officer registered successfully.' });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Officer registration failed. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Register Water Officer</h1>
          <p className="page-description">
            Create an officer account for the WaterWatch operations team.
          </p>
        </div>
        <UserPlus size={32} color="#38bdf8" />
      </div>

      <div className="card" style={{ maxWidth: '680px' }}>
        {status.message && (
          <div
            role="alert"
            style={{
              marginBottom: '1.25rem',
              padding: '0.9rem 1rem',
              borderRadius: '0.65rem',
              color: status.type === 'success' ? '#34d399' : '#fb7185',
              background: status.type === 'success' ? 'rgba(52, 211, 153, 0.12)' : 'rgba(251, 113, 133, 0.12)',
              border: `1px solid ${status.type === 'success' ? 'rgba(52, 211, 153, 0.35)' : 'rgba(251, 113, 133, 0.35)'}`
            }}
          >
            {status.type === 'success' && <CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="officer-name">Full name</label>
            <input id="officer-name" name="name" className="form-control" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="officer-email">Official email</label>
            <input id="officer-email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="officer-district">Assigned district</label>
            <select id="officer-district" name="district" className="form-control" value={form.district} onChange={handleChange} required>
              <option value="">Select a district</option>
              {DRY_ZONE_DISTRICTS.filter(district => district.id !== 'All').map(district => (
                <option key={district.id} value={district.id}>{district.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="officer-password">Password</label>
              <input id="officer-password" name="password" type="password" minLength="6" className="form-control" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="officer-confirm-password">Confirm password</label>
              <input id="officer-confirm-password" name="confirmPassword" type="password" minLength="6" className="form-control" value={form.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            <UserPlus size={17} />
            {submitting ? 'Registering...' : 'Register Officer'}
          </button>
        </form>
      </div>
    </div>
  );
}
