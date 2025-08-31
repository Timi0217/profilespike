import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  TrendingUp, 
  Users, 
  Award,
  ChevronLeft,
  ChevronRight,
  Quote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const successStories = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Product Manager",
    company: "Microsoft",
    previousRole: "Product Coordinator",
    industry: "Technology",
    image: "SC",
    story: "ProfileSpike's AI completely transformed my resume. I went from getting zero responses to landing interviews at 5 major tech companies in just 2 weeks.",
    metrics: {
      scoreImprovement: "67 → 96",
      callbackIncrease: "400%",
      timeToHire: "3 weeks",
      salaryIncrease: "$45k"
    },
    testimonial: "The veteran translation tool was a game-changer. It helped me articulate my leadership experience in terms that civilian recruiters immediately understood.",
    toolsUsed: ["Resume Analyzer", "LinkedIn Optimizer", "Interview Prep"]
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Logistics Manager",
    company: "Amazon",
    previousRole: "Army Staff Sergeant",
    industry: "Supply Chain",
    image: "MR",
    story: "As a veteran transitioning to civilian work, I struggled to translate my military experience. ProfileSpike's veteran tool was exactly what I needed.",
    metrics: {
      scoreImprovement: "45 → 92",
      callbackIncrease: "350%",
      timeToHire: "4 weeks",
      salaryIncrease: "$38k"
    },
    testimonial: "The AI didn't just fix my resume - it taught me how to present my experience as valuable business skills. Now I'm managing supply chains for one of the world's largest companies.",
    toolsUsed: ["Veteran Translator", "Resume Analyzer", "Portfolio Review"]
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "UX Designer",
    company: "Spotify",
    previousRole: "Recent Graduate",
    industry: "Design",
    image: "EW",
    story: "Fresh out of college with no 'real' experience, I was getting nowhere. ProfileSpike helped me showcase my projects and skills in a way that impressed hiring managers.",
    metrics: {
      scoreImprovement: "52 → 89",
      callbackIncrease: "280%",
      timeToHire: "5 weeks",
      salaryIncrease: "$25k"
    },
    testimonial: "The portfolio review feature was incredible. It showed me how to present my student projects as legitimate professional work. Three companies made offers!",
    toolsUsed: ["Resume Analyzer", "Portfolio Review", "Interview Prep"]
  },
  {
    id: 4,
    name: "David Kim",
    role: "Full Stack Developer",
    company: "Shopify",
    previousRole: "Freelancer",
    industry: "Technology",
    image: "DK",
    story: "After years of freelancing, I wanted to join a tech company but my resume was a mess of random projects. ProfileSpike helped me create a cohesive narrative.",
    metrics: {
      scoreImprovement: "61 → 94",
      callbackIncrease: "320%",
      timeToHire: "2 weeks",
      salaryIncrease: "$42k"
    },
    testimonial: "I went from scattered freelance work to a senior developer role at Shopify. The AI helped me frame my diverse experience as exactly what they were looking for.",
    toolsUsed: ["Resume Analyzer", "LinkedIn Optimizer", "Portfolio Review"]
  },
  {
    id: 5,
    name: "Jennifer Thompson",
    role: "Marketing Director",
    company: "HubSpot",
    previousRole: "Stay-at-home Mom",
    industry: "Marketing",
    image: "JT",
    story: "Returning to work after 6 years was terrifying. ProfileSpike helped me highlight transferable skills and address the employment gap professionally.",
    metrics: {
      scoreImprovement: "38 → 91",
      callbackIncrease: "450%",
      timeToHire: "6 weeks",
      salaryIncrease: "$35k"
    },
    testimonial: "The career gap wasn't a weakness anymore - ProfileSpike helped me present those years as valuable life experience that made me a stronger leader.",
    toolsUsed: ["Resume Analyzer", "Interview Prep", "LinkedIn Optimizer"]
  }
];

export default function SuccessStories() {
  const [currentStory, setCurrentStory] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  React.useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % successStories.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % successStories.length);
    setIsAutoPlaying(false);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + successStories.length) % successStories.length);
    setIsAutoPlaying(false);
  };

  const story = successStories[currentStory];

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-black mb-4">
          Real Success Stories
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          See how ProfileSpike helped professionals land their dream jobs
        </p>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  {/* Story Content */}
                  <div className="p-8 lg:p-12 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {story.image}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-black">{story.name}</h3>
                        <p className="text-gray-600">{story.role} at {story.company}</p>
                        <Badge className="mt-1 bg-green-100 text-green-800">
                          From {story.previousRole}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-6">
                      <Quote className="w-8 h-8 text-blue-500 mb-4" />
                      <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        {story.story}
                      </p>
                      <p className="text-gray-600 italic">
                        "{story.testimonial}"
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {story.toolsUsed.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-blue-700 border-blue-200">
                          {tool}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="ml-2 text-gray-600 text-sm">5.0 rating</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="p-8 lg:p-12 bg-white">
                    <h4 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Results Achieved
                    </h4>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {story.metrics.scoreImprovement}
                        </div>
                        <div className="text-sm text-gray-600">ATS Score</div>
                      </div>

                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {story.metrics.callbackIncrease}
                        </div>
                        <div className="text-sm text-gray-600">More Callbacks</div>
                      </div>

                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {story.metrics.timeToHire}
                        </div>
                        <div className="text-sm text-gray-600">Time to Hire</div>
                      </div>

                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                          {story.metrics.salaryIncrease}
                        </div>
                        <div className="text-sm text-gray-600">Salary Increase</div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Success Timeline</span>
                      </div>
                      <div className="text-sm text-green-700">
                        Landed dream job in just {story.metrics.timeToHire} using ProfileSpike's AI tools
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStory}
            className="rounded-full w-12 h-12"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentStory(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStory ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={nextStory}
            className="rounded-full w-12 h-12"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center mt-8">
          <Button className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-xl">
            <Users className="w-4 h-4 mr-2" />
            Start Your Success Story
          </Button>
        </div>
      </div>
    </div>
  );
}