import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-black">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          
          <div className="flex gap-3">
            <Link to={createPageUrl('Pricing')} className="flex-1">
              <Button variant="outline" className="w-full">
                View Pricing
              </Button>
            </Link>
            <Link to={createPageUrl('Dashboard')} className="flex-1">
              <Button className="bg-black hover:bg-gray-900 text-white w-full">
                Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}