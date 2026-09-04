import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DeliveriesDashboard from './pages/DeliveriesDashboard';
import BowsersManagement from './pages/BowsersManagement';
import ResidentQueueView from './pages/ResidentQueueView';
import ApiDocsPage from './pages/ApiDocsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<DeliveriesDashboard />} />
            <Route path="/deliveries" element={<DeliveriesDashboard />} />
            <Route path="/bowsers" element={<BowsersManagement />} />
            <Route path="/resident-preview" element={<ResidentQueueView />} />
            <Route path="/api-docs" element={<ApiDocsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
