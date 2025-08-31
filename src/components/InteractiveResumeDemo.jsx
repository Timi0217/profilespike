
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  TrendingUp,
  Eye,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Target // Added Target icon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const resumeVersions = {
  bad: {
    name: "Before: Generic Resume",
    score: 34,
    issues: [
      "Poor Applicant Tracking System (ATS) formatting",
      "Missing industry keywords", 
      "Weak action verbs",
      "No quantified achievements",
      "Generic objective statement"
    ],
    content: `OBJECTIVE: Looking for a software engineering position to grow my career.

EXPERIENCE:
ABC Company - Developer (2021-2023)
- Worked on various projects
- Helped with coding tasks
- Participated in team meetings
- Fixed bugs when needed

SKILLS: JavaScript, Python, HTML, CSS`
  },
  good: {
    name: "After: AI-Optimized Resume",
    score: 94,
    improvements: [
      "Applicant Tracking System (ATS)-friendly formatting",
      "Industry-specific keywords",
      "Strong action verbs", 
      "Quantified achievements",
      "Targeted professional summary"
    ],
    content: `PROFESSIONAL SUMMARY: Results-driven Software Engineer with 2+ years of experience developing scalable web applications. Increased application performance by 40% and reduced bug reports by 60% through implementation of robust testing frameworks.

PROFESSIONAL EXPERIENCE:
ABC Company - Software Engineer (2021-2023)
• Architected and developed 5+ full-stack web applications using React and Node.js, serving 10,000+ daily active users
• Optimized database queries and API endpoints, reducing average response time by 45%
• Implemented comprehensive testing suite with 90% code coverage, decreasing production bugs by 60%
• Collaborated with cross-functional teams of 8+ members to deliver projects 15% ahead of schedule

TECHNICAL SKILLS: JavaScript (ES6+), React.js, Node.js, Python, PostgreSQL, AWS, Docker, Git`
  }
};

export default function InteractiveResumeDemo() {
  const [activeVersion, setActiveVersion] = useState('bad');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const currentResume = resumeVersions[activeVersion];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setActiveVersion(activeVersion === 'bad' ? 'good' : 'bad');
    }, 2500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <Badge className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          Interactive Demo
        </Badge>
        <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
          See the Magic in Action
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Watch how our AI transforms an ordinary resume into an Applicant Tracking System (ATS)-optimized powerhouse that gets results
        </p>
      </div>

      {/* Main Demo Area */}
      <div className="relative">
        {/* Resume Display */}
        <Card className="border-0 shadow-2xl overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex items-center justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-${activeVersion}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3"
                >
                  <FileText className="w-6 h-6 text-gray-600" />
                  <CardTitle className="text-xl font-bold text-black">
                    {currentResume.name}
                  </CardTitle>
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 overflow-hidden bg-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVersion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="p-8 h-full overflow-y-auto"
                >
                  <pre className="whitespace-pre-line text-sm text-gray-700 font-mono leading-relaxed">
                    {currentResume.content}
                  </pre>
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results - Now always 2 cards side by side */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Issues/Improvements - Score always appears in header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`feedback-${activeVersion}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className={`border-0 shadow-lg ${
                activeVersion === 'bad' 
                  ? 'bg-gradient-to-br from-red-50 to-orange-50' 
                  : 'bg-gradient-to-br from-green-50 to-emerald-50'
              }`}>
                <CardHeader>
                  <CardTitle className={`flex items-center justify-between ${
                    activeVersion === 'bad' ? 'text-red-700' : 'text-green-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      {activeVersion === 'bad' ? (
                        <>
                          <AlertTriangle className="w-5 h-5" />
                          Issues Found
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Improvements Made
                        </>
                      )}
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`score-${activeVersion}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className={`text-2xl font-bold ${getScoreColor(currentResume.score)}`}
                      >
                        {currentResume.score}
                      </motion.div>
                    </AnimatePresence>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(activeVersion === 'bad' ? currentResume.issues : currentResume.improvements).map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activeVersion === 'bad' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {activeVersion === 'bad' ? (
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          activeVersion === 'bad' ? 'text-red-700' : 'text-green-700'
                        }`}>
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Right side card - Status for bad version, Expected Results for good version */}
          <AnimatePresence mode="wait">
            {activeVersion === 'bad' ? (
              <motion.div
                key="status-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-700">
                      <Target className="w-5 h-5" />
                      Current Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <Badge className="bg-red-500 text-white px-6 py-3 text-lg">
                      Needs Work
                    </Badge>
                    <p className="text-gray-600 mt-4">
                      Your resume needs optimization to pass Applicant Tracking Systems.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="results-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <TrendingUp className="w-5 h-5" />
                      Expected Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white rounded-xl">
                        <div className="text-2xl font-bold text-blue-600 mb-1">3.2x</div>
                        <div className="text-xs text-blue-700">More Callbacks</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl">
                        <div className="text-2xl font-bold text-blue-600 mb-1">95%</div>
                        <div className="text-xs text-blue-700">ATS Pass Rate</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl">
                        <div className="text-2xl font-bold text-blue-600 mb-1">2.5x</div>
                        <div className="text-xs text-blue-700">Interview Rate</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl">
                        <div className="text-2xl font-bold text-blue-600 mb-1">$15k</div>
                        <div className="text-xs text-blue-700">Avg Salary Boost</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="text-center">
          {activeVersion === 'bad' ? (
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-3" />
                  Optimize with AI Magic
                  <Sparkles className="w-5 h-5 ml-3" />
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleAnalyze}
                  variant="outline"
                  className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Show Original
                </Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg">
                  <Eye className="w-4 h-4 mr-2" />
                  Try Your Resume
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Ready to get similar results? Upload your resume for a free analysis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
