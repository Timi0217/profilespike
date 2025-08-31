import React, { useState, useEffect } from 'react';
import { Article } from '@/api/entities';
import { User } from '@/api/entities';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileQuestion, Search, RefreshCw, Sparkles, BookOpen, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '@/components/help/CodeBlock';

const categoryNames = {
  'getting-started': 'Getting Started',
  'resume-analysis': 'Resume Analysis',
  'linkedin-optimization': 'LinkedIn Optimization',
  'portfolio-review': 'Portfolio Review',
  'interview-prep': 'Interview Prep',
  'veteran-tools': 'Veteran Tools',
  'billing': 'Billing',
  'troubleshooting': 'Troubleshooting',
  'recruiters-rules': 'Recruiters Rules'
};

const categoryColors = {
  'getting-started': 'from-green-400 to-green-600',
  'resume-analysis': 'from-blue-400 to-blue-600',
  'linkedin-optimization': 'from-purple-400 to-purple-600',
  'portfolio-review': 'from-orange-400 to-orange-600',
  'interview-prep': 'from-pink-400 to-pink-600',
  'veteran-tools': 'from-red-400 to-red-600',
  'billing': 'from-yellow-400 to-yellow-600',
  'troubleshooting': 'from-gray-400 to-gray-600',
  'recruiters-rules': 'from-indigo-400 to-indigo-600'
};

export default function HelpCenter() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedArticles, setGroupedArticles] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      // Check authentication status without throwing error for anonymous users
      try {
        await User.me();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        // This is fine - anonymous users should still be able to read articles
      }

      // Load articles - this should work for both authenticated and anonymous users
      const fetchedArticles = await Article.filter({ is_published: true });
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Failed to load articles:", error);
      // Show a user-friendly error message
      setArticles([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = filtered.reduce((acc, article) => {
      (acc[article.category] = acc[article.category] || []).push(article);
      return acc;
    }, {});
    setGroupedArticles(grouped);
  }, [searchTerm, articles]);

  if (isLoading && articles.length === 0) {
    return <div className="p-8"><LoadingSpinner text="Loading Help Center..." /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full translate-y-16 -translate-x-16"></div>
      
      <div className="max-w-4xl mx-auto p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileQuestion className="w-10 h-10 text-white" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-black tracking-tight">Help Center</h1>
            <Button onClick={loadArticles} variant="outline" size="icon" className="rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110 shadow-md">
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-lg text-gray-600 mt-2">Find answers and guidance on how to use ProfileSpike.</p>
          {!isAuthenticated && (
            <p className="text-sm text-gray-500 mt-2">Browse our help articles or <button onClick={() => User.loginWithRedirect(window.location.href)} className="text-blue-600 hover:underline">sign in</button> to access your account.</p>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-6 rounded-xl border-gray-200 text-lg shadow-sm bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:shadow-md"
          />
        </div>

        {/* Articles */}
        {Object.keys(groupedArticles).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedArticles).map(([category, articlesInCategory]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 bg-gradient-to-r ${categoryColors[category]} rounded-xl flex items-center justify-center shadow-md`}>
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-black">{categoryNames[category] || category}</h2>
                </div>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {articlesInCategory.map(article => (
                    <AccordionItem key={article.id} value={article.id} className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:shadow-xl">
                      <AccordionTrigger className="p-6 text-lg font-semibold text-left hover:no-underline group">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 bg-gradient-to-r ${categoryColors[category]} rounded-full group-hover:scale-125 transition-transform duration-200 shadow-sm`}></div>
                          {article.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-6 pt-0">
                        <div className="prose max-w-none prose-p:text-gray-600 prose-headings:text-black prose-strong:text-gray-800">
                          <ReactMarkdown components={{ code: CodeBlock }}>
                            {article.content}
                          </ReactMarkdown>
                        </div>
                        {article.author && article.source_url && (
                          <div className="mt-6 p-4 bg-gray-50 rounded-xl border-l-4 border-blue-500">
                            <p className="text-sm text-gray-600">
                              <strong>Original article by {article.author}</strong>
                              <br />
                              <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Read the full article here →
                              </a>
                            </p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                {articles.length === 0 ? "No articles available at the moment." : "No articles found matching your search."}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {articles.length === 0 ? "Please check back later or contact support." : "Try adjusting your search terms or browse all categories."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}