import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LinkedInOptimizerSimple() {
  const navigate = useNavigate();
  const [profileText, setProfileText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!profileText) {
      alert('Please paste your LinkedIn profile text.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setAnalysis({
        profile_score: 82,
        visibility_score: 78,
        keywords_score: 85,
        strengths: [
          'Strong professional headline with relevant keywords',
          'Comprehensive work experience with achievements',
          'Active engagement with industry content'
        ],
        improvements: [
          'Add more industry-specific keywords to summary section',
          'Include quantified results in experience descriptions',
          'Optimize headline for better recruiter search visibility',
          'Add skills endorsements and recommendations'
        ],
        keyword_suggestions: [
          'Digital Marketing', 'SEO Optimization', 'Data Analytics', 'Project Management', 'Team Leadership'
        ]
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
    }}>
      {/* Header */}
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
                margin: 0
              }}>
                🔗 LinkedIn Profile Optimizer
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '4px 0 0 0'
              }}>
                Maximize your profile visibility and recruiter reach
              </p>
            </div>
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
                marginBottom: '24px'
              }}>
                Import Your Profile
              </h2>
              
              <textarea
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder="Paste your LinkedIn profile text here, including your headline, summary, and experience sections..."
                style={{
                  width: '100%',
                  height: '320px',
                  padding: '16px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginBottom: '24px'
                }}
              />

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !profileText}
                style={{
                  width: '100%',
                  background: isAnalyzing || !profileText ? '#ccc' : 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  cursor: isAnalyzing || !profileText ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {isAnalyzing ? 'Analyzing Profile...' : '🔍 Optimize Profile'}
              </button>
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
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚀</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '16px'
                }}>
                  Ready for LinkedIn Analysis
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}>
                  Import your profile content to get personalized optimization recommendations.
                </p>
              </div>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    color: analysis.profile_score >= 90 ? '#10b981' : analysis.profile_score >= 80 ? '#f59e0b' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {analysis.profile_score}/100
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    Profile Optimization Score
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div style={{
                    background: 'rgba(14,165,233,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#0ea5e9' }}>
                      {analysis.visibility_score}/100
                    </div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>Visibility Score</div>
                  </div>
                  <div style={{
                    background: 'rgba(16,185,129,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#10b981' }}>
                      {analysis.keywords_score}/100
                    </div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>Keywords Score</div>
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#10b981', marginBottom: '12px' }}>
                    ✓ Profile Strengths
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} style={{
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '8px',
                        paddingLeft: '16px',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', left: 0, color: '#10b981' }}>•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b', marginBottom: '12px' }}>
                    ⚡ Optimization Suggestions
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} style={{
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '8px',
                        paddingLeft: '16px',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'absolute', left: 0, color: '#f59e0b' }}>•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#8b5cf6', marginBottom: '12px' }}>
                    🔑 Recommended Keywords
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {analysis.keyword_suggestions.map((keyword, index) => (
                      <span key={index} style={{
                        background: 'rgba(139,92,246,0.1)',
                        color: '#8b5cf6',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkedInOptimizerSimple;