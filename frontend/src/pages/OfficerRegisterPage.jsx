import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DRY_ZONE_DISTRICTS } from '../context/DistrictContext';
import { 
  Droplet, 
  UserPlus, 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  User, 
  MapPin, 
  Phone, 
  BadgeCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck,
  Building2,
  Check,
  Sparkles,
  Radio,
  Award,
  Layers,
  Compass,
  Wand2
} from 'lucide-react';

const DISTRICT_DETAILS = {
  Polonnaruwa: { province: 'North Central Province', reservoir: 'Parakrama Samudraya & Minneriya Wewa' },
  Anuradhapura: { province: 'North Central Province', reservoir: 'Nuwara Wewa & Tissa Wewa' },
  Hambantota: { province: 'Southern Province', reservoir: 'Ridiyagama Reservoir & Lunugamvehera' },
  Puttalam: { province: 'North Western Province', reservoir: 'Tabbowa Tank & Inginimitiya' },
  Mannar: { province: 'Northern Province', reservoir: 'Giant\'s Tank (Kattu Karai)' },
  Vavuniya: { province: 'Northern Province', reservoir: 'Pavakkulam Tank' },
  Mullaitivu: { province: 'Northern Province', reservoir: 'Visvamadu & Kanakarayan Wewa' },
  Kilinochchi: { province: 'Northern Province', reservoir: 'Iranamadu Reservoir' },
  Jaffna: { province: 'Northern Province', reservoir: 'Chundikulam Saline Storage' },
  Trincomalee: { province: 'Eastern Province', reservoir: 'Kantale Reservoir' },
  Batticaloa: { province: 'Eastern Province', reservoir: 'Unnichchai Tank & Vakaneri' },
  Ampara: { province: 'Eastern Province', reservoir: 'Senanayake Samudraya' },
  Moneragala: { province: 'Uva Province', reservoir: 'Nagadeepa Wewa & Muthukandiya' },
  Kurunegala: { province: 'North Western Province', reservoir: 'Hakwatuna Oya Dry Sector' }
};

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate Password Strength (0 to 100%)
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: '#64748b' };
    let score = 0;
    if (pwd.length >= 6) score += 30;
    if (pwd.length >= 10) score += 20;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 15;

    if (score < 40) return { score, label: 'Weak', color: '#f43f5e' };
    if (score < 75) return { score, label: 'Medium', color: '#f59e0b' };
    return { score, label: 'Strong & Secure', color: '#10b981' };
  };

  const pwdStrength = calculatePasswordStrength(formData.password);
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  // Quick helper to fill test officer sample data
  const handleAutoFillSample = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFormData({
      name: 'Sunil Wickramasinghe',
      email: `officer.sunil${randomNum}@waterboard.lk`,
      district: 'Polonnaruwa',
      officerId: `NWSDB-W${randomNum}`,
      contact: '+94 77 482 9102',
      password: 'WaterOfficer@2026',
      confirmPassword: 'WaterOfficer@2026'
    });
  };

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
      setSuccess('Officer Credentials Verified & Registered! Directing to Officer Portal...');
      setTimeout(() => {
        navigate('/officer/dashboard');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentDistrictInfo = DISTRICT_DETAILS[formData.district] || {
    province: 'Dry Zone Sri Lanka',
    reservoir: 'Regional Reservoirs & Tank Network'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 10%, #1e293b 0%, #0b1120 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem',
      color: '#f8fafc',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '1080px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(0, 242, 254, 0.18)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))'
      }}>
        
        {/* Left Side: Visual Hero, Dynamic Officer Badge & Info */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))',
          padding: '2.75rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            {/* Header branding */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(0, 242, 254, 0.35)'
                }}>
                  <ShieldCheck size={26} color="#0f172a" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: '900', margin: 0, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                    WATERWATCH
                  </h2>
                  <div style={{ fontSize: '0.75rem', color: '#00f2fe', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    National Dry Zone Relief Network
                  </div>
                </div>
              </div>

              {/* Quick sample generator for fast testing */}
              <button
                type="button"
                onClick={handleAutoFillSample}
                style={{
                  background: 'rgba(0, 242, 254, 0.1)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  color: '#00f2fe',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s ease'
                }}
                title="Fill sample officer details for quick testing"
              >
                <Wand2 size={13} /> Auto-Fill Demo
              </button>
            </div>

            <h3 style={{ fontSize: '1.65rem', fontWeight: '800', lineHeight: '1.25', marginBottom: '0.75rem', color: '#f8fafc' }}>
              Official Officer Accreditation Gateway
            </h3>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.55', marginBottom: '1.5rem' }}>
              Create an authorized Water Supply Officer account to manage emergency bowsers, track regional water shortages, and issue relief dispatches across all Sri Lanka Dry Zone districts.
            </p>

            {/* Dynamic Interactive Digital Officer ID Badge Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(16, 185, 129, 0.08))',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px dashed rgba(255, 255, 255, 0.12)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={16} color="#00f2fe" />
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#cbd5e1', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    NWSDB Officer Badge Preview
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: '#34d399',
                  background: 'rgba(52, 211, 153, 0.15)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(52, 211, 153, 0.3)'
                }}>
                  <Radio size={10} className="pulse" /> LIVE ID BADGE
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                  border: '2px solid #00f2fe',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  flexShrink: 0
                }}>
                  <User size={30} color="#00f2fe" />
                  <span style={{ fontSize: '0.55rem', color: '#94a3b8', marginTop: '2px', fontWeight: '700' }}>OFFICER</span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formData.name || 'Officer Name Here'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#00f2fe', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                    <BadgeCheck size={14} /> ID: {formData.officerId || 'NWSDB-PENDING'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={12} color="#38bdf8" /> {formData.district} Sector ({currentDistrictInfo.province})
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Card with Overlay */}
            <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1.5rem', position: 'relative' }}>
              <img 
                src="/water_bowser_truck.jpg" 
                alt="Emergency Water Bowser Fleet" 
                style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.2))', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={14} color="#00f2fe" /> High-Priority Water Bowser Fleet Management
                </div>
                <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '2px' }}>
                  Coverage: {currentDistrictInfo.reservoir}
                </div>
              </div>
            </div>

            {/* Officer Privileges Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.65rem', borderRadius: '8px' }}>
                <Check size={14} color="#34d399" />
                <span>Bowser Fleet Control</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.65rem', borderRadius: '8px' }}>
                <Check size={14} color="#34d399" />
                <span>1-Click Dispatching</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.65rem', borderRadius: '8px' }}>
                <Check size={14} color="#34d399" />
                <span>Resident Queue Verification</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.65rem', borderRadius: '8px' }}>
                <Check size={14} color="#34d399" />
                <span>Tank Capacity Alerting</span>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Security Protocol: <strong style={{ color: '#00f2fe' }}>JWT Encrypted Officer Clearance</strong></span>
            <span style={{ color: '#38bdf8' }}>Role: <strong>Officer</strong></span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div style={{ padding: '2.75rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              Officer Registration
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Enter your official credentials below to set up your account
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
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} /> <span>{error}</span>
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
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} /> <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <label className="form-label" style={{ fontWeight: '700', fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>Full Officer Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sunil Wickramasinghe"
                />
              </div>
            </div>

            {/* Official Email */}
            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <label className="form-label" style={{ fontWeight: '700', fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>Official Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. officer.sunil@waterboard.lk"
                />
              </div>
            </div>

            {/* District & Officer ID Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.1rem' }}>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>Assigned District</label>
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
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>Officer ID Code</label>
                <div style={{ position: 'relative' }}>
                  <BadgeCheck size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                    value={formData.officerId}
                    onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
                    placeholder="e.g. NWSDB-W402"
                  />
                </div>
              </div>

            </div>

            {/* Contact Mobile */}
            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <label className="form-label" style={{ fontWeight: '700', fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>Contact Mobile Number</label>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.75rem' }}>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.35rem', display: 'block' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </div>

            {/* Password Strength Indicator & Match Badge */}
            <div style={{ marginBottom: '1.35rem' }}>
              {formData.password && (
                <div style={{ marginTop: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.725rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#94a3b8' }}>Password Strength:</span>
                    <strong style={{ color: pwdStrength.color }}>{pwdStrength.label}</strong>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pwdStrength.score}%`,
                      height: '100%',
                      background: pwdStrength.color,
                      transition: 'all 0.3s ease'
                    }} />
                  </div>
                </div>
              )}

              {formData.confirmPassword && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.725rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {passwordsMatch ? (
                    <span style={{ color: '#34d399', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Check size={12} /> Passwords match perfectly
                    </span>
                  ) : (
                    <span style={{ color: '#fb7185', fontWeight: '700' }}>
                      Passwords do not match yet
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.975rem',
                background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                color: '#0f172a',
                fontWeight: '800',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(0, 242, 254, 0.25)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  Verifying Officer Credentials...
                </>
              ) : (
                <>
                  <UserPlus size={18} /> Register Water Officer Account
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.15rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
            fontSize: '0.85rem',
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

