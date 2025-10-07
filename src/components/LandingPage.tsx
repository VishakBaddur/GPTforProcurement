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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name);
      // Handle file upload logic here
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const features = [
    {
      id: 1,
      title: "AI-Powered Sourcing",
      description: "Intelligent supplier discovery and qualification with real-time market analysis.",
      icon: "🔍",
      status: "Live",
      statusColor: "bg-green-500"
    },
    {
      id: 2,
      title: "Automated RFx",
      description: "Generate and manage RFPs, RFQs, and RFIs with AI assistance.",
      icon: "📋",
      status: "Upcoming",
      statusColor: "bg-orange-500"
    },
    {
      id: 3,
      title: "Contract Management",
      description: "Smart contract creation, negotiation, and lifecycle management.",
      icon: "📄",
      status: "Upcoming",
      statusColor: "bg-orange-500"
    },
    {
      id: 4,
      title: "Spend Analytics",
      description: "Real-time insights and predictive analytics across all spend categories.",
      icon: "📊",
      status: "Upcoming",
      statusColor: "bg-orange-500"
    },
    {
      id: 5,
      title: "Supplier Management",
      description: "Comprehensive supplier onboarding, performance tracking, and risk assessment.",
      icon: "🏢",
      status: "Upcoming",
      statusColor: "bg-orange-500"
    },
    {
      id: 6,
      title: "Invoice Processing",
      description: "Automated invoice capture, validation, and approval workflows.",
      icon: "🧾",
      status: "Upcoming",
      statusColor: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
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
              <a href="/features" className="text-black hover:text-purple-600 transition-colors">Features</a>
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
      <main className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-sm text-black mb-4"
            >
              COMPLETE SOURCE-TO-PAY
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl font-bold text-black mb-6"
            >
              Unlock the full potential of{' '}
              <span className="text-purple-600">
                source-to-pay
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-black max-w-2xl mx-auto mb-12"
            >
              From strategic sourcing to invoice processing, Procurvv streamlines every step of your procurement journey.
            </motion.p>

            {/* Chat Input Field - Integrated into the design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="w-full max-w-3xl mx-auto mb-16"
            >
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="What procurement task can I help you with today?"
                  className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm text-lg"
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
                    className="text-black hover:text-purple-600 transition-colors p-1"
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${feature.statusColor}`}>
                      {feature.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center bg-gray-50 rounded-3xl p-12 mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Ready to transform your procurement?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join 150+ companies already simplifying their source-to-pay with Procurvv.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-procurvv-accent to-procurvv-accent-blue text-white px-8 py-4 rounded-xl hover:from-procurvv-accent-dark hover:to-procurvv-accent-blue-light transition-all duration-200 font-medium text-lg">
                Get started
              </button>
              <button className="bg-white border-2 border-procurvv-accent text-procurvv-accent px-8 py-4 rounded-xl hover:bg-procurvv-accent hover:text-white transition-all duration-200 font-medium text-lg">
                Book a demo
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-procurvv-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-black font-semibold text-xl">Procurvv</span>
              </div>
              <p className="text-gray-600 text-sm">
                The AI copilot for procurement teams.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-black font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="/features" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">Features</a></li>
                <li><a href="/how-it-works" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">How it works</a></li>
                <li><a href="/customers" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">Customers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">Pricing</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-black font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-black font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-procurvv-accent transition-colors text-sm">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Procurvv. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-procurvv-accent transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-procurvv-accent transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}