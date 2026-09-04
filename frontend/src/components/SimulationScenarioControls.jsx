import React, { useState } from 'react';
import { Sliders, RefreshCw, Zap, Check } from 'lucide-react';
import { updateShortage, resetDemoScenario } from '../services/api';

export default function SimulationScenarioControls({ onRefreshData }) {
  const [selectedVillage, setSelectedVillage] = useState('VIL-001');
  const [daysWithoutWater, setDaysWithoutWater] = useState(3);
  const [affectedPeople, setAffectedPeople] = useState(120);
  const [tankLevel, setTankLevel] = useState(18);
  const [daysSinceDelivery, setDaysSinceDelivery] = useState(4);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState('');

  const villagePresets = {
    'VIL-001': { name: 'Siripura', days: 3, people: 120, tank: 18, delivery: 4 },
    'VIL-002': { name: 'Bakamuna', days: 2, people: 80, tank: 25, delivery: 2 },
    'VIL-003': { name: 'Welikanda', days: 1, people: 200, tank: 42, delivery: 1 },
    'VIL-004': { name: 'Medirigiriya', days: 4, people: 60, tank: 30, delivery: 5 },
    'VIL-005': { name: 'Dimbulagala', days: 2, people: 150, tank: 35, delivery: 3 }
  };

  const handleVillageChange = (id) => {
    setSelectedVillage(id);
    const p = villagePresets[id];
    if (p) {
      setDaysWithoutWater(p.days);
      setAffectedPeople(p.people);
      setTankLevel(p.tank);
      setDaysSinceDelivery(p.delivery);
    }
  };

  const handleApplyUpdate = async () => {
    setUpdating(true);
    try {
      await updateShortage({
        villageId: selectedVillage,
        daysWithoutWater,
        affectedPeople,
        tankLevelPercentage: tankLevel,
        daysSinceLastDelivery: daysSinceDelivery
      });
      setFeedback('Parameters updated! Recalculating priority grid...');
      await onRefreshData();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error(err);
      setFeedback('Error updating parameters.');
    } finally {
      setUpdating(false);
    }
  };

  // Quick preset button: Make Welikanda critical crisis
  const handleSimulateWelikandaCrisis = async () => {
    setUpdating(true);
    try {
      await updateShortage({
        villageId: 'VIL-003',
        daysWithoutWater: 5,
        affectedPeople: 250,
        tankLevelPercentage: 10,
        daysSinceLastDelivery: 6
      });
      setSelectedVillage('VIL-003');
      setDaysWithoutWater(5);
      setAffectedPeople(250);
      setTankLevel(10);
      setDaysSinceDelivery(6);
      setFeedback('Simulated severe crisis in Welikanda (250 people, 5 days, 10% tank)!');
      await onRefreshData();
      setTimeout(() => setFeedback(''), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            padding: '0.35rem',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.15)'
          }}>
            <Sliders size={18} color="#F59E0B" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC' }}>
              Interactive Emergency Simulator
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Tweak real-time inputs to test priority engine dynamics live
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateWelikandaCrisis}
          disabled={updating}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#FCA5A5',
            fontSize: '0.72rem',
            fontWeight: 700
          }}
          title="Simulate sudden drought surge in Welikanda to see rank shift"
        >
          <Zap size={13} />
          Simulate Welikanda Surge
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Village Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            Select Sector to Adjust:
          </label>
          <select
            value={selectedVillage}
            onChange={e => handleVillageChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: '6px',
              background: '#0B1120',
              border: '1px solid #24355A',
              color: '#F8FAFC',
              fontSize: '0.82rem'
            }}
          >
            <option value="VIL-001">Siripura (Current Demo Focus: 91 pts)</option>
            <option value="VIL-002">Bakamuna (Current: 61 pts)</option>
            <option value="VIL-003">Welikanda (Current: 56 pts)</option>
            <option value="VIL-004">Medirigiriya (Current: 79 pts)</option>
            <option value="VIL-005">Dimbulagala (Current: 79 pts)</option>
          </select>
        </div>

        {/* Inputs Grid: Days without water, Affected, Tank %, Delivery */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
              Days Without Water: <strong>{daysWithoutWater}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="7"
              value={daysWithoutWater}
              onChange={e => setDaysWithoutWater(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38BDF8' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
              People Affected: <strong>{affectedPeople}</strong>
            </label>
            <input
              type="range"
              min="20"
              max="350"
              step="10"
              value={affectedPeople}
              onChange={e => setAffectedPeople(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38BDF8' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
              Nearby Tank Level: <strong>{tankLevel}%</strong>
            </label>
            <input
              type="range"
              min="5"
              max="95"
              step="1"
              value={tankLevel}
              onChange={e => setTankLevel(Number(e.target.value))}
              style={{ width: '100%', accentColor: tankLevel <= 20 ? '#EF4444' : '#38BDF8' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
              Days Since Delivery: <strong>{daysSinceDelivery}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="8"
              value={daysSinceDelivery}
              onChange={e => setDaysSinceDelivery(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#F59E0B' }}
            />
          </div>
        </div>

        {feedback && (
          <div style={{
            fontSize: '0.75rem',
            color: '#38BDF8',
            background: 'rgba(56, 189, 248, 0.1)',
            padding: '0.4rem 0.6rem',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            {feedback}
          </div>
        )}

        {/* Apply Button */}
        <button
          onClick={handleApplyUpdate}
          disabled={updating}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.65rem',
            borderRadius: '8px',
            background: '#1A294B',
            border: '1px solid #3B82F6',
            color: '#38BDF8',
            fontWeight: 700,
            fontSize: '0.82rem',
            marginTop: '0.3rem'
          }}
        >
          <RefreshCw size={14} className={updating ? 'critical-pulse' : ''} />
          {updating ? 'Updating Engine...' : 'Apply Live Shortage Change'}
        </button>
      </div>
    </div>
  );
}
