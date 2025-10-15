'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [chatEmail, setChatEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
  };

  const handleChatEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatEmail.trim()) {
      try {
        // Store email for developer reference
        localStorage.setItem('procurvv-user-email', chatEmail.trim());
        
        // Send email to API for developer reference
        await fetch('/api/store-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: chatEmail.trim(),
            source: 'login-page'
          }),
        });

        // Also store in localStorage for developer dashboard
        const emailData = {
          email: chatEmail.trim(),
          source: 'login-page',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ip: 'client-side'
        };
        
        const existingEmails = JSON.parse(localStorage.getItem('procurvv-emails') || '[]');
        existingEmails.push(emailData);
        localStorage.setItem('procurvv-emails', JSON.stringify(existingEmails));
        
        // Redirect to chat interface
        window.location.href = `/chat?email=${encodeURIComponent(chatEmail.trim())}`;
      } catch (error) {
        console.error('Error storing email:', error);
        // Still redirect even if API call fails
        window.location.href = `/chat?email=${encodeURIComponent(chatEmail.trim())}`;
      }
    }
  };

  const handleInputClick = () => {
    setShowEmailInput(true);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Blue Promotional Panel */}
      <div className="flex-1 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-8">
        <div className="max-w-md text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center bg-blue-400/30 border border-blue-300/50 rounded-full px-6 py-3 mb-6">
              <span className="text-white mr-2">✨</span>
              <span className="text-sm text-white">We have launched Procurv Beta 1.2!</span>
              <span className="text-white ml-2">✨</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              The AI Co-pilot for Procurement
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Source-to-Pay without rigid workflows. Chat, don't click — procurement simplified with self-learning AI that gets smarter with every query.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            {!showEmailInput ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="What procurement task can I help you with today?"
                  onClick={handleInputClick}
                  className="w-full px-6 py-4 pr-16 text-lg bg-white border border-gray-200 rounded-xl text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                  readOnly
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ) : (
              <form onSubmit={handleChatEmailSubmit} className="relative">
                <div className="relative">
                  <input
                    type="email"
                    value={chatEmail}
                    onChange={(e) => setChatEmail(e.target.value)}
                    placeholder="Please enter your email"
                    className="w-full px-6 py-4 pr-32 text-lg bg-white border border-gray-200 rounded-xl text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Get Instant Access
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <p className="text-blue-200 mb-4">Try these examples</p>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-200/30 text-white rounded-full text-sm transition-colors hover:bg-blue-200/50 border border-blue-300/50 text-left">
                Find supplies for 500 laptops under $800 each
              </button>
              <button className="w-full px-4 py-2 bg-blue-200/30 text-white rounded-full text-sm transition-colors hover:bg-blue-200/50 border border-blue-300/50 text-left">
                Analise Q3 spend across all categories
              </button>
              <button className="w-full px-4 py-2 bg-blue-200/30 text-white rounded-full text-sm transition-colors hover:bg-blue-200/50 border border-blue-300/50 text-left">
                Source custom metal fabrication for auto motive parts
              </button>
              <button className="w-full px-4 py-2 bg-blue-200/30 text-white rounded-full text-sm transition-colors hover:bg-blue-200/50 border border-blue-300/50 text-left">
                Run compliance checks on 10 suppliers
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-8 text-sm text-white/90"
          >
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>No setup required</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Audit-ready reports</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - White Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Log in to your account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>
              
              <div className="text-right">
                <a href="#" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  Forgot password?
                </a>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Log in
              </button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <button className="mt-6 w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <span className="text-gray-600">New to Procurv? </span>
              <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                Create account
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
