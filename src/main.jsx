import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import SimpleHome from './SimpleHome.jsx'
import SimpleDashboard2 from './SimpleDashboard2.jsx'
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx'
import LinkedInOptimizer from './pages/LinkedInOptimizer.jsx'
import InterviewPrep from './pages/InterviewPrep.jsx'
import CareerMapping from './pages/CareerMapping.jsx'
import CompensationAnalyzer from './pages/CompensationAnalyzer.jsx'
import PortfolioReview from './pages/PortfolioReview.jsx'
import VeteranSkillsTranslation from './pages/VeteranSkillsTranslation.jsx'

function WorkingApp() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SimpleHome />} />
          <Route path="/dashboard" element={<SimpleDashboard2 />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/career-mapping" element={<CareerMapping />} />
          <Route path="/compensation-analyzer" element={<CompensationAnalyzer />} />
          <Route path="/portfolio-review" element={<PortfolioReview />} />
          <Route path="/veteran-skills-translation" element={<VeteranSkillsTranslation />} />
          <Route path="*" element={<SimpleHome />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <WorkingApp />
) 