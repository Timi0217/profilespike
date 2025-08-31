import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/api/functions';

export default function TestStripe() {
  const [result, setResult] = useState('');

  const testFunction = async () => {
    try {
      const response = await createCheckoutSession({
        priceId: 'price_1RvQjcGors2O0tZe4RAhW2IK',
        planName: 'Test Plan'
      });
      setResult('Function exists! Response: ' + JSON.stringify(response.data));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={testFunction}>Test Stripe Function</Button>
      <div className="mt-4 p-2 bg-gray-100 rounded">
        {result}
      </div>
    </div>
  );
}