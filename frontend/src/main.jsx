import React, { Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("WaterWatch Runtime Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '3rem',
          background: '#0f172a',
          color: '#f8fafc',
          minHeight: '100vh',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ color: '#fb7185', fontSize: '1.8rem', marginBottom: '1rem' }}>
            ⚠️ WaterWatch Render Warning
          </h1>
          <p style={{ marginBottom: '1rem', color: '#94a3b8' }}>
            An unexpected error occurred during page rendering:
          </p>
          <pre style={{
            background: '#1e293b',
            border: '1px solid #334155',
            padding: '1rem',
            borderRadius: '8px',
            color: '#38bdf8',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            style={{
              marginTop: '1.5rem',
              padding: '0.7rem 1.2rem',
              background: '#06b6d4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Reset Session & Login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
