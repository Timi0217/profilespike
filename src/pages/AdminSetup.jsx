import React from 'react';
import AdminSetup from '@/components/AdminSetup';

export default function AdminSetupPage({ user }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AdminSetup user={user} />
    </div>
  );
}