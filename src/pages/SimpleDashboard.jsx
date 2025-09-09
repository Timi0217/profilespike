import React from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

function SimpleDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif' 
    }}>
      {/* Refined Dashboard Header */}
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
                Welcome back, {user.email.split('@')[0]}
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
                  color: '#374151',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.08)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.04)'}
              >
                🏠 Home
              </button>
              <button 
                onClick={handleSignOut}
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '500',
                  boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 40px' }}>
        
        {/* Elegant Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          marginBottom: '48px' 
        }}>
          {[
            { value: '3', label: 'Credits Remaining', color: '#667eea', bg: 'linear-gradient(135deg, #667eea20, #764ba220)' },
            { value: '94', label: 'Average Score', color: '#10b981', bg: 'linear-gradient(135deg, #10b98120, #059f4620)' },
            { value: '7', label: 'Analyses Done', color: '#f59e0b', bg: 'linear-gradient(135deg, #f59e0b20, #d9770920)' },
            { value: '18', label: 'Days Active', color: '#8b5cf6', bg: 'linear-gradient(135deg, #8b5cf620, #7c3aed20)' }
          ].map((stat, index) => (
            <div key={index} style={{ 
              background: 'rgba(255,255,255,0.7)', 
              backdropFilter: 'blur(20px) saturate(180%)',
              padding: '32px', 
              borderRadius: '20px', 
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: stat.bg,
                opacity: 0.6
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
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
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
          
          {/* Beautiful AI Tools Grid */}
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
                { icon: '📄', title: 'Resume Analyzer', description: 'AI-powered resume optimization with ATS scoring and real-time suggestions', color: '#667eea', path: '/resume-analyzer' },
                { icon: '🔗', title: 'LinkedIn Optimizer', description: 'Profile analysis and optimization for maximum recruiter visibility', color: '#0ea5e9', path: '/linkedin-optimizer' },
                { icon: '💼', title: 'Career Mapping', description: 'Personalized career path planning with intelligent skill gap analysis', color: '#8b5cf6', path: '/career-mapping' },
                { icon: '🎯', title: 'Interview Prep', description: 'Advanced practice scenarios with AI feedback and STAR method coaching', color: '#10b981', path: '/interview-prep' },
                { icon: '💰', title: 'Salary Analysis', description: 'Market compensation data with personalized negotiation strategies', color: '#f59e0b', path: '/compensation-analyzer' },
                { icon: '🎨', title: 'Portfolio Review', description: 'Expert feedback on your professional portfolio and projects', color: '#ef4444', path: '/portfolio-review' },
                { icon: '🎖️', title: 'Veteran Skills', description: 'Transform military experience into powerful civilian career assets', color: '#6366f1', path: '/veteran-skills-translation' }
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
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
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
                      marginRight: '16px',
                      border: `2px solid ${tool.color}30`
                    }}>
                      {tool.icon}
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '20px', 
                        fontWeight: '600', 
                        color: '#1a1a1a', 
                        margin: 0,
                        letterSpacing: '-0.3px'
                      }}>
                        {tool.title}
                      </h3>
                    </div>
                  </div>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#6b7280', 
                    margin: 0, 
                    lineHeight: '1.5',
                    fontWeight: '400'
                  }}>
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Refined Activity Panel */}
          <div>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#1a1a1a', 
              marginBottom: '32px',
              letterSpacing: '-0.5px'
            }}>
              📊 Recent Activity
            </h2>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.8)', 
              backdropFilter: 'blur(20px) saturate(180%)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              overflow: 'hidden'
            }}>
              {[
                { action: 'Resume analyzed', time: '2 hours ago', score: 94, trend: '+7' },
                { action: 'LinkedIn profile optimized', time: '1 day ago', score: 88, trend: '+12' },
                { action: 'Interview prep completed', time: '3 days ago', score: 92, trend: '+5' }
              ].map((activity, index) => (
                <div
                  key={index}
                  style={{
                    padding: '24px',
                    borderBottom: index < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#1a1a1a', 
                      margin: 0,
                      letterSpacing: '-0.2px'
                    }}>
                      {activity.action}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '12px',
                        color: '#10b981',
                        fontWeight: '600'
                      }}>
                        {activity.trend}
                      </span>
                      <span style={{
                        background: activity.score >= 90 ? 'linear-gradient(135deg, #10b981, #059669)' : 
                                   activity.score >= 80 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 
                                   'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600',
                        letterSpacing: '0.3px'
                      }}>
                        {activity.score}
                      </span>
                    </div>
                  </div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#9ca3af', 
                    margin: 0,
                    fontWeight: '400'
                  }}>
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>

            {/* Refined Quick Actions */}
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#1a1a1a', 
                marginBottom: '20px',
                letterSpacing: '-0.3px'
              }}>
                ⚡ Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: '📄', label: 'Analyze Resume', color: '#667eea', path: '/resume-analyzer' },
                  { icon: '🔗', label: 'Optimize LinkedIn', color: '#0ea5e9', path: '/linkedin-optimizer' },
                  { icon: '⚙️', label: 'Profile Settings', color: '#6b7280', path: '/profile' }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    style={{
                      background: 'rgba(255,255,255,0.6)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${action.color}20`,
                      padding: '16px 20px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '15px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#374151',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = `${action.color}10`;
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.6)';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleDashboard;