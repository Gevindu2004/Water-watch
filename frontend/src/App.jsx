import React, { useState, useEffect } from 'react';
import {
  getPriorities,
  getRecommendation,
  getAiHealth,
  getBowsers,
  getResidentFeed,
  resetDemoScenario,
  dispatchBowser,
  getPriorityByVillage
} from './services/api';

import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import NextRecommendationCard from './components/NextRecommendationCard';
import PriorityRankingTable from './components/PriorityRankingTable';
import AiReasonModal from './components/AiReasonModal';
import DispatchApprovalModal from './components/DispatchApprovalModal';
import VillageDetailModal from './components/VillageDetailModal';
import ResidentNotificationFeed from './components/ResidentNotificationFeed';
import SimulationScenarioControls from './components/SimulationScenarioControls';
import IntegrationDocView from './components/IntegrationDocView';

export default function App() {
  const [prioritiesData, setPrioritiesData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [aiHealth, setAiHealth] = useState(null);
  const [bowsers, setBowsers] = useState([]);
  const [residentNotifications, setResidentNotifications] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedVillageDetail, setSelectedVillageDetail] = useState(null);
  const [isVillageModalOpen, setIsVillageModalOpen] = useState(false);

  // Central data loader
  const loadDashboardData = async () => {
    try {
      const [pRes, rRes, hRes, bRes, nRes] = await Promise.all([
        getPriorities().catch(err => ({ priorities: [], summary: {} })),
        getRecommendation().catch(err => null),
        getAiHealth().catch(err => ({ status: 'healthy', aiService: 'fallback_mode' })),
        getBowsers().catch(err => ({ bowsers: [] })),
        getResidentFeed().catch(err => ({ notifications: [] }))
      ]);

      setPrioritiesData(pRes);
      setRecommendation(rRes);
      setAiHealth(hRes);
      setBowsers(bRes.bowsers || []);
      setResidentNotifications(nRes.notifications || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle Demo Reset
  const handleResetDemo = async () => {
    setRefreshing(true);
    try {
      await resetDemoScenario();
      await loadDashboardData();
    } catch (err) {
      console.error('Error resetting demo scenario:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle Village Inspection
  const handleSelectVillage = async (villageId) => {
    try {
      const res = await getPriorityByVillage(villageId);
      if (res?.data) {
        setSelectedVillageDetail(res.data);
        setIsVillageModalOpen(true);
      }
    } catch (err) {
      console.error('Error loading village details:', err);
    }
  };

  // Handle Dispatch Execution from Modal
  const handleConfirmDispatch = async (payload) => {
    try {
      await dispatchBowser(payload);
      // Reload dashboard state immediately
      await loadDashboardData();
    } catch (err) {
      console.error('Dispatch execution error:', err);
      throw err;
    }
  };

  const availableBowsers = bowsers.filter(b => b.status === 'available');

  return (
    <div className="app-container">
      {/* 1. Header with branding & health indicator */}
      <Header
        aiHealth={aiHealth}
        onResetDemo={handleResetDemo}
        refreshing={refreshing}
      />

      {/* 2. Operations Overview Summary Cards */}
      <SummaryCards
        summary={prioritiesData?.summary}
        bowsersCount={bowsers.length}
        availableBowsersCount={availableBowsers.length}
      />

      {/* 3. Hero Recommendation Card */}
      <NextRecommendationCard
        recommendation={recommendation}
        onOpenReason={() => setIsReasonModalOpen(true)}
        onOpenDispatch={() => setIsDispatchModalOpen(true)}
        loading={loading}
      />

      {/* 4. Priority Areas Ranking List */}
      <PriorityRankingTable
        priorities={prioritiesData?.priorities || []}
        onSelectVillage={handleSelectVillage}
        selectedVillageId={recommendation?.villageId}
      />

      {/* 5. Split Section: Interactive Simulator & Resident Broadcast Feed */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Interactive Emergency Parameter Tuner */}
        <SimulationScenarioControls onRefreshData={loadDashboardData} />

        {/* Real-time Resident Alert Broadcast Feed */}
        <ResidentNotificationFeed
          notifications={residentNotifications}
          onRefresh={loadDashboardData}
        />
      </div>

      {/* 6. MERN Stack Cross-Member Integration Docs */}
      <IntegrationDocView />

      {/* --- MODALS --- */}

      {/* AI Reason & Explainability Modal */}
      <AiReasonModal
        isOpen={isReasonModalOpen}
        onClose={() => setIsReasonModalOpen(false)}
        recommendation={recommendation}
      />

      {/* Dispatch Approval Modal */}
      <DispatchApprovalModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        recommendation={recommendation}
        availableBowsers={availableBowsers}
        onConfirmDispatch={handleConfirmDispatch}
      />

      {/* Village Deep Breakdown Inspector Modal */}
      <VillageDetailModal
        village={selectedVillageDetail}
        isOpen={isVillageModalOpen}
        onClose={() => setIsVillageModalOpen(false)}
      />
    </div>
  );
}
