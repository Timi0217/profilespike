
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { useAuth } from "../components/AuthContext";

const aiService = {
  analyzeResume: async (resumeText, targetRole = '') => {
    try {
      const response = await fetch('http://localhost:3002/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText, targetRole })
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Resume analysis error:', error);
      throw error;
    }
  }
};

export default function ResumeAnalyzer() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisScore, setAnalysisScore] = useState(0);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  // Simulate demo user for now
  const demoUser = {
    name: 'Demo User',
    email: 'demo@profilespike.com',
    credits: 3
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Check file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB. Please choose a smaller file.');
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!validTypes.includes(selectedFile.type)) {
      alert('Please select a PDF, Word document, or text file.');
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(selectedFile);
    
    // Extract text content for analysis
    if (selectedFile.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target.result);
      };
      reader.readAsText(selectedFile);
    } else {
      // For PDF/Word files, we'll send the file to the backend for text extraction
      // For now, we'll just indicate that the file is ready
      setResumeText(''); // Clear any existing text
      console.log('File ready for server-side text extraction:', selectedFile.name);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/msword' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        if (selectedFile.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (e) => {
            setResumeText(e.target.result);
          };
          reader.readAsText(selectedFile);
        }
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file && !resumeText) {
      alert('Please upload a file or paste your resume text.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      // Show progress simulation for better UX
      const steps = [
        'Uploading resume...',
        'Extracting text content...',
        'Analyzing ATS compatibility...',
        'Checking keyword density...',
        'Generating AI-powered insights...'
      ];

      let stepIndex = 0;
      const progressInterval = setInterval(() => {
        if (stepIndex < steps.length - 1) {
          stepIndex++;
          setAnalysisScore(stepIndex * 20);
        }
      }, 1000);

      let textContent = resumeText;
      
      // If we have a file, extract text from it
      if (file) {
        if (file.type === 'text/plain') {
          // Text file - already extracted
          textContent = resumeText;
        } else {
          // For PDF/Word files, we need to extract text
          const formData = new FormData();
          formData.append('file', file);
          
          try {
            const response = await fetch('http://localhost:3002/api/extract-text', {
              method: 'POST',
              body: formData
            });
            
            if (response.ok) {
              const result = await response.json();
              textContent = result.text;
            } else {
              // Fallback: use filename as indicator if text extraction fails
              textContent = `Resume file: ${file.name}. Please implement proper PDF/Word text extraction on the backend.`;
            }
          } catch (extractError) {
            console.warn('Text extraction failed, using fallback:', extractError);
            textContent = `Resume file: ${file.name}. File uploaded successfully but text extraction needs backend implementation.`;
          }
        }
      }

      // Call real AI API with extracted text
      const analysisResult = await aiService.analyzeResume(textContent, '');
      
      clearInterval(progressInterval);
      setAnalysisScore(100);
      
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Resume analysis failed:', error);
      alert('Resume analysis failed. Please try again or check if the server is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ScoreCard = ({ title, score, description }) => (
    <div style={{
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '16px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
    }}>
      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        color: score >= 90 ? '#10b981' : score >= 80 ? '#f59e0b' : score >= 70 ? '#ef4444' : '#6b7280',
        marginBottom: '8px'
      }}>
        {score}/100
      </div>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '4px'
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '12px',
        color: '#6b7280'
      }}>
        {description}
      </div>
    </div>
  );

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
                📄 AI Resume Analyzer
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '4px 0 0 0',
                fontWeight: '400'
              }}>
                Get instant ATS optimization and professional feedback
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
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
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
          
          {/* Upload Section */}
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
                📄 Upload Your Resume
              </h2>
              
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: dragActive ? '3px dashed #667eea' : file ? '3px dashed #10b981' : '3px dashed #cbd5e1',
                  borderRadius: '20px',
                  padding: '60px 40px',
                  textAlign: 'center',
                  background: dragActive ? 'rgba(102,126,234,0.08)' : file ? 'rgba(16,185,129,0.08)' : 'rgba(248,250,252,0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '32px',
                  position: 'relative'
                }}
              >
                {file ? (
                  <>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#10b981',
                      marginBottom: '8px'
                    }}>
                      {file.name}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '16px'
                    }}>
                      File ready for AI analysis
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#10b981',
                      fontWeight: '500'
                    }}>
                      Click to change file
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>📄</div>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      marginBottom: '8px'
                    }}>
                      Upload Your Resume (PDF)
                    </p>
                    <p style={{
                      fontSize: '16px',
                      color: '#6b7280',
                      marginBottom: '20px'
                    }}>
                      Drag & drop or click to browse
                    </p>
                    <div style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '16px'
                    }}>
                      Choose File
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      Supports PDF, DOC, DOCX • Max 10MB
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {!file && (
                <div style={{
                  padding: '20px',
                  background: 'rgba(102,126,234,0.05)',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '1px solid rgba(102,126,234,0.1)'
                }}>
                  <details style={{ cursor: 'pointer' }}>
                    <summary style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#667eea',
                      marginBottom: '12px',
                      outline: 'none'
                    }}>
                      📝 Alternative: Paste resume text
                    </summary>
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="If you don't have a PDF, you can paste your resume text here..."
                      style={{
                        width: '100%',
                        height: '150px',
                        padding: '16px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        background: 'rgba(255,255,255,0.9)',
                        marginTop: '12px'
                      }}
                    />
                  </details>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={(!file && !resumeText) || isAnalyzing}
                style={{
                  width: '100%',
                  background: (!file && !resumeText) || isAnalyzing ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  cursor: (!file && !resumeText) || isAnalyzing ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: (!file && !resumeText) || isAnalyzing ? 'none' : '0 4px 15px rgba(102,126,234,0.3)',
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
                    Analyzing... ({analysisScore}%)
                  </>
                ) : (
                  '🔍 Analyze Resume'
                )}
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
                  lineHeight: '1.6',
                  maxWidth: '300px',
                  margin: '0 auto'
                }}>
                  Upload your resume or paste the content to get instant ATS optimization suggestions and scoring.
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
                    color: analysis.overall_score >= 90 ? '#10b981' : analysis.overall_score >= 80 ? '#f59e0b' : '#ef4444',
                    marginBottom: '8px'
                  }}>
                    {analysis.overall_score}/100
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '4px'
                  }}>
                    Overall Resume Score
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    {analysis.overall_score >= 90 ? 'Excellent!' : 
                     analysis.overall_score >= 80 ? 'Good!' : 
                     analysis.overall_score >= 70 ? 'Needs improvement' : 'Requires significant work'}
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  marginBottom: '32px'
                }}>
                  <ScoreCard title="ATS Score" score={analysis.ats_score} description="Applicant Tracking System compatibility" />
                  <ScoreCard title="Content" score={analysis.content_score} description="Content quality and relevance" />
                  <ScoreCard title="Format" score={analysis.format_score} description="Structure and formatting" />
                  <ScoreCard title="Keywords" score={analysis.keyword_score} description="Industry keyword usage" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
                      {analysis.strengths.map((strength, index) => (
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
                      {analysis.improvements.map((improvement, index) => (
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
                            color: '#f59e0b'
                          }}>•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
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
}
