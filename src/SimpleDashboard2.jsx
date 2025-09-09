import React from 'react';
import { useNavigate } from 'react-router-dom';

function SimpleDashboard2() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif' 
    }}>
      {/* Dashboard Header */}
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.8)', 
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '24px 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#1a1a1a', 
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                Dashboard
              </h1>
              <p style={{ 
                fontSize: '16px', 
                color: '#6b7280', 
                margin: '4px 0 0 0',
                fontWeight: '400'
              }}>
                Welcome back, Demo User
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => navigate('/')}
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#374151'
                }}
              >
                🏠 Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 40px' }}>
        
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          marginBottom: '48px' 
        }}>
          {[
            { value: '3', label: 'Credits Remaining', color: '#667eea' },
            { value: '94', label: 'Average Score', color: '#10b981' },
            { value: '7', label: 'Analyses Done', color: '#f59e0b' },
            { value: '18', label: 'Days Active', color: '#8b5cf6' }
          ].map((stat, index) => (
            <div key={index} style={{ 
              background: 'rgba(255,255,255,0.7)', 
              backdropFilter: 'blur(20px) saturate(180%)',
              padding: '32px', 
              borderRadius: '20px', 
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: '700', 
                color: stat.color, 
                marginBottom: '8px',
                letterSpacing: '-1px'
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: '16px', 
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* AI Tools Grid */}
        <div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1a1a1a', 
            marginBottom: '32px',
            letterSpacing: '-0.5px'
          }}>
            🚀 AI Career Tools
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              { icon: '📄', title: 'Resume Analyzer', description: 'AI-powered resume optimization with ATS scoring', color: '#667eea', path: '/resume-analyzer' },
              { icon: '🔗', title: 'LinkedIn Optimizer', description: 'Profile analysis and optimization for recruiter visibility', color: '#0ea5e9', path: '/linkedin-optimizer' },
              { icon: '💼', title: 'Career Mapping', description: 'Personalized career path planning with skill gap analysis', color: '#8b5cf6', path: '/career-mapping' },
              { icon: '🎯', title: 'Interview Prep', description: 'Practice scenarios with AI feedback and coaching', color: '#10b981', path: '/interview-prep' },
              { icon: '💰', title: 'Salary Analysis', description: 'Market compensation data with negotiation strategies', color: '#f59e0b', path: '/compensation-analyzer' },
              { icon: '🎨', title: 'Portfolio Review', description: 'Expert feedback on your professional portfolio', color: '#ef4444', path: '/portfolio-review' },
              { icon: '🎖️', title: 'Veteran Skills Translation', description: 'Transform military experience into civilian career assets', color: '#6366f1', path: '/veteran-skills-translation' }
            ].map((tool, index) => (
              <div
                key={index}
                onClick={() => navigate(tool.path)}
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  padding: '28px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: `linear-gradient(135deg, ${tool.color}20, ${tool.color}40)`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    marginRight: '16px'
                  }}>
                    {tool.icon}
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: '600', 
                      color: '#1a1a1a', 
                      margin: 0
                    }}>
                      {tool.title}
                    </h3>
                  </div>
                </div>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#6b7280', 
                  margin: 0, 
                  lineHeight: '1.5'
                }}>
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleDashboard2;