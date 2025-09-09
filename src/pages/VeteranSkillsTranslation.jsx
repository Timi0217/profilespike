import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../components/AuthContext';

const VeteranSkillsTranslation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [militaryRole, setMilitaryRole] = useState('');
  const [branch, setBranch] = useState('army');
  const [yearsServed, setYearsServed] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [experience, setExperience] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [translation, setTranslation] = useState(null);

  const demoUser = {
    name: 'Demo User',
    email: 'demo@profilespike.com',
    credits: 3
  };

  const handleTranslate = async () => {
    if (!militaryRole || !targetIndustry) {
      alert('Please fill in military role and target industry.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await fetch('http://localhost:3002/api/veteran-translation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          militaryRole,
          branch,
          yearsServed,
          targetIndustry,
          experience
        })
      });

      if (!response.ok) {
        throw new Error('Failed to translate veteran skills');
      }

      const translationData = await response.json();
      setTranslation(translationData);
    } catch (error) {
      console.error('Veteran skills translation failed:', error);
      // Fallback to mock data
      setTranslation({
      translatedRole: 'Operations Manager',
      matchScore: 88,
      translatedSkills: [
        {
          military: 'Squad Leader',
          civilian: 'Team Leadership',
          description: 'Led teams of 8-12 personnel in high-pressure environments, ensuring mission success and team safety'
        },
        {
          military: 'Mission Planning',
          civilian: 'Project Management',
          description: 'Coordinated complex operations with multiple stakeholders, timelines, and resource constraints'
        },
        {
          military: 'Equipment Maintenance',
          civilian: 'Asset Management',
          description: 'Maintained accountability and operational readiness of high-value equipment and resources'
        },
        {
          military: 'Training Development',
          civilian: 'Learning & Development',
          description: 'Designed and delivered training programs to enhance team performance and compliance'
        }
      ],
      certifications: [
        {
          military: 'Combat Lifesaver',
          civilian: 'First Aid/CPR Certified',
          transferValue: 'High - demonstrates crisis management and emergency response skills'
        },
        {
          military: 'Security Clearance',
          civilian: 'Trusted with Sensitive Information',
          transferValue: 'Very High - shows reliability and trustworthiness for confidential projects'
        }
      ],
      recommendedRoles: [
        {
          title: 'Operations Manager',
          industry: 'Manufacturing',
          match: '92%',
          salary: '$75,000 - $95,000'
        },
        {
          title: 'Project Coordinator',
          industry: 'Construction',
          match: '88%',
          salary: '$65,000 - $85,000'
        },
        {
          title: 'Logistics Specialist',
          industry: 'Supply Chain',
          match: '90%',
          salary: '$60,000 - $80,000'
        }
      ],
      resumeTips: [
        'Use civilian terminology instead of military jargon (e.g., "managed" instead of "commanded")',
        'Quantify achievements with specific numbers and metrics',
        'Emphasize leadership experience and ability to work under pressure',
        'Highlight training and mentoring experience as professional development skills',
        'Focus on transferable skills like problem-solving, adaptability, and teamwork'
      ],
      interviewTips: [
        'Practice explaining military experiences using civilian business language',
        'Prepare specific examples that demonstrate leadership and problem-solving',
        'Research the company culture to understand how your military values align',
        'Be ready to discuss how military discipline translates to workplace productivity'
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
                🎖️ Veteran Skills Translation
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '4px 0 0 0',
                fontWeight: '400'
              }}>
                Transform your military experience into powerful civilian career assets
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
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
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
                🪖 Military Experience
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Military Role/MOS
                </h3>
                <input
                  type="text"
                  value={militaryRole}
                  onChange={(e) => setMilitaryRole(e.target.value)}
                  placeholder="e.g. Infantry Team Leader, Aviation Mechanic"
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
                  Branch of Service
                </h3>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
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
                  <option value="army">Army</option>
                  <option value="navy">Navy</option>
                  <option value="airforce">Air Force</option>
                  <option value="marines">Marines</option>
                  <option value="coastguard">Coast Guard</option>
                  <option value="spaceforce">Space Force</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Years of Service
                </h3>
                <input
                  type="number"
                  value={yearsServed}
                  onChange={(e) => setYearsServed(e.target.value)}
                  placeholder="4"
                  min="1"
                  max="30"
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
                  Target Industry
                </h3>
                <select
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
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
                  <option value="">Select Target Industry</option>
                  <option value="technology">Technology</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="logistics">Logistics & Supply Chain</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="construction">Construction</option>
                  <option value="government">Government/Public Sector</option>
                  <option value="consulting">Consulting</option>
                </select>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  Key Experiences (Optional)
                </h3>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Describe your key responsibilities, achievements, or specialized training..."
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
                onClick={handleTranslate}
                disabled={isAnalyzing || !militaryRole || !targetIndustry}
                style={{
                  width: '100%',
                  background: isAnalyzing || !militaryRole || !targetIndustry ? '#ccc' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  cursor: isAnalyzing || !militaryRole || !targetIndustry ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: isAnalyzing || !militaryRole || !targetIndustry ? 'none' : '0 4px 15px rgba(99,102,241,0.3)',
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
                    Translating Skills...
                  </>
                ) : (
                  '🎖️ Translate Military Experience'
                )}
              </button>

              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: 'rgba(99,102,241,0.1)',
                borderRadius: '12px'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6366f1',
                  marginBottom: '8px'
                }}>
                  🎯 Translation Includes:
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: '13px',
                  color: '#374151'
                }}>
                  <li style={{ marginBottom: '4px' }}>• Military-to-civilian skill translation</li>
                  <li style={{ marginBottom: '4px' }}>• Recommended job roles and salaries</li>
                  <li style={{ marginBottom: '4px' }}>• Resume and interview guidance</li>
                  <li>• Certification equivalency mapping</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {!translation ? (
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
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎖️</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '16px'
                }}>
                  Ready to Translate Your Service?
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}>
                  Help us understand your military background and target industry to create a powerful civilian career profile.
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
                    fontSize: '32px',
                    fontWeight: '700',
                    color: translation.matchScore >= 90 ? '#10b981' : translation.matchScore >= 80 ? '#f59e0b' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {translation.translatedRole}
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '4px'
                  }}>
                    Best Civilian Role Match
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6366f1',
                    fontWeight: '500'
                  }}>
                    {translation.matchScore}% Match Score
                  </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#6366f1',
                    marginBottom: '16px'
                  }}>
                    🔄 Skills Translation
                  </h4>
                  {translation.translatedSkills.slice(0, 3).map((skill, index) => (
                    <div key={index} style={{
                      background: 'rgba(99,102,241,0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '12px',
                      borderLeft: '4px solid #6366f1'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#ef4444',
                          background: 'rgba(239,68,68,0.1)',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          {skill.military}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>→</span>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#10b981',
                          background: 'rgba(16,185,129,0.1)',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          {skill.civilian}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '12px',
                        color: '#374151',
                        margin: 0,
                        lineHeight: '1.4'
                      }}>
                        {skill.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                    marginBottom: '12px'
                  }}>
                    🎯 Recommended Roles
                  </h4>
                  {translation.recommendedRoles.map((role, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: 'rgba(16,185,129,0.05)',
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
                          {role.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {role.industry}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981' }}>
                          {role.match}
                        </div>
                        <div style={{ fontSize: '11px', color: '#374151' }}>
                          {role.salary}
                        </div>
                      </div>
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
                    💡 Career Success Tips
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    fontSize: '12px',
                    color: '#374151'
                  }}>
                    {translation.resumeTips.slice(0, 3).map((tip, index) => (
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

export default VeteranSkillsTranslation;