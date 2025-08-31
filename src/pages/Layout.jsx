

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User as UserIcon, BarChart3, FileText, Linkedin, Briefcase, MessageSquare, LayoutDashboard, CreditCard, Info, Award, Bookmark, ShieldCheck, DollarSign, ChevronRight, ChevronsUpDown, LogIn, TrendingUp, LogOut, ShieldAlert } from "lucide-react";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthProvider, useAuth } from "../components/AuthContext";
import SessionGuard from "../components/SessionGuard";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { User } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";

const mainNavItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: LayoutDashboard,
  },
  {
    title: "Help Center",
    url: createPageUrl("HelpCenter"),
    icon: Info,
  },
  {
    title: "Pricing",
    url: createPageUrl("Pricing"),
    icon: CreditCard,
  },
  {
    title: "About",
    url: createPageUrl("About"),
    icon: Info,
  }
];

const featureNavItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "AI Resume Analyzer",
    url: createPageUrl("ResumeAnalyzer"),
    icon: FileText,
  },
  {
    title: "AI LinkedIn Optimizer",
    url: createPageUrl("LinkedInOptimizer"),
    icon: Linkedin,
  },
  {
    title: "AI Portfolio Review",
    url: createPageUrl("PortfolioReview"),
    icon: Briefcase,
  },
  {
    title: "AI Interview Prep",
    url: createPageUrl("InterviewPrep"),
    icon: MessageSquare,
  },
  {
    title: "AI Veteran Translator",
    url: createPageUrl("VeteranTranslator"),
    icon: Award,
  },
  {
    title: "Career Mapping Tool",
    url: createPageUrl("CareerMapping"),
    icon: TrendingUp,
  },
  {
    title: "Compensation Analyzer",
    url: createPageUrl("CompensationAnalyzer"),
    icon: DollarSign,
  },
  {
    title: "Saved Insights",
    url: createPageUrl("SavedInsights"),
    icon: Bookmark,
  }
];

// --- Sub-components for different states ---

const MinimalLayout = ({ children }) => (
  <main className="flex-1 overflow-auto bg-white">{children}</main>
);

const LoginWallView = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Card className="max-w-md mx-auto shadow-xl border-gray-100">
      <CardContent className="p-8 text-center">
        <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/908552440_Screenshot2025-08-13at75643PM.png" alt="ProfileSpike Logo" className="w-16 h-16 rounded-2xl mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-black mb-4">Sign In Required</h2>
        <p className="text-gray-600 mb-6">
          You need to be signed in to access this page.
        </p>
        <Button
          onClick={() => User.loginWithRedirect(window.location.href)}
          className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-xl"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In to Continue
        </Button>
      </CardContent>
    </Card>
  </div>
);

const InactiveAccountView = ({ onLogout }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <Card className="max-w-md mx-auto shadow-xl border-gray-100">
      <CardContent className="p-8 text-center">
        <ShieldAlert className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-black mb-4">Account Inactive</h2>
        <p className="text-gray-600 mb-6">
          Your account has been deactivated by an administrator. Please contact support for assistance.
        </p>
        <Button
          onClick={onLogout}
          className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </CardContent>
    </Card>
  </div>
);

function LayoutContent({ children, currentPageName }) {
  const { user, userProfile, isLoading, refetch } = useAuth();
  const navigate = useNavigate();
  // No need for `location` here directly, it's used within `SessionGuard` if needed for onboarding checks.
  // `isFeaturesOpen` state moved back to `AppLayout` as it's a specific UI state for that component.

  // Pages that are always public, regardless of auth state.
  const publicPages = [
    "Home",
    "About", 
    "HelpCenter",
    "Pricing",
    "Onboarding",
    "PrivacyPolicy",
    "TermsOfService",
    "PaymentSuccess",
    "PaymentCancel"
  ];

  // While the session is being resolved, show a global loading spinner.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Initializing your session..." />
      </div>
    );
  }

  // If the user's account is inactive, show a specific message.
  if (user && user.status === 'inactive') {
    return <InactiveAccountView onLogout={async () => { await User.logout(); refetch(); navigate(createPageUrl("Home")); }} />;
  }

  // If the user tries to access a protected page while not authenticated, show a login prompt.
  if (!publicPages.includes(currentPageName) && !user) {
    return <LoginWallView />;
  }
  
  // For the Onboarding page, render only the page content without the full sidebar layout.
  if (currentPageName === 'Onboarding') {
    return <MinimalLayout>{children}</MinimalLayout>;
  }

  // For authenticated users accessing protected pages, wrap in the imported SessionGuard.
  // The SessionGuard component is responsible for the user profile/onboarding checks and redirects.
  if (user && !publicPages.includes(currentPageName)) {
    return (
      <SessionGuard currentPageName={currentPageName}>
        <AppLayout user={user} userProfile={userProfile} onLogout={async () => { await User.logout(); refetch(); }} currentPageName={currentPageName}>
          {children}
        </AppLayout>
      </SessionGuard>
    );
  }

  // For public pages, render directly with AppLayout (whether authenticated or not).
  return (
    <AppLayout user={user} userProfile={userProfile} onLogout={async () => { await User.logout(); refetch(); }} currentPageName={currentPageName}>
      {children}
    </AppLayout>
  );
}

// --- The Main Application Layout ---

function AppLayout({ children, user, userProfile, onLogout, currentPageName }) {
  const location = useLocation();
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(true); // This state belongs here.

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`;
    return name[0];
  };

  return (
    <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <Sidebar className="border-r border-gray-100 flex flex-col">
            <SidebarHeader className="border-b border-gray-50 p-6">
              <Link to={createPageUrl("Home")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/908552440_Screenshot2025-08-13at75643PM.png" alt="ProfileSpike Logo" className="w-10 h-10 rounded-xl" />
                <div>
                  <h2 className="font-bold text-xl tracking-tight text-black">ProfileSpike</h2>
                  <p className="text-sm text-gray-500 font-medium">AI Career Coach</p>
                </div>
              </Link>
            </SidebarHeader>
             <SidebarContent className="p-4 flex-grow">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {mainNavItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-gray-50 transition-all duration-200 rounded-xl px-4 py-3 ${
                            location.pathname === item.url ? 'bg-black text-white hover:bg-gray-900' : 'text-gray-700'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-4">
                <Collapsible open={isFeaturesOpen} onOpenChange={setIsFeaturesOpen}>
                  <CollapsibleTrigger className="w-full">
                     <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 py-3 hover:bg-gray-50 rounded-xl">
                        <span>AI Features</span>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-90' : ''}`} />
                     </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-1 mt-2">
                        {featureNavItems.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              className={`hover:bg-gray-50 transition-all duration-200 rounded-xl px-4 py-3 ${
                                location.pathname === item.url ? 'bg-black text-white hover:bg-gray-900' : 'text-gray-700'
                              }`}
                            >
                              <Link to={item.url} className="flex items-center gap-3">
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroup>

              {user?.role === 'admin' && (
                <SidebarGroup className="mt-4">
                   <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 py-3">
                    Admin
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                        <SidebarMenuItem>
                           <SidebarMenuButton
                            asChild
                            className={`hover:bg-gray-50 transition-all duration-200 rounded-xl px-4 py-3 ${
                              location.pathname === createPageUrl("AdminDashboard") ? 'bg-black text-white hover:bg-gray-900' : 'text-gray-700'
                            }`}
                          >
                             <Link to={createPageUrl("AdminDashboard")} className="flex items-center gap-3">
                               <ShieldCheck className="w-5 h-5" />
                               <span className="font-medium">Admin Dashboard</span>
                             </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </SidebarContent>
            <SidebarFooter className="border-t border-gray-50 p-4 mt-auto">
              {user ? (
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start items-center text-left h-auto py-2">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src={user.picture} alt={user.full_name} />
                        <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start truncate">
                        <span className="font-semibold text-sm truncate">{user.full_name}</span>
                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link to={createPageUrl("Profile")}>Account Settings</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to={createPageUrl("Dashboard")}>My Dashboard</Link></DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild><Link to={createPageUrl("AdminDashboard")}>Admin Panel</Link></DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild><Link to={createPageUrl("HelpCenter")}>Help Center</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:bg-red-50 focus:text-red-600">
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                 <Button onClick={() => User.loginWithRedirect(window.location.origin + createPageUrl("Home"))} className="w-full bg-black text-white hover:bg-gray-800">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile header */}
            <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between md:hidden">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
                <Link to={createPageUrl("Home")} className="flex items-center gap-2">
                  <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/908552440_Screenshot2025-08-13at75643PM.png" alt="ProfileSpike Logo" className="w-8 h-8 rounded-lg" />
                  <h1 className="text-lg font-bold tracking-tight">ProfileSpike</h1>
                </Link>
              </div>
               <div>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="w-9 h-9 cursor-pointer">
                        <AvatarImage src={user.picture} alt={user.full_name} />
                        <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{user.full_name}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link to={createPageUrl("Dashboard")}>My Dashboard</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to={createPageUrl("Profile")}>Account Settings</Link></DropdownMenuItem>
                      {user?.role === 'admin' && (
                        <DropdownMenuItem asChild><Link to={createPageUrl("AdminDashboard")}>Admin Panel</Link></DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:bg-red-50 focus:text-red-600">
                        Log Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button size="sm" onClick={() => User.loginWithRedirect(window.location.origin + createPageUrl("Home"))}>Sign In</Button>
                )}
              </div>
            </header>
            
            <div className="flex-1 overflow-auto bg-white">
              {children}
            </div>
            <Toaster />
          </main>
        </div>
      </SidebarProvider>
  );
}


export default function Layout({ children, currentPageName }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LayoutContent currentPageName={currentPageName}>
          {children}
        </LayoutContent>
      </AuthProvider>
    </ErrorBoundary>
  );
}

