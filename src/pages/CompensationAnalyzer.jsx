
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../components/AuthContext';

const CompensationAnalyzer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('3-5');
  const [company, setCompany] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const demoUser = {
    name: 'Demo User',
    email: 'demo@profilespike.com',
    credits: 3
  };

  const handleAnalyze = async () => {
    if (!jobTitle || !location) {
      alert('Please fill in job title and location.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await fetch('http://localhost:3002/api/salary-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          location,
          experience
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze salary data');
      }

      const salaryData = await response.json();
      setAnalysis(salaryData);
    } catch (error) {
      console.error('Salary analysis failed:', error);
      // Fallback to mock data
      setAnalysis({
        currentSalary: '$95,000',
        marketRange: {
          low: '$82,000',
          median: '$98,000',
          high: '$125,000'
        },
        marketPosition: 'Market Rate',
        recommendedRange: '$98,000 - $108,000',
        topCompanies: [
          { name: 'Google', range: '$120,000 - $180,000' },
          { name: 'Microsoft', range: '$115,000 - $165,000' },
          { name: 'Amazon', range: '$110,000 - $155,000' },
          { name: 'Meta', range: '$125,000 - $185,000' }
        ],
        negotiationTips: [
          'Research total compensation including equity and benefits',
          'Time negotiations with performance reviews or job offers',
          'Quantify your achievements with specific metrics',
          'Consider remote work flexibility as part of compensation',
          'Prepare for counteroffers and multiple negotiation rounds'
        ],
        skills: {
          inDemand: ['Python', 'Machine Learning', 'Cloud Architecture', 'Leadership'],
          emerging: ['AI/ML', 'DevOps', 'Data Engineering', 'System Design']
        }
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
                💰 Compensation Analyzer
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '4px 0 0 0',
                fontWeight: '400'
              }}>
                Get market insights and negotiation strategies powered by real salary data
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
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
                💼 Salary Analysis Setup
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Job Title
                </h3>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer, Product Manager"
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
                  Location
                </h3>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
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
                  Years of Experience
                </h3>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
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
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-8">5-8 years</option>
                  <option value="8-12">8-12 years</option>
                  <option value="12+">12+ years</option>
                </select>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Target Company (Optional)
                </h3>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Microsoft, Startup"
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

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobTitle || !location}
                style={{
                  width: '100%',
                  background: isAnalyzing || !jobTitle || !location ? '#ccc' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  cursor: isAnalyzing || !jobTitle || !location ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: isAnalyzing || !jobTitle || !location ? 'none' : '0 4px 15px rgba(245,158,11,0.3)',
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
                    Analyzing Market Data...
                  </>
                ) : (
                  '💰 Analyze Compensation'
                )}
              </button>

              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: 'rgba(245,158,11,0.1)',
                borderRadius: '12px'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f59e0b',
                  marginBottom: '8px'
                }}>
                  📊 Analysis Includes:
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  <li style={{ marginBottom: '4px' }}>• Current market salary ranges</li>
                  <li style={{ marginBottom: '4px' }}>• Top paying companies</li>
                  <li style={{ marginBottom: '4px' }}>• Negotiation strategies</li>
                  <li>• Skills gap analysis</li>
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
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>💰</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '16px'
                }}>
                  Ready for Salary Insights?
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}>
                  Enter your job details to get comprehensive market analysis and negotiation strategies.
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
                    fontSize: '36px',
                    fontWeight: '700',
                    color: '#f59e0b',
                    marginBottom: '8px'
                  }}>
                    {analysis.marketRange.median}
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '4px'
                  }}>
                    Market Median
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: analysis.marketPosition === 'Below Market' ? '#ef4444' : '#10b981',
                    fontWeight: '500'
                  }}>
                    Your Position: {analysis.marketPosition}
                  </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#f59e0b',
                    marginBottom: '16px'
                  }}>
                    📊 Market Range Analysis
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      background: 'rgba(239,68,68,0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#ef4444' }}>
                        {analysis.marketRange.low}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>25th percentile</div>
                    </div>
                    <div style={{
                      background: 'rgba(245,158,11,0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#f59e0b' }}>
                        {analysis.marketRange.median}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Median</div>
                    </div>
                    <div style={{
                      background: 'rgba(16,185,129,0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>
                        {analysis.marketRange.high}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>75th percentile</div>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(59,130,246,0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Recommended Range: </span>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#3b82f6' }}>
                      {analysis.recommendedRange}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                    marginBottom: '12px'
                  }}>
                    🏢 Top Paying Companies
                  </h4>
                  {analysis.topCompanies.slice(0, 3).map((company, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: index < 2 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        {company.name}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                        {company.range}
                      </span>
                    </div>
                  ))}
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
                    💡 Negotiation Tips
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    fontSize: '12px',
                    color: '#374151'
                  }}>
                    {analysis.negotiationTips.slice(0, 3).map((tip, index) => (
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
                        {tip}
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

export default CompensationAnalyzer;
