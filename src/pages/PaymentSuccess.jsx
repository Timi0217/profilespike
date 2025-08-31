import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PaymentSuccess() {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    // Show spinner for a moment to allow webhook processing time
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showSpinner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <LoadingSpinner text="Finalizing your subscription..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <Card className="max-w-lg text-center shadow-lg border-0">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-black">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 text-lg">
            Welcome to Premium! Your account has been upgraded. You now have unlimited access to all our AI-powered tools.
          </p>
          <p className="text-sm text-gray-500">
            It might take a minute for the changes to reflect in your dashboard.
          </p>
          <Button asChild className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-xl text-lg">
            <Link to={createPageUrl("Dashboard")}>
              <Sparkles className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}