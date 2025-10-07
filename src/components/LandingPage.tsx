'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStartChat: (text?: string) => void;
}

export default function LandingPage({ onStartChat }: LandingPageProps) {
  const [inputValue, setInputValue] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    onStartChat(inputValue.trim() || undefined);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we'll just show the filename
      onStartChat(`📎 Uploaded file: ${file.name}`);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const exampleQueries = [
    "Find suppliers for 500 laptops under $800 each",
    "Analyze Q3 spend across all categories",
    "Source custom metal fabrication for automotive parts",
    "Run compliance check on top 10 suppliers"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-procurvv-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-procurvv-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-black font-semibold text-xl">Procurvv</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/features" className="text-black hover:text-purple-600 transition-colors">
                Features
              </a>
              <a href="/how-it-works" className="text-black hover:text-purple-600 transition-colors">
                How it works
              </a>
              <a href="/customers" className="text-black hover:text-purple-600 transition-colors">
                Customers
              </a>
            </nav>
            
            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-black hover:text-purple-600 transition-colors">
                Sign in
              </a>
              <button className="bg-gradient-to-r from-procurvv-accent to-procurvv-accent-blue text-white px-6 py-2 rounded-lg hover:from-procurvv-accent-dark hover:to-procurvv-accent-blue-light transition-all duration-200 font-medium">
                Get started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-procurvv-gradient-start border border-procurvv-accent/20 rounded-full px-4 py-2 mb-8"
          >
            <div className="w-2 h-2 bg-procurvv-accent rounded-full"></div>
            <span className="text-procurvv-text text-sm font-medium">AI Copilot for Procurement Teams</span>
            <svg className="w-4 h-4 text-procurvv-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-black mb-6"
          >
            The AI Copilot for{' '}
            <span className="bg-gradient-to-r from-procurvv-accent-blue to-procurvv-accent bg-clip-text text-transparent">
              Procurement - TESTING DEPLOYMENT!
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Source-to-Pay without rigid workflows. Chat, don't click — procurement simplified with self-learning AI that gets smarter with every query.
          </motion.p>
        </div>

        {/* Chat Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-3xl mx-auto mb-8"
        >
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What procurement task can I help you with today?"
              className="w-full bg-white border border-procurvv-border rounded-2xl px-6 py-4 text-procurvv-text placeholder-procurvv-muted focus:outline-none focus:ring-2 focus:ring-procurvv-accent focus:border-transparent shadow-sm text-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            
            {/* Attachment Button */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <button
                onClick={handleAttachmentClick}
                className="text-procurvv-text hover:text-procurvv-accent transition-colors p-1"
                title="Upload vendor list or requirements file"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            {/* Send Button */}
            <button
              onClick={handleSubmit}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-procurvv-accent to-procurvv-accent-blue text-white p-3 rounded-xl hover:from-procurvv-accent-dark hover:to-procurvv-accent-blue-light transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Example Queries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="w-full max-w-4xl mx-auto"
        >
          <p className="text-procurvv-text text-sm mb-4">Try these examples:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {exampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(query);
                  onStartChat(query);
                }}
                className="bg-procurvv-card border border-procurvv-border rounded-xl px-4 py-3 text-procurvv-text text-left hover:border-procurvv-accent hover:shadow-sm transition-all duration-200 text-sm"
              >
                {query}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <p className="text-procurvv-text text-sm mb-6">Trusted by procurement teams at 150+ companies</p>
          <div className="flex justify-center items-center space-x-8 text-xs text-procurvv-text">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-procurvv-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No setup required</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-procurvv-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-procurvv-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Audit-ready reports</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Pitch Mode Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="fixed bottom-6 right-6"
      >
        <button
          onClick={onStartChat}
          className="bg-procurvv-card border border-procurvv-accent text-procurvv-text px-4 py-2 rounded-lg hover:bg-procurvv-accent hover:text-white transition-colors flex items-center space-x-2 shadow-lg"
        >
          <span className="text-procurvv-accent">🎯</span>
          <span>Pitch Mode</span>
        </button>
      </motion.div>
    </div>
  );
}
