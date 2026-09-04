import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DRY_ZONE_DISTRICTS } from '../context/DistrictContext';
import { 
  Droplet, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  Phone, 
  BadgeCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck,
  Building2,
  Check
} from 'lucide-react';

export default function OfficerRegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    district: 'Polonnaruwa',
    officerId: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter both passwords.');
      return;
    }

    setLoading(true);

    try {
      if (register) {
        await register(formData.name, formData.email, formData.password, 'officer', formData.district);
      }
      setSuccess('Officer Account Successfully Registered! Directing to Officer Portal...');
      setTimeout(() => {
        navigate('/officer/dashboard');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1e293b, #0b1120)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem',
      color: '#f8fafc'
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '960px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(0, 242, 254, 0.15)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))'
      }}>
        
        {/* Left Side: Visual Hero & Information Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0, 242, 254, 0.3)'
              }}>
                <ShieldCheck size={28} color="#0f172a" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, color: '#f8fafc' }}>
                  WATERWATCH
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#00f2fe', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dry Zone Relief Network
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: '1.25', marginBottom: '1rem', color: '#f8fafc' }}>
              Official Officer Operations Access
            </h3>

            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              Register your credentials as an authorized Water Supply Officer to manage emergency bowser dispatches and tank levels across Sri Lanka.
            </p>

            {/* Photo Image Card */}
            <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(0, 242, 254, 0.3)', marginBottom: '2rem', position: 'relative' }}>
              <img 
                src="/water_bowser_truck.jpg" 
                alt="Emergency Water Bowser Truck" 
                style={{ width: '100%', height: '170px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)', padding: '0.75rem 1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Building2 size={14} /> National Water Supply & Drainage Board
                </div>
              </div>
            </div>

            {/* Officer Privileges Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.2rem', borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  <Check size={12} color="#34d399" />
                </div>
                <span>District-Wide Bowser Fleet Tracking</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.2rem', borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  <Check size={12} color="#34d399" />
                </div>
                <span>1-Click Emergency Bowser Dispatch</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.2rem', borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  <Check size={12} color="#34d399" />
                </div>
                <span>Resident Queue Verification Clearance</span>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem', color: '#64748b' }}>
            Role Authorization: <strong style={{ color: '#00f2fe' }}>role = officer</strong>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              Officer Registration
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Fill in your official officer profile details below
            </p>
          </div>

          {/* Notifications */}
          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#fb7185',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={18} /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', color: '#cbd5e1' }}>Full Officer Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kamal Perera"
                />
              </div>
            </div>

            {/* Official Email */}
            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', color: '#cbd5e1' }}>Official Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. kamal@waterboard.lk"
                />
              </div>
            </div>

            {/* District & Officer ID Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.15rem' }}>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', color: '#cbd5e1' }}>Assigned District</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#00f2fe', zIndex: 2 }} />
                  <select
                    className="form-select"
                    style={{ paddingLeft: '2.5rem', fontWeight: '700', color: '#00f2fe' }}
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  >
                    {DRY_ZONE_DISTRICTS.filter(d => d.id !== 'All').map(d => (
                      <option key={d.id} value={d.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', color: '#cbd5e1' }}>Officer ID Code</label>
                <div style={{ position: 'relative' }}>
                  <BadgeCheck size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                    value={formData.officerId}
                    onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
                    placeholder="e.g. NWSDB-402"
                  />
                </div>
              </div>

            </div>

            {/* Contact Mobile */}
            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', color: '#cbd5e1' }}>Contact Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="+94 77 123 4567"
                />
              </div>
            </div>

            {/* Password Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', color: '#cbd5e1' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', color: '#cbd5e1' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', color: '#0f172a', fontWeight: '800', border: 'none' }}
              disabled={loading}
            >
              {loading ? 'Creating Officer Account...' : (
                <>
                  <UserPlus size={18} /> Register Water Officer Account
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#94a3b8'
          }}>
            Already registered as an officer?{' '}
            <Link to="/login" style={{ color: '#00f2fe', fontWeight: '700', textDecoration: 'none' }}>
              Sign In to Portal
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
