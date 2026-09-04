import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Droplet, 
  Users, 
  Calendar,
  Download
} from 'lucide-react';

export default function SystemAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  // Chart Data 1: Water Shortages by Village
  const shortagesData = [
    { village: 'Siripura', count: 18, severity: 'Critical' },
    { village: 'Medirigiriya', count: 14, severity: 'High' },
    { village: 'Bakamuna', count: 9, severity: 'Medium' },
    { village: 'Welikanda', count: 6, severity: 'Low' },
    { village: 'Lankapura', count: 4, severity: 'Low' },
    { village: 'Hingurakgoda', count: 3, severity: 'Low' },
  ];

  // Chart Data 2: People Affected per Village
  const peopleAffectedData = [
    { village: 'Medirigiriya', people: 6100 },
    { village: 'Siripura', people: 4200 },
    { village: 'Bakamuna', people: 3800 },
    { village: 'Hingurakgoda', people: 3100 },
    { village: 'Welikanda', people: 2900 },
  ];

  // Chart Data 3: Water Volume Delivered vs Required (Liters)
  const volumeTrendData = [
    { day: 'Mon', required: 45000, delivered: 32000 },
    { day: 'Tue', required: 48000, delivered: 35000 },
    { day: 'Wed', required: 52000, delivered: 40000 },
    { day: 'Thu', required: 50000, delivered: 42000 },
    { day: 'Fri', required: 55000, delivered: 46000 },
    { day: 'Sat', required: 58000, delivered: 50000 },
    { day: 'Sun', required: 60000, delivered: 54000 },
  ];

  // Chart Data 4: Tank Levels Comparison (%)
  const tankLevelsData = [
    { tank: 'Minneriya', percentage: 18, color: '#ef4444' },
    { tank: 'Kaudulla', percentage: 34, color: '#f59e0b' },
    { tank: 'Giritale', percentage: 45, color: '#facc15' },
    { tank: 'Parakrama', percentage: 78, color: '#10b981' },
  ];

  const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];

  return (
    <div style={{ padding: '2rem 2rem 4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ 
              background: 'rgba(236, 72, 153, 0.2)', 
              color: '#f472b6', 
              border: '1px solid rgba(236, 72, 153, 0.4)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              Member 3 Analytics Suite
            </span>
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            DROUGHT & SYSTEM ANALYTICS
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Interactive charts for shortage frequency, population impact, supply deficits & tank comparison.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.2rem' }}>
            <button 
              className={`btn btn-sm ${timeRange === '7d' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTimeRange('7d')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              7 Days
            </button>
            <button 
              className={`btn btn-sm ${timeRange === '30d' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTimeRange('30d')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              30 Days
            </button>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => alert("Downloading Polonnaruwa Water Analytics PDF Report...")}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Grid Row 1: Shortages by Village & People Affected */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Chart 1: Water Shortages Frequency by Village */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart3 size={20} color="#ec4899" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
              Reported Shortages by Village
            </h3>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shortagesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="village" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }} />
                <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} name="Shortage Reports" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Total People Affected */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Users size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
              Population Affected per Village
            </h3>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peopleAffectedData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="village" type="category" stroke="#94a3b8" width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }} />
                <Bar dataKey="people" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Residents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Water Volume Delivered vs Required & Tank Levels Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        
        {/* Chart 3: Volume Delivered vs Required */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Droplet size={20} color="#06b6d4" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
              Water Delivered vs Required (Liters)
            </h3>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }} />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="required" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.2)" strokeWidth={2} name="Required Volume (L)" />
                <Area type="monotone" dataKey="delivered" stroke="#06b6d4" fill="rgba(6, 182, 212, 0.3)" strokeWidth={2} name="Delivered Volume (L)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Tank Levels Comparison */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
              Tank Water Capacity Comparison (%)
            </h3>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tankLevelsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="tank" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }} />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]} name="Capacity %">
                  {tankLevelsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
