
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../components/AuthContext';

const CareerMapping = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experience, setExperience] = useState('5-10');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [careerPath, setCareerPath] = useState(null);

  const demoUser = {
    name: 'Demo User',
    email: 'demo@profilespike.com',
    credits: 3
  };

  const handleAnalyze = async () => {
    if (!currentRole || !targetRole) {
      alert('Please fill in both current and target roles.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await fetch('http://localhost:3002/api/career-mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentRole,
          targetRole,
          experience
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate career path');
      }

      const careerData = await response.json();
      setCareerPath(careerData);
    } catch (error) {
      console.error('Career mapping failed:', error);
      // Fallback to mock data
      setCareerPath({
        timeline: '18-24 months',
        steps: [
          {
            phase: 'Foundation (Months 1-6)',
            title: 'Build Core Skills',
            tasks: [
              'Complete relevant certifications in target domain',
              'Build portfolio projects showcasing new skills',
              'Start networking in target industry/role'
            ]
          },
          {
            phase: 'Development (Months 7-12)', 
            title: 'Gain Experience',
            tasks: [
              'Take on cross-functional projects in current role',
              'Seek mentorship from professionals in target role',
              'Attend industry conferences and workshops'
            ]
          },
          {
            phase: 'Transition (Months 13-18)',
            title: 'Make the Move',
            tasks: [
              'Apply for target roles or internal transfers',
              'Leverage network for referrals and opportunities',
              'Prepare for role-specific interviews'
            ]
          },
          {
            phase: 'Growth (Months 19-24)',
            title: 'Excel & Advance',
            tasks: [
              'Establish yourself in the new role',
              'Set goals for next career milestone',
              'Become a mentor to others making similar transitions'
            ]
          }
        ],
        skills: {
          current: ['Project Management', 'Team Leadership', 'Communication', 'Problem Solving'],
          needed: ['Data Analysis', 'Strategic Planning', 'Market Research', 'Stakeholder Management'],
          recommended: ['SQL', 'Python', 'Tableau', 'Agile Methodologies']
        },
        resources: [
          'Coursera Data Science Specialization',
          'LinkedIn Learning Business Analysis',
          'Industry networking groups',
          'Professional certification programs'
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
                🗺️ Career Path Mapping
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '4px 0 0 0',
                fontWeight: '400'
              }}>
                Get a personalized roadmap to your dream role with AI-powered guidance
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
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
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
                🚀 Career Transition Planner
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Current Role
                </h3>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Software Engineer, Marketing Manager"
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
                  Target Role
                </h3>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Product Manager, Data Scientist"
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
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !currentRole || !targetRole}
                style={{
                  width: '100%',
                  background: isAnalyzing || !currentRole || !targetRole ? '#ccc' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  cursor: isAnalyzing || !currentRole || !targetRole ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: isAnalyzing || !currentRole || !targetRole ? 'none' : '0 4px 15px rgba(139,92,246,0.3)',
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
                    Creating Career Path...
                  </>
                ) : (
                  '🎯 Generate Career Roadmap'
                )}
              </button>

              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: 'rgba(139,92,246,0.1)',
                borderRadius: '12px'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#8b5cf6',
                  marginBottom: '8px'
                }}>
                  🗺️ Your Roadmap Will Include:
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  <li style={{ marginBottom: '4px' }}>• Step-by-step transition plan</li>
                  <li style={{ marginBottom: '4px' }}>• Skill gap analysis</li>
                  <li style={{ marginBottom: '4px' }}>• Timeline recommendations</li>
                  <li>• Learning resources</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {!careerPath ? (
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
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🗺️</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '16px'
                }}>
                  Ready to Map Your Career?
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}>
                  Enter your current and target roles to get a personalized career transition roadmap.
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
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    Your Career Roadmap
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#8b5cf6',
                    fontWeight: '500'
                  }}>
                    Estimated Timeline: {careerPath.timeline}
                  </p>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#8b5cf6',
                    marginBottom: '16px'
                  }}>
                    📍 Transition Steps
                  </h4>
                  {careerPath.steps.map((step, index) => (
                    <div key={index} style={{
                      background: 'rgba(139,92,246,0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '12px',
                      borderLeft: '4px solid #8b5cf6'
                    }}>
                      <h5 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#8b5cf6',
                        marginBottom: '4px'
                      }}>
                        {step.phase}
                      </h5>
                      <h6 style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        marginBottom: '8px'
                      }}>
                        {step.title}
                      </h6>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        fontSize: '12px',
                        color: '#374151'
                      }}>
                        {step.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} style={{
                            marginBottom: '4px',
                            paddingLeft: '12px',
                            position: 'relative'
                          }}>
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              color: '#8b5cf6'
                            }}>•</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: 'rgba(16,185,129,0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#10b981',
                    marginBottom: '8px'
                  }}>
                    🎯 Skills Analysis
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: '#6b7280' }}>Current:</span>
                      <div style={{ marginTop: '4px' }}>
                        {careerPath.skills.current.slice(0, 2).map((skill, i) => (
                          <span key={i} style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            marginRight: '4px',
                            marginBottom: '2px',
                            display: 'inline-block'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Needed:</span>
                      <div style={{ marginTop: '4px' }}>
                        {careerPath.skills.needed.slice(0, 2).map((skill, i) => (
                          <span key={i} style={{
                            background: '#f59e0b',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            marginRight: '4px',
                            marginBottom: '2px',
                            display: 'inline-block'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
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

export default CareerMapping;
