import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResumeAnalyzerSimple() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!resumeText) {
      alert('Please paste your resume text.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setAnalysis({
        overall_score: 87,
        ats_score: 85,
        content_score: 89,
        strengths: [
          'Strong technical skills section with relevant programming languages',
          'Clear professional experience with quantified achievements',
          'Well-structured education section'
        ],
        improvements: [
          'Add more industry-specific keywords to improve ATS compatibility',
          'Include a professional summary section at the top',
          'Quantify more achievements with specific numbers'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
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
                📄 AI Resume Analyzer
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '4px 0 0 0'
              }}>
                Get instant ATS optimization and professional feedback
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
                Upload Your Resume
              </h2>
              
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                style={{
                  width: '100%',
                  height: '300px',
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
                disabled={isAnalyzing || !resumeText}
                style={{
                  width: '100%',
                  background: isAnalyzing || !resumeText ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  cursor: isAnalyzing || !resumeText ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {isAnalyzing ? 'Analyzing...' : '🔍 Analyze Resume'}
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
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚡</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '16px'
                }}>
                  Ready for AI Analysis
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}>
                  Paste your resume content to get instant ATS optimization suggestions and scoring.
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
                    color: analysis.overall_score >= 90 ? '#10b981' : analysis.overall_score >= 80 ? '#f59e0b' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {analysis.overall_score}/100
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    Overall Resume Score
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div style={{
                    background: 'rgba(102,126,234,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#667eea' }}>
                      {analysis.ats_score}/100
                    </div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>ATS Score</div>
                  </div>
                  <div style={{
                    background: 'rgba(16,185,129,0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#10b981' }}>
                      {analysis.content_score}/100
                    </div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>Content Score</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#10b981', marginBottom: '12px' }}>
                      ✓ Strengths
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
                  
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b', marginBottom: '12px' }}>
                      ⚡ Improvements
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzerSimple;