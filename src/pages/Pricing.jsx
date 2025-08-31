
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UserProfile } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Star, 
  Sparkles, 
  Shield, 
  Users,
  Zap,
  Crown,
  FileText,
  MessageSquare,
  Briefcase,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import UserCounter from "../components/UserCounter";
import { createCheckoutSession } from "@/api/functions";

const pricingPlans = [
  {
    name: "Free Forever",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out ProfileSpike",
    features: [
      "3 AI resume analyses",
      "3 LinkedIn profile reviews", 
      "Analyses refresh every 30 days",
      "Basic interview prep",
      "Standard templates"
    ],
    ctaText: "Get Started Free",
    popular: false,
    color: "border-gray-200",
    priceId: null // Free plan
  },
  {
    name: "Recent Graduate",
    priceId: "price_1RvQjcGors2O0tZe4RAhW2IK", // TODO: Replace with actual Stripe price ID from dashboard
    price: "$15",
    discountedPrice: "$12",
    period: "month",
    description: "For students & new grads",
    features: [
      "Unlimited AI analyses",
      "Advanced resume templates",
      "LinkedIn optimization",
      "Interview simulation",
      "Portfolio reviews",
      "Compensation analyzer & negotiation guidance",
      "Priority email support",
      "Export to PDF/Word",
      "Version history tracking"
    ],
    ctaText: "Start Learning",
    popular: false,
    color: "border-gray-200",
  },
  {
    name: "Freelance & Professional & Veteran",
    priceId: "price_1RvQpzGors2O0tZe77uf1Dao", // TODO: Replace with actual Stripe price ID from dashboard
    price: "$25",
    discountedPrice: "$20",
    period: "month",
    description: "For serious career growth",
    features: [
      "Everything in Recent Graduate",
      "Veteran translation tool",
      "Advanced keyword and Match Score alignment",
      "Repository for tracking interview and job search activity",
      "Salary analysis with market data & negotiation strategies",
      "Access to Adobe Express and 50,000+ resume templates",
      "Advanced analytics (soon)"
    ],
    ctaText: "Start Professional",
    popular: true,
    color: "border-black ring-2 ring-black",
  }
];

const faqs = [
  {
    question: "How does the AI analysis work?",
    answer: "Our AI uses advanced natural language processing to analyze your resume, LinkedIn profile, and other career documents. It checks for ATS compatibility, keyword optimization, formatting issues, and provides personalized recommendations based on your industry and career level."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period, and you'll continue to have access to all premium features during that time."
  },
  {
    question: "What file formats do you support?",
    answer: "We currently support PDF files for resume uploads. For LinkedIn analysis, we work directly with your profile URL. Portfolio reviews can analyze websites, GitHub profiles, and other online portfolios."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade security measures including SSL encryption, secure cloud storage, and strict data privacy policies. Your personal information and documents are never shared with third parties."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with ProfileSpike, contact our support team for a full refund of the current months subscription within 30 days of your purchase.  This refund does not include previous amounts paid outside of the current thirty (30) day period."
  }
];

export default function Pricing() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      
      const profiles = await UserProfile.filter({ created_by: currentUser.email });
      if (profiles.length > 0) {
        setUserProfile(profiles[0]);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handlePlanSelect = async (plan) => {
    if (!isAuthenticated) {
      User.loginWithRedirect(window.location.origin + createPageUrl("Pricing"));
      return;
    }
    
    if (plan.name === "Free Forever") {
      window.location.href = createPageUrl("Onboarding");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await createCheckoutSession({
        priceId: plan.priceId,
        planName: plan.name,
        billingCycle: billingCycle
      });
      
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        setError('Failed to create checkout session. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.error?.message || 'Failed to start checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full -translate-y-40 translate-x-40"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full translate-y-30 -translate-x-30"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-black mb-6 tracking-tight">
              Choose Your Career Growth Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From free analysis to unlimited career coaching, find the perfect plan for your journey
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-black' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'semi-annual' : 'monthly')}
                className="relative w-12 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md"
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${billingCycle === 'semi-annual' ? 'translate-x-6' : ''}`} />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'semi-annual' ? 'text-black' : 'text-gray-500'}`}>
                Semi-Annual
                <Badge className="ml-2 bg-gradient-to-r from-green-400 to-green-600 text-white shadow-sm">Save 20%</Badge>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative h-full flex flex-col border-2 ${plan.popular ? 'border-transparent bg-gradient-to-br from-purple-50 to-blue-50 shadow-2xl scale-105 rounded-3xl ring-2 ring-purple-200' : 'border-gray-200 shadow-lg rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-102'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full shadow-lg">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center p-8">
                    <CardTitle className="text-2xl font-bold text-black mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-black">
                        {billingCycle === 'semi-annual' && plan.discountedPrice ? plan.discountedPrice : plan.price}
                      </span>
                      {plan.period !== 'forever' && (
                        <span className="text-gray-500">/mo</span>
                      )}
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="p-8 pt-0 flex-grow flex flex-col">
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-gray-700">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-auto p-6 pt-0">
                      <Button
                        onClick={() => handlePlanSelect(plan)}
                        disabled={isProcessing}
                        className={`w-full py-3 text-lg rounded-xl transform hover:scale-105 transition-all duration-200 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700' 
                            : 'bg-gray-100 text-black hover:bg-gray-200'
                        }`}
                      >
                        {isProcessing ? 'Processing...' : plan.ctaText}
                      </Button>
                      {error && (
                        <p className="text-red-500 text-center text-sm mt-2">{error}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full -translate-y-32"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full translate-y-40"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            Feature Comparison
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-6 font-semibold text-black">Features</th>
                    <th className="text-center p-6 font-semibold text-black">Free Forever</th>
                    <th className="text-center p-6 font-semibold text-black">Recent Graduate</th>
                    <th className="text-center p-6 font-semibold text-black bg-black text-white">Freelance & Pro & Vet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-6 font-medium text-gray-900">AI Resume Analysis</td>
                    <td className="p-6 text-center text-gray-500">3 uses/mo</td>
                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-6 text-center bg-gray-50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-gray-900">LinkedIn Optimization</td>
                    <td className="p-6 text-center text-gray-500">3 uses/mo</td>
                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-6 text-center bg-gray-50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-gray-900">Interview Prep</td>
                    <td className="p-6 text-center text-gray-500">Basic</td>
                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-6 text-center bg-gray-50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-gray-900">Compensation Analysis & Negotiation</td>
                    <td className="p-6 text-center">-</td>
                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-6 text-center bg-gray-50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-gray-900">Veteran Translation Tool</td>
                    <td className="p-6 text-center">-</td>
                    <td className="p-6 text-center">-</td>
                    <td className="p-6 text-center bg-gray-50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-gray-900">Priority Support</td>
                    <td className="p-6 text-center">-</td>
                    <td className="p-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="p-6 text-center bg-gray-50"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full -translate-y-24 translate-x-24"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-black mb-4">
              Join <UserCounter className="text-black" /> Professionals Already Growing
            </h3>
            <p className="text-gray-600 mb-8">
              Trusted by career-focused individuals across 50+ countries
            </p>
            <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Enterprise Security
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                4.9/5 Average Rating
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                50+ Countries
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-black mb-4">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've already accelerated their careers with ProfileSpike
          </p>
          <Button 
            onClick={() => handlePlanSelect(pricingPlans.find(p => p.name === 'Freelance & Professional & Veteran'))}
            disabled={isProcessing}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isProcessing ? 'Processing...' : 'Start Professional Plan'}
          </Button>
        </div>
      </section>
    </div>
  );
}
