import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { User } from '@/api/entities';
import { UserProfile } from '@/api/entities';

export default function StripeCheckout({ plan, onSuccess, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await User.me();
      
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user.id,
          userEmail: user.email,
          planName: plan.name
        }),
      });

      const session = await response.json();

      if (session.error) {
        setError(session.error);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = session.url;
      
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to start checkout process. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Complete Your Purchase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="text-2xl font-bold text-black">
            {plan.discountedPrice || plan.price}
            {plan.period !== 'forever' && `/${plan.period}`}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            className="flex-1 bg-black hover:bg-gray-900 text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Continue to Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}