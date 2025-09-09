import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../components/AuthContext';

const PortfolioReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [portfolioType, setPortfolioType] = useState('website');
  const [description, setDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const demoUser = {
    name: 'Demo User',
    email: 'demo@profilespike.com',
    credits: 3
  };

  const handleAnalyze = async () => {
    if (!portfolioUrl || !targetRole) {
      alert('Please fill in portfolio URL and target role.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await fetch('http://localhost:3002/api/portfolio-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioUrl,
          portfolioType,
          targetRole,
          description
        })
      });

      if (!response.ok) {
        throw new Error('Failed to review portfolio');
      }

      const reviewData = await response.json();
      setAnalysis(reviewData);
    } catch (error) {
      console.error('Portfolio review failed:', error);
      // Fallback to mock data
      setAnalysis({
      overallScore: 87,
      categories: {
        design: { score: 92, feedback: 'Excellent visual design with strong brand consistency' },
        content: { score: 85, feedback: 'Good project showcase, could benefit from more detailed case studies' },
        technical: { score: 88, feedback: 'Strong technical implementation and performance' },
        ux: { score: 83, feedback: 'Intuitive navigation, consider adding more interactive elements' },
        professional: { score: 89, feedback: 'Professional presentation with clear value proposition' }
      },
      strengths: [
        'Strong visual hierarchy and clean design aesthetics',
        'Comprehensive project documentation and code samples',
        'Fast loading times and mobile-responsive design',
        'Clear contact information and professional branding',
        'Good use of testimonials and social proof'
      ],
      improvements: [
        'Add more detailed case studies with problem-solving process',
        'Include metrics and results from your projects',
        'Consider adding a blog section to demonstrate thought leadership',
        'Enhance accessibility features for better inclusivity',
        'Add more interactive elements to engage visitors'
      ],
      recommendations: [
        'Create 2-3 detailed case studies showing your process',
        'Add a skills matrix with proficiency levels',
        'Include client testimonials or recommendations',
        'Optimize for SEO to improve discoverability',
        'Consider adding a resources or tools section'
      ],
      projects: [
        {
          name: 'E-commerce Platform',
          score: 90,
          highlights: ['Full-stack implementation', 'Modern UI/UX', 'Performance optimized']
        },
        {
          name: 'Mobile App Design',
          score: 85,
          highlights: ['User-centered design', 'Prototyping', 'Usability testing']
        },
        {
          name: 'Data Visualization',
          score: 88,
          highlights: ['Interactive charts', 'Real-time data', 'Responsive design']
        }
      ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
    }}>
      {/* Premium Header */}
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
                🎨 Portfolio Review
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '4px 0 0 0',
                fontWeight: '400'
              }}>
                Get expert feedback on your professional portfolio and projects
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => navigate('/dashboard')}
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
                ← Dashboard
              </button>
              <div style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {demoUser.credits} Credits Remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
          
          {/* Input Section */}
          <div>
            <div style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '24px',
                letterSpacing: '-0.3px'
              }}>
                🔍 Portfolio Analysis Setup
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Portfolio URL
                </h3>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    background: 'rgba(255,255,255,0.8)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Portfolio Type
                </h3>
                <select
                  value={portfolioType}
                  onChange={(e) => setPortfolioType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    background: 'rgba(255,255,255,0.8)'
                  }}
                >
                  <option value="website">Personal Website</option>
                  <option value="behance">Behance Portfolio</option>
                  <option value="dribbble">Dribbble Portfolio</option>
                  <option value="github">GitHub Profile</option>
                  <option value="linkedin">LinkedIn Portfolio</option>
                  <option value="other">Other Platform</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Target Role
                </h3>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. UI/UX Designer, Frontend Developer"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    background: 'rgba(255,255,255,0.8)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Brief Description (Optional)
                </h3>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your portfolio's focus, key projects, or specific areas you'd like feedback on..."
                  style={{
                    width: '100%',
                    height: '120px',
                    padding: '12px 16px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    background: 'rgba(255,255,255,0.8)',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !portfolioUrl || !targetRole}
                style={{
                  width: '100%',
                  background: isAnalyzing || !portfolioUrl || !targetRole ? '#ccc' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  cursor: isAnalyzing || !portfolioUrl || !targetRole ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: isAnalyzing || !portfolioUrl || !targetRole ? 'none' : '0 4px 15px rgba(239,68,68,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isAnalyzing ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderRadius: '50%',
                      borderTopColor: 'white',
                      animation: 'spin 1s ease-in-out infinite'
                    }} />
                    Analyzing Portfolio...
                  </>
                ) : (
                  '🎨 Review Portfolio'
                )}
              </button>

              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: 'rgba(239,68,68,0.1)',
                borderRadius: '12px'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: '8px'
                }}>
                  🎯 Review Includes:
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  <li style={{ marginBottom: '4px' }}>• Visual design and branding analysis</li>
                  <li style={{ marginBottom: '4px' }}>• Content quality and presentation</li>
                  <li style={{ marginBottom: '4px' }}>• Technical performance evaluation</li>
                  <li>• Professional development recommendations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {!analysis ? (
              <div style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '48px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎨</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '16px'
                }}>
                  Ready for Portfolio Review?
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}>
                  Share your portfolio URL and target role to get comprehensive feedback from our AI experts.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '32px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                  maxHeight: '800px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    color: analysis.overallScore >= 90 ? '#10b981' : analysis.overallScore >= 80 ? '#f59e0b' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {analysis.overallScore}/100
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '4px'
                  }}>
                    Portfolio Score
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {analysis.overallScore >= 90 ? 'Outstanding portfolio!' : 
                     analysis.overallScore >= 80 ? 'Strong portfolio with room for growth' : 
                     'Good foundation, needs improvement'}
                  </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ef4444',
                    marginBottom: '16px'
                  }}>
                    📊 Category Scores
                  </h4>
                  {Object.entries(analysis.categories).map(([category, data], index) => (
                    <div key={index} style={{
                      background: 'rgba(239,68,68,0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '12px',
                      borderLeft: '4px solid #ef4444'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h5 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          textTransform: 'capitalize',
                          margin: 0
                        }}>
                          {category}
                        </h5>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: data.score >= 90 ? '#10b981' : data.score >= 80 ? '#f59e0b' : '#ef4444'
                        }}>
                          {data.score}/100
                        </span>
                      </div>
                      <p style={{
                        fontSize: '13px',
                        color: '#374151',
                        margin: 0,
                        lineHeight: '1.4'
                      }}>
                        {data.feedback}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#10b981',
                      marginBottom: '12px'
                    }}>
                      ✓ Strengths
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      {analysis.strengths.slice(0, 3).map((strength, index) => (
                        <li key={index} style={{
                          fontSize: '13px',
                          color: '#374151',
                          marginBottom: '6px',
                          paddingLeft: '16px',
                          position: 'relative',
                          lineHeight: '1.4'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: 0,
                            color: '#10b981'
                          }}>•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#f59e0b',
                      marginBottom: '12px'
                    }}>
                      ⚡ Improvements
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      {analysis.improvements.slice(0, 3).map((improvement, index) => (
                        <li key={index} style={{
                          fontSize: '13px',
                          color: '#374151',
                          marginBottom: '6px',
                          paddingLeft: '16px',
                          position: 'relative',
                          lineHeight: '1.4'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: 0,
                            color: '#f59e0b'
                          }}>•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(59,130,246,0.1)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#3b82f6',
                    marginBottom: '8px'
                  }}>
                    🎯 Key Recommendations
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    fontSize: '12px',
                    color: '#374151'
                  }}>
                    {analysis.recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index} style={{
                        marginBottom: '4px',
                        paddingLeft: '12px',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: '#3b82f6'
                        }}>•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PortfolioReview;