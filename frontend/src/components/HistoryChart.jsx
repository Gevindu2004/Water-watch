import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { formatDate } from '../utils/statusUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
      }}>
        <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>
          {formatDate(data.date)}
        </p>
        <p style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.1rem', margin: '4px 0' }}>
          Water Level: {data.percentage}%
        </p>
        <p style={{ color: '#cbd5e1', fontSize: '0.8rem', margin: 0 }}>
          Volume: {data.level} MCM
        </p>
        <p style={{ color: data.status === 'CRITICAL' ? '#f87171' : '#34d399', fontSize: '0.75rem', marginTop: '4px', fontWeight: 700 }}>
          Status: {data.status}
        </p>
      </div>
    );
  }
  return null;
};

export default function HistoryChart({ history = [], tankName = 'Tank' }) {
  if (!history || history.length === 0) {
    return <div style={{ padding: '20px', color: '#94a3b8', textAlign: 'center' }}>No historical water level data recorded yet.</div>;
  }

  // Format data for chart display
  const chartData = history.map((item, index) => {
    const d = new Date(item.date);
    const dayLabel = d.toLocaleDateString([], { weekday: 'short' });
    return {
      ...item,
      dayLabel: `${dayLabel} (${d.getDate()}/${d.getMonth()+1})`,
      percentage: Number(item.percentage)
    };
  });

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
            Water Level – Last 7 Days ({tankName})
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
            GET /api/tanks/:id/history
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
          <span style={{ color: '#ef4444' }}>🔴 Critical (0-19%)</span>
          <span style={{ color: '#f59e0b' }}>🟠 Warning (20-39%)</span>
          <span style={{ color: '#3b82f6' }}>🔵 Low (40-69%)</span>
          <span style={{ color: '#10b981' }}>🟢 Normal (70-100%)</span>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
            <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />

            {/* Threshold line markers */}
            <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Critical Threshold (20%)', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Warning (40%)', fill: '#f59e0b', fontSize: 10 }} />
            <ReferenceLine y={70} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Normal (70%)', fill: '#10b981', fontSize: 10 }} />

            <Area
              type="monotone"
              dataKey="percentage"
              stroke="#38bdf8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorLevel)"
              dot={{ r: 5, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }}
              activeDot={{ r: 8, fill: '#38bdf8' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
