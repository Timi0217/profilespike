import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SimpleHome() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSignIn = () => {
    // For demo, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
    }}>
      {/* Premium Navigation */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1a1a1a',
                letterSpacing: '-0.8px'
              }}>
                ProfileSpike
              </div>
            </div>
            <button
              onClick={handleSignIn}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '80px 40px' }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '24px',
          letterSpacing: '-2px'
        }}>
          Your AI Career Coach
        </h1>
        <p style={{
          fontSize: '24px',
          color: '#6b7280',
          marginBottom: '48px',
          maxWidth: '600px',
          margin: '0 auto 48px auto',
          lineHeight: '1.4'
        }}>
          Transform your potential into your next breakthrough role with AI-powered insights
        </p>
        
        <button
          onClick={handleSignIn}
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '20px 40px',
            borderRadius: '16px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            boxShadow: '0 8px 25px rgba(102,126,234,0.4)',
            marginBottom: '80px'
          }}
        >
          🚀 Get Started Free
        </button>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 80px' }}>
        <h2 style={{
          fontSize: '48px',
          fontWeight: '700',
          color: '#1a1a1a',
          textAlign: 'center',
          marginBottom: '64px',
          letterSpacing: '-1px'
        }}>
          AI-Powered Career Tools
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          {[
            { icon: '📄', title: 'Resume Analyzer', description: 'AI-powered resume optimization with ATS scoring and real-time suggestions' },
            { icon: '🔗', title: 'LinkedIn Optimizer', description: 'Profile analysis and optimization for maximum recruiter visibility' },
            { icon: '💼', title: 'Career Mapping', description: 'Personalized career path planning with intelligent skill gap analysis' },
            { icon: '🎯', title: 'Interview Prep', description: 'Advanced practice scenarios with AI feedback and STAR method coaching' },
            { icon: '💰', title: 'Salary Analysis', description: 'Market compensation data with personalized negotiation strategies' },
            { icon: '🎨', title: 'Portfolio Review', description: 'Expert feedback on your professional portfolio and projects' }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>{feature.icon}</div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '16px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '1.6'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SimpleHome;