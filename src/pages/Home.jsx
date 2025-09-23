
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  FileText,
  Linkedin,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Users,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  GraduationCap,
  User as UserIcon,
  Globe,
  BookOpen,
  Target,
  Award,
  Brain,
  Rocket,
  DollarSign // Added DollarSign import
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import UserCounter from "../components/UserCounter";
import InteractiveResumeDemo from "../components/InteractiveResumeDemo";
import SuccessStories from "../components/SuccessStories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthContext"; // Corrected import path

const rotatingMessages = [
  {
    persona: "Recent Graduate",
    message: "Transform your potential into your first breakthrough role",
    color: "from-emerald-400 to-teal-500"
  },
  {
    persona: "Career Veteran",
    message: "Translate your experience into your next chapter",
    color: "from-blue-400 to-indigo-500"
  },
  {
    persona: "Career Changer",
    message: "Navigate your pivot to a new field",
    color: "from-purple-400 to-pink-500"
  },
  {
    persona: "Tenured Professional",
    message: "Elevate your expertise to new heights",
    color: "from-orange-400 to-red-500"
  }
];

const features = [
  {
    title: "AI Resume & LinkedIn Analyzer",
    description: "ATS-optimized scanning with real-time suggestions and Enhancv-style formatting options",
    icon: FileText,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    preview: "Get 95+ ATS score"
  },
  {
    title: "Interview Prep Simulator",
    description: "Text and voice practice with STAR method coaching and tone analysis",
    icon: MessageSquare,
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    preview: "Practice 100+ scenarios"
  },
  {
    title: "Portfolio Review Engine",
    description: "Analyze GitHub, Behance, or personal sites for recruiter impact and SEO optimization",
    icon: Briefcase,
    color: "bg-gradient-to-br from-purple-500 to-violet-600",
    preview: "Boost visibility 3x"
  },
  {
    title: "Compensation Analyzer",
    description: "Market salary data, negotiation strategies, and personalized compensation recommendations",
    icon: DollarSign,
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    preview: "Know your worth"
  },
  {
    title: "Veteran Translation Tool",
    description: "Convert military experience into civilian-friendly language that recruiters understand",
    icon: Award,
    color: "bg-gradient-to-br from-red-500 to-rose-600",
    preview: "Decode military skills"
  },
  {
    title: "Reskilling Radar",
    description: "AI-powered gap analysis with personalized learning paths from top platforms",
    icon: Brain,
    color: "bg-gradient-to-br from-indigo-500 to-blue-600",
    preview: "Close skill gaps fast"
  },
  {
    title: "Career Story Builder",
    description: "Create compelling narrative resumes that showcase your unique professional journey",
    icon: BookOpen,
    color: "bg-gradient-to-br from-teal-500 to-cyan-600",
    preview: "Tell your story powerfully"
  }
];

const userTypes = [
  {
    id: 'recent_grad',
    title: 'Recent Graduate',
    description: 'Launch your career with AI-powered guidance',
    icon: GraduationCap,
    color: 'emerald',
    benefits: ['Entry-level resume optimization', 'LinkedIn profile setup', 'First-time interview prep', 'Skill gap analysis']
  },
  {
    id: 'professional',
    title: 'Tenured Professional',
    description: 'Advance to executive-level opportunities',
    icon: UserIcon,
    color: 'blue',
    benefits: ['Executive resume strategies', 'Leadership positioning', 'Career transition guidance', 'Executive interview prep']
  },
  {
    id: 'freelancer',
    title: 'Freelancer & Creator',
    description: 'Build your independent brand and portfolio',
    icon: Zap,
    color: 'purple',
    benefits: ['Portfolio optimization', 'Client-focused positioning', 'Rate negotiation prep', 'Personal brand building']
  },
  {
    id: 'skilled_veteran',
    title: 'Skilled Veteran',
    description: 'Translate military experience into high-impact civilian careers',
    icon: Award,
    color: 'red',
    benefits: ['Military skill translation', 'Federal resume guidance', 'Leadership impact framing', 'Corporate culture prep']
  }
];

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Software Engineer",
    company: "Meta",
    content: "ProfileSpike's AI helped me improve my resume score from 67 to 96. I got 5 interviews in two weeks!",
    avatar: "AT",
    persona: "recent_grad"
  },
  {
    name: "Maria Rodriguez",
    role: "Senior Product Manager",
    company: "Spotify",
    content: "The career story builder transformed how I present my 10 years of experience. Finally got that director role!",
    avatar: "MR",
    persona: "professional"
  },
  {
    name: "David Kim",
    role: "Logistics Manager",
    company: "Amazon",
    content: "The Veteran Translation Engine was incredible. It turned my military jargon into language that recruiters understood immediately.",
    avatar: "DK",
    persona: "skilled_veteran"
  },
  {
    name: "Sarah Johnson",
    role: "Freelance Developer",
    company: "Independent",
    content: "My portfolio review score went from 73 to 94. Client inquiries increased by 200% in one month!",
    avatar: "SJ",
    persona: "freelancer"
  }
];

export default function Home() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  const isAuthenticated = !!user; // Simple check based on prop

  useEffect(() => {
    // Rotate messaging every 3 seconds
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (userProfile && userProfile.onboarded) { // Check for completed profile
        navigate(createPageUrl("Dashboard"));
      } else {
        navigate(createPageUrl("Onboarding"));
      }
    } else {
      User.loginWithRedirect(window.location.origin + createPageUrl("Home"));
    }
  };

  const handleTryFreeReview = () => {
    if (isAuthenticated) {
      navigate(createPageUrl("ResumeAnalyzer"));
    } else {
      User.loginWithRedirect(window.location.origin + createPageUrl("ResumeAnalyzer"));
    }
  };

  const currentMessage = rotatingMessages[currentMessageIndex];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/908552440_Screenshot2025-08-13at75643PM.png" alt="ProfileSpike Logo" className="w-10 h-10 rounded-xl" />
              <div>
                <h1 className="text-xl font-bold text-black tracking-tight">ProfileSpike</h1>
                <p className="text-sm text-gray-500">AI + Human Career Coach</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 px-2">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={user?.picture} alt={user?.full_name} />
                          <AvatarFallback>{getInitials(user?.full_name)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Welcome, {user?.first_name || user?.full_name?.split(' ')[0]}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link to={createPageUrl("Dashboard")}>Dashboard</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to={createPageUrl("Profile")}>Account Settings</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => User.logout()} className="text-red-500 focus:bg-red-50 focus:text-red-600">
                        Log Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => User.loginWithRedirect(window.location.origin + createPageUrl("Home"))}>
                    Sign In
                  </Button>
                  <Button onClick={handleGetStarted} className="bg-black hover:bg-gray-900 text-white rounded-xl">
                    Get Started Free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight leading-tight">
              Your AI + Human Career Coach,<br />
              <span className="text-gray-600">Built for Real-World</span><br />
              <span className={`bg-gradient-to-r ${currentMessage.color} bg-clip-text text-transparent`}>
                Transitions
              </span>
            </h2>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                <span className="font-semibold">{currentMessage.persona}:</span> {currentMessage.message}
              </motion.p>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                onClick={handleTryFreeReview}
                className="bg-black hover:bg-gray-900 text-white px-8 py-4 text-lg rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <FileText className="w-5 h-5 mr-2" />
                Try Free Resume Review
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={handleGetStarted}
                variant="outline"
                className="px-8 py-4 text-lg rounded-xl border-2 border-gray-200 hover:border-gray-300"
              >
                <Brain className="w-5 h-5 mr-2" />
                Get Reskilling Plan
              </Button>
              {isAuthenticated && userProfile && userProfile.onboarded && (
                <Button
                  onClick={() => navigate(createPageUrl("Dashboard"))}
                  variant="outline"
                  className="px-8 py-4 text-lg rounded-xl border-2 border-gray-200 hover:border-gray-300"
                >
                  <Target className="w-5 h-5 mr-2" />
                  View Your Dashboard
                </Button>
              )}
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                3 Free AI Analyses
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                Enterprise Security
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Instant Results
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <UserCounter /> Users
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Resume Demo Section */}
      <section className="py-20 bg-white">
        <InteractiveResumeDemo />
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <SuccessStories />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl lg:text-5xl font-bold text-black mb-6">
              Everything You Need to Succeed
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI-powered tools inspired by the best in career development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-black mb-2">{feature.title}</h4>
                        <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                        <Badge variant="outline" className="text-xs font-medium">
                          {feature.preview}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl lg:text-5xl font-bold text-black mb-6">
              Personalized for Your Journey
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI adapts to your unique career stage and goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                  <CardHeader className="text-center p-6">
                    {/* The template string for background color needs to be handled carefully in Tailwind JIT mode.
                        For dynamic classes like bg-${type.color}-500, ensure they are present in full in the source
                        code for Tailwind to pick them up, or use safe list in tailwind.config.js.
                        Here, emerald-500, blue-500, purple-500, orange-500, red-500 should be pre-scanned.
                    */}
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-${type.color}-500 text-white`}>
                      <type.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-lg font-bold text-black mb-2">
                      {type.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {type.description}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-2">
                      {type.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl lg:text-5xl font-bold text-black mb-6">
              Trusted by Professionals Worldwide
            </h3>
            <p className="text-xl text-gray-600">
              Trusted by job seekers of all ages, geographies, industries, and skill levels
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-black text-sm">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">{testimonial.role} at {testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Engine Preview */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-black mb-4">
                Share & Earn Free Reviews
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Refer a friend and you both get 5 free AI analyses. Help your network while growing your credits.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-black mb-2">Share Your Link</h4>
                  <p className="text-sm text-gray-600">Get a unique referral link to share</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-black mb-2">Friend Signs Up</h4>
                  <p className="text-sm text-gray-600">They get 3 free analyses to start</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-black mb-2">You Both Win</h4>
                  <p className="text-sm text-gray-600">5 bonus credits for each of you</p>
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <Button
                onClick={() => navigate(createPageUrl("Profile"))}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-xl"
              >
                <Users className="w-5 h-5 mr-2" />
                Get My Referral Link
              </Button>
            ) : (
              <Button
                onClick={() => User.loginWithRedirect(window.location.origin + createPageUrl("Profile"))}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-xl"
              >
                <Users className="w-5 h-5 mr-2" />
                Join & Start Referring
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Career?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join <UserCounter className="text-white" /> others who've already elevated their career pursuits with AI + Human powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={handleGetStarted}
                className="bg-white hover:bg-gray-100 text-black px-8 py-4 text-lg rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Journey Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={handleTryFreeReview}
                variant="outline"
                className="border-gray-400 text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-xl"
              >
                <FileText className="w-5 h-5 mr-2" />
                Try Free Resume Review
              </Button>
            </div>
            <p className="text-sm text-gray-400">
              3 free AI analyses included • No credit card required • Start in 30 seconds
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
