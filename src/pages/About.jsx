import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Award,
  Linkedin,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import UserCounter from "../components/UserCounter";
import CountryCounter from "../components/CountryCounter";

const milestones = [
  {
    year: "1998",
    title: "Launched Recruiting Firm",
    description: "Achieved million dollar ARR in under 18 months.",
    color: "bg-gradient-to-r from-blue-500 to-blue-600"
  },
  {
    year: "2011",
    title: "Established Boutique Consultancy",
    description: "Providing D&I strategy & support.",
    color: "bg-gradient-to-r from-purple-500 to-purple-600"
  },
  {
    year: "2016",
    title: "Published 'Rip The Resume'",
    description: "Garnering a 4.7/5 stars on Amazon.",
    color: "bg-gradient-to-r from-green-500 to-green-600"
  },
  {
      year: "2018",
      title: "Expanded Media Presence",
      description: "Host on Sirius XM, entered the global speaking arena, and launched a podcast.",
      color: "bg-gradient-to-r from-orange-500 to-orange-600"
  },
  {
      year: "2025",
      title: "Launched ProfileSpike",
      description: "Converted 'Rip The Resume' into an AI + Human powered career coach.",
      color: "bg-gradient-to-r from-red-500 to-red-600"
  }
];

const stats = [
  { number: <UserCounter />, label: "Professionals Helped", icon: Users, color: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-blue-100" },
  { number: "95%", label: "Average ATS Score Improvement", icon: TrendingUp, color: "text-green-600", bg: "bg-gradient-to-br from-green-50 to-green-100" },
  { number: "3.2x", label: "Increase in Interview Callbacks", icon: Target, color: "text-purple-600", bg: "bg-gradient-to-br from-purple-50 to-purple-100" },
  { number: <CountryCounter />, label: "Countries Served", icon: MapPin, color: "text-orange-600", bg: "bg-gradient-to-br from-orange-50 to-orange-100" }
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-black mb-6 tracking-tight">
              About ProfileSpike
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're democratizing access to world-class career coaching through AI, helping professionals 
              at every stage build careers they love.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-black mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Career success shouldn't be limited by budget, geography, or network. We believe everyone 
                deserves access to personalized, expert career guidance that helps position their experience(s).
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                By combining cutting-edge AI + Human touch with proven career development methodologies, we're making 
                professional coaching accessible to millions of job seekers worldwide.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center p-6 ${stat.bg}`}>
                  <stat.icon className={`w-8 h-8 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-3xl font-bold text-black mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-6">Meet the Founder</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Career expert, technologist, and advocate working to transform how people advance professionally
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-700/80"></div>
              </div>
              <CardContent className="p-8 text-center -mt-16 relative">
                <div className="w-32 h-32 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 border-4 border-white shadow-xl">
                  TE
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Torin Ellis</h3>
                <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">Lead Spike, Author, Consultant, Speaker</p>
                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                  Built ProfileSpike to democratize career coaching and help professionals at every stage build careers they love.
                </p>
                <div className="flex justify-center gap-4">
                  <a href="https://linkedin.com/in/torinellis" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110 p-2 rounded-full hover:bg-blue-50">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600">
              From recruiting and consulting to a global AI-powered platform
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 -ml-0.5 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 h-full"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-8 relative"
                >
                  <div className={`flex-1 text-right ${index % 2 !== 0 ? 'order-3' : ''}`}>
                    <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 mb-4 hover:from-gray-200 hover:to-gray-300 transition-all">{milestone.year}</Badge>
                    <h3 className="text-2xl font-bold text-black mb-3">{milestone.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </div>
                  <div className="flex-shrink-0 z-10 order-2">
                    <div className={`w-16 h-16 ${milestone.color} rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300`}>
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 order-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-32"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full translate-y-40"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-6">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4">Accessibility</h3>
                <p className="text-gray-600 leading-relaxed">
                  Career coaching should be available to everyone, regardless of background or budget.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4">Impact</h3>
                <p className="text-gray-600 leading-relaxed">
                  We measure success by the career transformations and lives we help improve.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4">Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  We continuously improve our AI and platform to deliver world-class experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Have questions about ProfileSpike? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = 'mailto:support@profilespike.com'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}