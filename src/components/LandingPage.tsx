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

  return (
    <div className="min-h-screen bg-gradient-to-br from-procurvv-bg via-procurvv-bg to-procurvv-card">
      {/* Header */}
      <header className="bg-procurvv-logo border-b border-procurvv-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-procurvv-accent rounded-lg flex items-center justify-center">
                <span className="text-procurvv-bg font-bold text-lg">P</span>
              </div>
              <span className="text-procurvv-text font-semibold text-xl">Procurvv</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-procurvv-text hover:text-procurvv-accent transition-colors">
                Features
              </a>
              <a href="#faq" className="text-procurvv-text hover:text-procurvv-accent transition-colors">
                FAQ
              </a>
              <a href="#about" className="text-procurvv-text hover:text-procurvv-accent transition-colors">
                About
              </a>
            </nav>
            
            {/* CTA Button */}
            <button className="bg-procurvv-bg border border-procurvv-accent text-procurvv-text px-6 py-2 rounded-lg hover:bg-procurvv-accent hover:text-procurvv-bg transition-colors">
              Join Waitlist
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-procurvv-bg border border-procurvv-accent rounded-full px-4 py-2 mb-8"
          >
            <span className="text-procurvv-accent">✨</span>
            <span className="text-procurvv-text text-sm font-medium">ChatGPT for Procurement</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold text-procurvv-text mb-6"
          >
            Run a reverse e-auction{' '}
            <span className="text-procurvv-accent">in chat</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-procurvv-muted mb-12 max-w-2xl mx-auto"
          >
            Launch a competitive e-auction in minutes. Join waitlist to unlock{' '}
            <span className="text-procurvv-accent font-semibold">3 free reverse events</span>.
          </motion.p>
        </div>

        {/* Chat Assistant Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-2xl mx-auto"
        >
          <h2 className="text-procurvv-text text-lg font-medium mb-4 text-center">
            Your Chat Assistant for Procurement
          </h2>
          
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="A whole new way for reverse auction"
              className="w-full bg-procurvv-card border border-procurvv-border rounded-lg px-4 py-4 text-procurvv-text placeholder-procurvv-muted focus:outline-none focus:ring-2 focus:ring-procurvv-accent focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            
            {/* Icons */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
              <button
                onClick={handleAttachmentClick}
                className="text-procurvv-muted hover:text-procurvv-text transition-colors"
                title="Upload vendor list or requirements file"
              >
                📎
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-procurvv-accent hover:text-procurvv-text transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Pitch Mode Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="fixed bottom-6 right-6"
      >
        <button
          onClick={onStartChat}
          className="bg-procurvv-bg border border-procurvv-accent text-procurvv-text px-4 py-2 rounded-lg hover:bg-procurvv-accent hover:text-procurvv-bg transition-colors flex items-center space-x-2"
        >
          <span className="text-red-500">🎯</span>
          <span>Pitch Mode</span>
        </button>
      </motion.div>
    </div>
  );
}
