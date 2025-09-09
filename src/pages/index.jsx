import Layout from "./Layout.jsx";

import SimpleDashboard from "./SimpleDashboard2";

import Onboarding from "./Onboarding";

import ResumeAnalyzer from "./ResumeAnalyzer";

import LinkedInOptimizer from "./LinkedInOptimizer";

import Profile from "./Profile";

import PortfolioReview from "./PortfolioReview";

import InterviewPrep from "./InterviewPrep";

import Home from "./Home";

import VeteranTranslator from "./VeteranTranslator";

import ReskillingRadar from "./ReskillingRadar";

import Pricing from "./Pricing";

import About from "./About";

import SavedInsights from "./SavedInsights";

import HelpCenter from "./HelpCenter";

import PrivacyPolicy from "./PrivacyPolicy";

import TermsOfService from "./TermsOfService";

import AdminDashboard from "./AdminDashboard";

import PaymentSuccess from "./PaymentSuccess";

import PaymentCancel from "./PaymentCancel";

import CompensationAnalyzer from "./CompensationAnalyzer";

import CareerMapping from "./CareerMapping";

import AdminSetup from "./AdminSetup";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: SimpleDashboard,
    
    Onboarding: Onboarding,
    
    ResumeAnalyzer: ResumeAnalyzer,
    
    LinkedInOptimizer: LinkedInOptimizer,
    
    Profile: Profile,
    
    PortfolioReview: PortfolioReview,
    
    InterviewPrep: InterviewPrep,
    
    Home: Home,
    
    VeteranTranslator: VeteranTranslator,
    
    ReskillingRadar: ReskillingRadar,
    
    Pricing: Pricing,
    
    About: About,
    
    SavedInsights: SavedInsights,
    
    HelpCenter: HelpCenter,
    
    PrivacyPolicy: PrivacyPolicy,
    
    TermsOfService: TermsOfService,
    
    AdminDashboard: AdminDashboard,
    
    PaymentSuccess: PaymentSuccess,
    
    PaymentCancel: PaymentCancel,
    
    CompensationAnalyzer: CompensationAnalyzer,
    
    CareerMapping: CareerMapping,
    
    AdminSetup: AdminSetup,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/Pricing" element={<Pricing />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                    <Route path="/TermsOfService" element={<TermsOfService />} />
                    <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
                    <Route path="/PaymentCancel" element={<PaymentCancel />} />
                    
                    {/* Protected routes - require authentication */}
                    <Route path="/dashboard" element={<SimpleDashboard />} />
                    <Route path="/Dashboard" element={<SimpleDashboard />} />
                    <Route path="/Onboarding" element={<Onboarding />} />
                    <Route path="/ResumeAnalyzer" element={<ResumeAnalyzer />} />
                    <Route path="/LinkedInOptimizer" element={<LinkedInOptimizer />} />
                    <Route path="/Profile" element={<Profile />} />
                    <Route path="/PortfolioReview" element={<PortfolioReview />} />
                    <Route path="/InterviewPrep" element={<InterviewPrep />} />
                    <Route path="/VeteranTranslator" element={<VeteranTranslator />} />
                    <Route path="/ReskillingRadar" element={<ReskillingRadar />} />
                    <Route path="/SavedInsights" element={<SavedInsights />} />
                    <Route path="/HelpCenter" element={<HelpCenter />} />
                    <Route path="/CompensationAnalyzer" element={<CompensationAnalyzer />} />
                    <Route path="/CareerMapping" element={<CareerMapping />} />
                    <Route path="/AdminDashboard" element={<AdminDashboard />} />
                    <Route path="/AdminSetup" element={<AdminSetup />} />
                </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}