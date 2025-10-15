'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ChatInterface from '@/components/ChatInterface';

function ChatPageInner() {
  const searchParams = useSearchParams();
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailFromParams = searchParams.get('email');
    const emailFromStorage = localStorage.getItem('procurv-user-email') || localStorage.getItem('procurvv-user-email');
    
    const email = emailFromParams || emailFromStorage || '';
    
    if (email) {
      setUserEmail(email);
      // Store email for developer reference
      localStorage.setItem('procurv-user-email', email);
      
      // Log email for developer reference (in production, this would go to your database)
      console.log('New user accessed chat:', { email, timestamp: new Date().toISOString() });
    }
    
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your chat interface...</p>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Required</h1>
          <p className="text-gray-600 mb-6">Please provide your email to access the chat interface.</p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return <ChatInterface userEmail={userEmail} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-600">Loading…</p></div>}>
      <ChatPageInner />
    </Suspense>
  );
}
