import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import './App.css';

// Import pages
import Home from './pages/Home';
import Dashboard from './pages/SimpleDashboard2';
import Onboarding from './pages/Onboarding';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import LinkedInOptimizer from './pages/LinkedInOptimizer';
import Profile from './pages/Profile';
import InterviewPrep from './pages/InterviewPrep';
import CareerMapping from './pages/CareerMapping';
import CompensationAnalyzer from './pages/CompensationAnalyzer';
import PortfolioReview from './pages/PortfolioReview';
import VeteranSkillsTranslation from './pages/VeteranSkillsTranslation';
import SavedInsights from './pages/SavedInsights';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="/career-mapping" element={<CareerMapping />} />
            <Route path="/compensation-analyzer" element={<CompensationAnalyzer />} />
            <Route path="/portfolio-review" element={<PortfolioReview />} />
            <Route path="/veteran-skills-translation" element={<VeteranSkillsTranslation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-insights" element={<SavedInsights />} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;