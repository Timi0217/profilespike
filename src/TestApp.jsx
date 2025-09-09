import React from 'react';

function TestApp() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>ProfileSpike Test</h1>
      <p>If you can see this, React is working!</p>
      <button 
        style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button works!')}
      >
        Test Button
      </button>
    </div>
  );
}

export default TestApp;