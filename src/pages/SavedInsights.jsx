
import React, { useState, useEffect, useRef } from 'react';
import { Analysis } from '@/api/entities';
import { SavedInsight } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Bookmark, FileText, Linkedin, Briefcase, MessageSquare, Award, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ReactMarkdown from 'react-markdown';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/components/AuthContext';


const InsightIcon = ({ type, status }) => {
  const iconProps = { className: "w-5 h-5 text-gray-600" };
  if (status === 'processing') {
    return <RefreshCw {...iconProps} className="animate-spin text-blue-500" />;
  }
   if (status === 'failed') {
    return <AlertCircle {...iconProps} className="text-red-500" />;
  }
  switch (type) {
    case 'resume': return <FileText {...iconProps} />;
    case 'linkedin': return <Linkedin {...iconProps} />;
    case 'portfolio': return <Briefcase {...iconProps} />;
    case 'interview': return <MessageSquare {...iconProps} />;
    case 'veteran_translation': return <Award {...iconProps} />;
    default: return <Bookmark {...iconProps} />;
  }
};

const InsightDetails = ({ insight }) => {
    if (!insight.content) return <p>No details available.</p>;

    const content = typeof insight.content === 'string' ? JSON.parse(insight.content) : insight.content;

    if(insight.insight_type === 'veteran_translation') {
        const translation = content.translation;
        return (
             <div className="prose max-w-none">
                <h3 className="text-lg font-bold">Original Input</h3>
                <p>{content.input}</p>
                <hr/>
                <h3 className="text-lg font-bold mt-4">Civilian Title: {translation.civilian_title}</h3>
                <ReactMarkdown>{translation.description_rewrite}</ReactMarkdown>
                <h4>Resume Bullet Points</h4>
                <ul>
                    {translation.resume_bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
                </ul>
            </div>
        )
    }
    
    // For resume, linkedin, portfolio
    const feedback = content.ai_feedback ? (typeof content.ai_feedback === 'string' ? JSON.parse(content.ai_feedback) : content.ai_feedback) : {};

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-bold">Strengths</h3>
                <ul className="list-disc list-inside">
                   {content.strengths?.map((item, i) => <li key={i}>{item.title}: {item.description}</li>)}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-bold">Improvements</h3>
                <ul className="list-disc list-inside">
                   {content.improvements?.map((item, i) => <li key={i}>{item.title}: {item.description}</li>)}
                </ul>
            </div>
             <div>
                <h3 className="text-lg font-bold">Detailed Feedback</h3>
                {Object.entries(feedback).map(([key, value]) => (
                    <div key={key} className="mt-2">
                        <h4 className="font-semibold capitalize">{key.replace(/_/g, ' ')}</h4>
                        <p className="text-sm text-gray-600">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'completed': return 'text-green-700 border-green-200 bg-green-50';
    case 'processing': return 'text-blue-700 border-blue-200 bg-blue-50';
    case 'failed': return 'text-red-700 border-red-200 bg-red-50';
    default: return 'text-gray-700 border-gray-200 bg-gray-50';
  }
};

export default function SavedInsights() {
  const { user } = useAuth();
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const latestInsightsRef = useRef([]); // Ref to hold the latest insights state for polling

  // Keep the ref updated with the latest insights state
  useEffect(() => {
    latestInsightsRef.current = insights;
  }, [insights]);

  const fetchData = async () => {
      if (user) {
        try {
          // Fetch both saved insights and all analyses (including inactive for historical data)
          const saved = await SavedInsight.filter({ created_by: user.email }, '-created_date');
          const analyses = await Analysis.filter({ created_by: user.email }, '-created_date');
          
          // Combine and create a unified list
          const combined = analyses.map(a => {
              // Check if this analysis has a saved insight record
              const savedVersion = saved.find(s => s.content?.id === a.id);
              return savedVersion 
                ? { ...savedVersion, ...a, insight_type: a.analysis_type, title: savedVersion.title } 
                : { ...a, title: `${a.analysis_type.charAt(0).toUpperCase() + a.analysis_type.slice(1)} Analysis`, insight_type: a.analysis_type, is_temp: true }
          });
          
          // Add saved insights that might not have an analysis record (e.g. veteran tool or manually saved)
          saved.forEach(s => {
              if(!s.content?.id && !combined.find(c => c.id === s.id)){
                  combined.push(s);
              }
          })

          combined.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

          setInsights(combined);
        } catch (error) {
          console.error("Failed to load insights:", error);
        }
      }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData().finally(() => setIsLoading(false));

    // Set up polling to refresh data every 15 seconds if there are processing items
    const interval = setInterval(() => {
        if (latestInsightsRef.current.some(i => i.status === 'processing')) {
            fetchData();
        }
    }, 15000);

    return () => clearInterval(interval); // Clear interval on component unmount

  }, [user]); // Depend only on user for initial fetch and interval setup

  const handleRefresh = async () => {
      setIsRefreshing(true);
      await fetchData();
      setIsRefreshing(false);
  }

  if (isLoading) {
    return <div className="p-8"><LoadingSpinner text="Loading Your Insights..." /></div>;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                    <Bookmark className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-black">Insights & Analyses</h1>
                    <p className="text-gray-600">All your analyses and saved items in one place.</p>
                </div>
            </div>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
            </Button>
        </div>

        {insights.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
            <Bookmark className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">No insights saved yet</h2>
            <p className="text-gray-500 mb-6">Run your first analysis to see your results here.</p>
            <Button asChild className="bg-black hover:bg-gray-900 text-white rounded-xl">
              <a href={createPageUrl("ResumeAnalyzer")}>Analyze Your Resume</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight) => (
              <Dialog key={insight.id}>
                <DialogTrigger asChild>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                    <Card className={`h-full cursor-pointer hover:shadow-lg transition-shadow ${insight.status === 'processing' ? 'opacity-60' : ''}`}>
                        <CardHeader>
                        <div className="flex justify-between items-start">
                            <InsightIcon type={insight.insight_type} status={insight.status} />
                            {insight.score && <Badge variant={insight.score > 80 ? 'default' : 'secondary'}>{insight.score}/100</Badge>}
                        </div>
                        <CardTitle className="text-lg mt-4">{insight.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p className="text-sm text-gray-500 capitalize">{insight.insight_type.replace(/_/g, ' ')}</p>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-400">{new Date(insight.created_date).toLocaleDateString()}</p>
                            <Badge variant="outline" className={`capitalize ${getStatusBadgeClass(insight.status)}`}>
                              {insight.status || 'saved'}
                            </Badge>
                        </div>
                        </CardContent>
                    </Card>
                    </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{insight.title}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 max-h-[70vh] overflow-y-auto">
                       {insight.status === 'completed' || !insight.status ? <InsightDetails insight={insight} /> : <div className="text-center py-10"><LoadingSpinner text={`Analysis is ${insight.status}...`} /></div>}
                    </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
