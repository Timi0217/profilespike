import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { SimpleLoginModal } from '../components/SimpleLoginModal';

function Home() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  // Rotating hero messages for premium feel
  const rotatingMessages = [
    {
      persona: "Recent Graduate",
      message: "Transform your potential into your first breakthrough role",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      persona: "Career Veteran", 
      message: "Translate your experience into your next chapter",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      persona: "Career Changer",
      message: "Navigate your pivot to a new field with confidence",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      persona: "Executive",
      message: "Elevate your leadership presence to new heights",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    }
  ];

  // Rotate messages every 4 seconds for dynamic experience
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  const currentMessage = rotatingMessages[currentMessageIndex];
  
  const isAuthenticated = !!user;
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (userProfile && userProfile.onboarded) {
        navigate('/dashboard');
      } else {
        navigate('/dashboard'); // For now, go to dashboard
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const handleTryAnalyzer = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      setShowLoginModal(true);
    }
  };
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif' 
    }}>
      
      {/* Premium Navigation */}
      <nav style={{ 
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000, 
        backgroundColor: 'rgba(255,255,255,0.8)', 
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '16px 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '20px',
                boxShadow: '0 8px 25px rgba(102,126,234,0.3)'
              }}>
                PS
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#1a1a1a', 
                  margin: 0,
                  letterSpacing: '-0.5px'
                }}>
                  ProfileSpike
                </h1>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#6b7280', 
                  margin: 0,
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}>
                  AI + Human Career Coach
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#374151'
                    }}
                  >
                    Dashboard
                  </button>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#667eea',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/profile')}
                  >
                    {user?.email?.[0].toUpperCase() || 'U'}
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#374151'
                    }}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleGetStarted}
                    style={{
                      background: 'black',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Breathtaking Hero Section */}
      <section style={{ 
        background: currentMessage.gradient,
        color: 'white',
        padding: '160px 40px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite reverse'
        }}></div>
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: 'clamp(48px, 6vw, 80px)', 
            fontWeight: '800', 
            marginBottom: '32px',
            lineHeight: '1.1',
            letterSpacing: '-2px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Your AI + Human<br />
            <span style={{ 
              background: 'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Career Coach
            </span>
          </h1>
          {/* Animated message transition */}
          <div style={{ 
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '48px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '500',
              opacity: 0.95,
              lineHeight: '1.4',
              maxWidth: '800px',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              <span style={{ 
                fontWeight: '700',
                fontSize: '16px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                opacity: 0.8
              }}>
                {currentMessage.persona}
              </span>
              <br />
              {currentMessage.message}
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: '64px'
          }}>
            <button 
              onClick={() => handleTryAnalyzer('/resume-analyzer')}
              style={{
                background: 'rgba(255,255,255,0.95)',
                color: '#1a1a1a',
                border: 'none',
                padding: '20px 36px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '18px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
            >
              📄 Try Free Resume Review
            </button>
            <button 
              onClick={() => handleTryAnalyzer('/linkedin-optimizer')}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '18px 34px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '18px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.25)';
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              🔗 Get LinkedIn Analysis
            </button>
          </div>
          
          {/* Trust indicators with animation */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '40px', 
            fontSize: '16px',
            opacity: 0.9,
            flexWrap: 'wrap'
          }}>
            {[
              { icon: '✓', text: '3 Free AI Analyses' },
              { icon: '🛡️', text: 'Enterprise Security' },
              { icon: '⚡', text: 'Instant Results' },
              { icon: '🌟', text: '10,000+ Users' }
            ].map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontWeight: '500'
              }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span> 
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sophisticated Features Section */}
      <section style={{ padding: '120px 40px', backgroundColor: '#fafbfc' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ 
              fontSize: 'clamp(36px, 5vw, 56px)', 
              fontWeight: '700', 
              color: '#1a1a1a',
              marginBottom: '24px',
              letterSpacing: '-1px'
            }}>
              Everything You Need to Succeed
            </h2>
            <p style={{ 
              fontSize: '22px', 
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.5',
              fontWeight: '400'
            }}>
              Comprehensive AI-powered tools designed for the modern professional
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '32px' 
          }}>
            {[
              {
                icon: '📄',
                title: 'AI Resume & LinkedIn Analyzer',
                description: 'Advanced ATS optimization with real-time suggestions and professional formatting guidance.',
                gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
                onClick: () => handleTryAnalyzer('/resume-analyzer')
              },
              {
                icon: '🔗',
                title: 'LinkedIn Profile Optimizer',
                description: 'Intelligent profile analysis with recruiter-focused optimization and visibility enhancement.',
                gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                onClick: () => handleTryAnalyzer('/linkedin-optimizer')
              },
              {
                icon: '💼',
                title: 'Portfolio Review Engine',
                description: 'Comprehensive analysis of GitHub, Behance, or personal portfolios for maximum impact.',
                gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
                onClick: () => handleTryAnalyzer('/dashboard')
              },
              {
                icon: '🎯',
                title: 'Interview Prep Simulator',
                description: 'Advanced practice scenarios with AI coaching and personalized feedback systems.',
                gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
                onClick: () => handleTryAnalyzer('/dashboard')
              },
              {
                icon: '💰',
                title: 'Compensation Analyzer',
                description: 'Market-leading salary intelligence with strategic negotiation guidance.',
                gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
                onClick: () => handleTryAnalyzer('/dashboard')
              },
              {
                icon: '🧠',
                title: 'Reskilling Radar',
                description: 'AI-powered skill gap analysis with curated learning path recommendations.',
                gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
                onClick: () => handleTryAnalyzer('/dashboard')
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                onClick={feature.onClick}
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  padding: '40px',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                  textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: feature.gradient
                }}></div>
                
                <div style={{ 
                  fontSize: '56px', 
                  marginBottom: '24px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#1a1a1a',
                  marginBottom: '16px',
                  letterSpacing: '-0.5px'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  lineHeight: '1.6',
                  fontSize: '16px',
                  fontWeight: '400'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Elegant CTA Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        padding: '120px 40px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            fontSize: 'clamp(36px, 5vw, 56px)', 
            fontWeight: '700', 
            marginBottom: '32px',
            letterSpacing: '-1px'
          }}>
            Ready to Transform Your Career?
          </h2>
          <p style={{ 
            fontSize: '22px', 
            marginBottom: '48px',
            opacity: 0.8,
            lineHeight: '1.5',
            fontWeight: '400'
          }}>
            Join thousands of professionals who've elevated their careers with ProfileSpike.
          </p>
          <button 
            onClick={handleGetStarted}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '20px',
              boxShadow: '0 8px 25px rgba(102,126,234,0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '-0.3px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 40px rgba(102,126,234,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(102,126,234,0.3)';
            }}
          >
            ✨ Start Your Journey Today
          </button>
          <p style={{ 
            fontSize: '16px', 
            opacity: 0.6,
            marginTop: '32px',
            fontWeight: '400'
          }}>
            3 free AI analyses included • No credit card required • Start in 30 seconds
          </p>
        </div>
      </section>

      {/* Login Modal */}
      <SimpleLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

    </div>
  );
}

export default Home;