import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CommandDashboard from './components/CommandDashboard';
import AlertsBanner from './components/AlertsBanner';
import TankCard from './components/TankCard';
import TankDetailModal from './components/TankDetailModal';
import LevelUpdateModal from './components/LevelUpdateModal';
import VillageImpactList from './components/VillageImpactList';
import DemoBar from './components/DemoBar';
import {
  fetchTanks,
  fetchTankAlerts,
  fetchDashboardSummary,
  updateTankLevel,
  seedDatabaseApi
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('tanks'); // 'command' | 'tanks' | 'impact'
  const [tanks, setTanks] = useState([]);
  const [alerts, setAlerts] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [selectedTank, setSelectedTank] = useState(null);
  const [updatingTank, setUpdatingTank] = useState(null);

  const loadData = async (showSyncIndicator = false) => {
    if (showSyncIndicator) setIsRefreshing(true);
    try {
      const [tanksRes, alertsRes, summaryRes] = await Promise.all([
        fetchTanks(),
        fetchTankAlerts(),
        fetchDashboardSummary()
      ]);

      setTanks(tanksRes);
      setAlerts(alertsRes);
      setSummary(summaryRes);

      // Keep selected or updating tank fresh if currently open
      if (selectedTank) {
        const refreshedSelected = tanksRes.find(t => t._id === selectedTank._id);
        if (refreshedSelected) setSelectedTank(refreshedSelected);
      }
      if (updatingTank) {
        const refreshedUpdating = tanksRes.find(t => t._id === updatingTank._id);
        if (refreshedUpdating) setUpdatingTank(refreshedUpdating);
      }
    } catch (err) {
      console.error('Error fetching WaterWatch data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(), 15000);
    return () => clearInterval(interval);
  }, []);

  // Demo Scenario Handlers
  const handleRunStep18 = async () => {
    const minneriya = tanks.find(t => t.name.toLowerCase().includes('minneriya'));
    if (minneriya) {
      await updateTankLevel(minneriya._id, { percentage: 18 });
      await loadData(true);
      setActiveTab('tanks');
    }
  };

  const handleRunStep25 = async () => {
    const minneriya = tanks.find(t => t.name.toLowerCase().includes('minneriya'));
    if (minneriya) {
      await updateTankLevel(minneriya._id, { percentage: 25 });
      await loadData(true);
      setActiveTab('tanks');
    }
  };

  const handleResetDemo = async () => {
    await seedDatabaseApi();
    await loadData(true);
  };

  const handleLevelSave = async (tankId, levelData) => {
    await updateTankLevel(tankId, levelData);
    await loadData(true);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 40px 20px' }}>
      <Navbar
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Demo Controller Bar */}
      <DemoBar
        onRunStep18={handleRunStep18}
        onRunStep25={handleRunStep25}
        onResetDemo={handleResetDemo}
      />

      {/* Critical Alert Banners (Always visible on top if alerts exist) */}
      <AlertsBanner alerts={alerts} onSelectTank={(tank) => setSelectedTank(tank)} />

      {/* View Tabs */}
      {loading ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          Initializing WaterWatch Tank Dashboard...
        </div>
      ) : activeTab === 'command' ? (
        <CommandDashboard
          summary={summary}
          tanks={tanks}
          onSelectTank={(tank) => setSelectedTank(tank)}
        />
      ) : activeTab === 'impact' ? (
        <VillageImpactList tanks={tanks} />
      ) : (
        /* Tanks Grid View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
              Major Reservoir Storage Status ({tanks.length} Monitored)
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              JSON API: <code>GET /api/tanks</code>
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '20px'
          }}>
            {tanks.map((tank) => (
              <TankCard
                key={tank._id}
                tank={tank}
                onOpenUpdateModal={(t) => setUpdatingTank(t)}
                onSelectTank={(t) => setSelectedTank(t)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedTank && (
        <TankDetailModal
          tank={selectedTank}
          onClose={() => setSelectedTank(null)}
          onOpenUpdateModal={(t) => setUpdatingTank(t)}
        />
      )}

      {updatingTank && (
        <LevelUpdateModal
          tank={updatingTank}
          onClose={() => setUpdatingTank(null)}
          onSave={handleLevelSave}
        />
      )}
    </div>
  );
}
