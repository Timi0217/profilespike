
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../components/AuthContext';

const InterviewPrep = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('software-engineer');
  const [difficulty, setDifficulty] = useState('medium');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState(null);

  const demoUser = {
    name: 'Demo User',
    email: 'demo@profilespike.com',
    credits: 3
  };

  const roleQuestions = {
    'software-engineer': [
      'Tell me about a challenging technical problem you solved.',
      'How do you approach debugging a complex issue?',
      'Describe your experience with agile development.',
      'How do you stay updated with new technologies?',
      'Walk me through your system design approach.'
    ],
    'product-manager': [
      'How do you prioritize features in a product roadmap?',
      'Describe a time when you had to make a difficult product decision.',
      'How do you gather and analyze customer feedback?',
      'Tell me about a product launch you managed.',
      'How do you work with engineering and design teams?'
    ],
    'data-scientist': [
      'Explain a machine learning project you worked on.',
      'How do you handle missing data in your analysis?',
      'Describe your approach to feature selection.',
      'How do you validate your model results?',
      'Tell me about a time when your analysis led to business impact.'
    ]
  };

  const handleStartSimulation = async () => {
    setIsSimulating(true);
    
    try {
      const response = await fetch('http://localhost:3002/api/interview-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedRole,
          difficulty: difficulty,
          company: ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate interview prep');
      }

      const prepData = await response.json();
      
      setSimulation({
        role: selectedRole,
        questions: prepData.questions || roleQuestions[selectedRole]?.slice(0, 3) || [
          'Tell me about yourself and your experience.',
          'Why are you interested in this role?',
          'What are your greatest strengths?'
        ],
        tips: prepData.tips || [
          'Use the STAR method (Situation, Task, Action, Result)',
          'Be specific with examples and metrics',
          'Ask clarifying questions when needed',
          'Show enthusiasm and cultural fit'
        ],
        score: prepData.score || 85
      });
    } catch (error) {
      console.error('Interview prep failed:', error);
      // Fallback to existing questions
      const questions = roleQuestions[selectedRole] || [
        'Tell me about yourself and your experience.',
        'Why are you interested in this role?',
        'What are your greatest strengths?'
      ];
      
      setSimulation({
        role: selectedRole,
        questions: questions.slice(0, 3),
        tips: [
          'Use the STAR method (Situation, Task, Action, Result)',
          'Be specific with examples and metrics',
          'Ask clarifying questions when needed',
          'Show enthusiasm and cultural fit'
        ],
        score: 85
      });
    } finally {
      setIsSimulating(false);
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
                🎯 Interview Preparation
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '4px 0 0 0',
                fontWeight: '400'
              }}>
                Practice with AI-powered mock interviews and get real-time feedback
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
                background: 'linear-gradient(135deg, #10b981, #059669)',
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
          
          {/* Setup Section */}
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
                🎪 Setup Your Interview
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Target Role
                </h3>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
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
                  <option value="software-engineer">Software Engineer</option>
                  <option value="product-manager">Product Manager</option>
                  <option value="data-scientist">Data Scientist</option>
                  <option value="marketing-manager">Marketing Manager</option>
                  <option value="sales-executive">Sales Executive</option>
                </select>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Difficulty Level
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: 'none',
                        borderRadius: '12px',
                        background: difficulty === level 
                          ? 'linear-gradient(135deg, #10b981, #059669)' 
                          : 'rgba(255,255,255,0.6)',
                        color: difficulty === level ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartSimulation}
                disabled={isSimulating}
                style={{
                  width: '100%',
                  background: isSimulating ? '#ccc' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  cursor: isSimulating ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: isSimulating ? 'none' : '0 4px 15px rgba(16,185,129,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isSimulating ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderRadius: '50%',
                      borderTopColor: 'white',
                      animation: 'spin 1s ease-in-out infinite'
                    }} />
                    Preparing Interview...
                  </>
                ) : (
                  '🚀 Start Mock Interview'
                )}
              </button>

              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: 'rgba(16,185,129,0.1)',
                borderRadius: '12px'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '8px'
                }}>
                  ✨ What You'll Get:
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  <li style={{ marginBottom: '4px' }}>• Role-specific questions</li>
                  <li style={{ marginBottom: '4px' }}>• Real-time feedback</li>
                  <li style={{ marginBottom: '4px' }}>• STAR method coaching</li>
                  <li>• Performance scoring</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {!simulation ? (
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
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>💼</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '16px'
                }}>
                  Ready for Your Interview?
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}>
                  Select your target role and difficulty level to start practicing with AI-powered mock interviews.
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
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    color: simulation.score >= 90 ? '#10b981' : simulation.score >= 80 ? '#f59e0b' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {simulation.score}/100
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '4px'
                  }}>
                    Interview Performance
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {simulation.score >= 90 ? 'Excellent performance!' : 
                     simulation.score >= 80 ? 'Good performance with room for improvement' : 
                     'Needs more practice'}
                  </p>
                </div>

                <div style={{
                  background: 'rgba(16,185,129,0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                    marginBottom: '12px'
                  }}>
                    🎯 Sample Questions
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {simulation.questions.map((question, index) => (
                      <li key={index} style={{
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '8px',
                        paddingLeft: '16px',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: '#10b981',
                          fontWeight: 'bold'
                        }}>{index + 1}.</span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  background: 'rgba(59,130,246,0.1)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#3b82f6',
                    marginBottom: '12px'
                  }}>
                    💡 Interview Tips
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {simulation.tips.map((tip, index) => (
                      <li key={index} style={{
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '8px',
                        paddingLeft: '16px',
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

export default InterviewPrep;
