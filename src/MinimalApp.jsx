import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function MinimalHome() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>ProfileSpike</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>AI Career Coach Platform</p>
      <button 
        style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Demo Button Works!')}
      >
        Get Started
      </button>
    </div>
  );
}

function MinimalApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MinimalHome />} />
        <Route path="*" element={<MinimalHome />} />
      </Routes>
    </Router>
  );
}

export default MinimalApp;