'use client';

import React, { useState, useEffect } from 'react';

interface EmailData {
  email: string;
  source: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

export default function DeveloperPage() {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load emails from localStorage (client-side storage)
    const loadEmails = () => {
      const storedEmails = localStorage.getItem('procurvv-emails');
      if (storedEmails) {
        try {
          setEmails(JSON.parse(storedEmails));
        } catch (error) {
          console.error('Error parsing stored emails:', error);
        }
      }
      setIsLoading(false);
    };

    loadEmails();
  }, []);

  const clearEmails = () => {
    localStorage.removeItem('procurvv-emails');
    setEmails([]);
  };

  const exportEmails = () => {
    const csvContent = [
      'Email,Source,Timestamp,User Agent,IP',
      ...emails.map(email => 
        `"${email.email}","${email.source}","${email.timestamp}","${email.userAgent || 'N/A'}","${email.ip || 'N/A'}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `procurvv-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
              <p className="text-gray-600 mt-2">Collected user emails for Procurv Reverse Auction</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportEmails}
                disabled={emails.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export CSV
              </button>
              <button
                onClick={clearEmails}
                disabled={emails.length === 0}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Total Emails: {emails.length}
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Landing Page: {emails.filter(e => e.source === 'landing-page').length}
              </div>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                Login Page: {emails.filter(e => e.source === 'login-page').length}
              </div>
            </div>
          </div>

          {emails.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No emails collected yet</h3>
              <p className="text-gray-600">Emails will appear here when users access the chat interface</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emails.map((email, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {email.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          email.source === 'landing-page' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {email.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(email.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {email.userAgent || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {email.ip || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
