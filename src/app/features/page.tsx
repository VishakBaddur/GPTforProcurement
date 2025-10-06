'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function FeaturesPage() {
  const features = [
    {
      id: 1,
      title: "Reverse Auction",
      description: "AI-powered reverse auctions with real-time bidding optimization and intelligent supplier matching.",
      icon: "🖥️",
      status: "Live",
      statusColor: "bg-green-500"
    },
    {
      id: 2,
      title: "Self-Learning AI",
      description: "Gets smarter with every query. No setup, no training, just results.",
      icon: "🧠",
      status: "Upcoming",
      statusColor: "bg-orange-500"
    },
    {
      id: 3,
      title: "Audit-Ready Reports",
      description: "Every result is sourced, cited, and compliance-ready with automatic audit trails.",
      icon: "📊",
      status: "Upcoming",
      statusColor: "bg-orange-500"
    },
    {
      id: 4,
      title: "Global Sourcing",
      description: "AI-powered supplier discovery across global markets with risk assessment.",
      icon: "🔍",
      status: "Upcoming",
      statusColor: "bg-orange-500"
    },
    {
      id: 5,
      title: "Spend Analytics",
      description: "Instant insights across categories, suppliers, and time periods.",
      icon: "📈",
      status: "Upcoming",
      statusColor: "bg-orange-500"
    },
    {
      id: 6,
      title: "Payment Automation",
      description: "Automated invoice processing and payment scheduling.",
      icon: "💳",
      status: "Upcoming",
      statusColor: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-procurvv-bg">
      {/* Header */}
      <header className="bg-white border-b border-procurvv-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-procurvv-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-procurvv-text font-semibold text-xl">Procurvv</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/features" className="text-procurvv-accent font-medium">Features</a>
              <a href="/how-it-works" className="text-procurvv-text hover:text-procurvv-accent transition-colors">
                How it works
              </a>
              <a href="/customers" className="text-procurvv-text hover:text-procurvv-accent transition-colors">
                Customers
              </a>
            </nav>
            
            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">
                Sign in
              </a>
              <button className="bg-gradient-to-r from-procurvv-accent to-procurvv-accent-light text-white px-6 py-2 rounded-lg hover:from-procurvv-accent-dark hover:to-procurvv-accent transition-all duration-200 font-medium">
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
              className="inline-block text-sm text-procurvv-text-light mb-4"
            >
              Features
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl font-bold text-procurvv-text mb-6"
            >
              Complete{' '}
              <span className="bg-gradient-to-r from-procurvv-accent to-procurvv-accent-light bg-clip-text text-transparent">
                source-to-pay
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-procurvv-text-light max-w-2xl mx-auto"
            >
              One AI copilot handles your entire procurement workflow. No more jumping between tools.
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-procurvv-border hover:shadow-md transition-all duration-200 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-procurvv-accent/10 to-procurvv-accent-light/10 rounded-xl flex items-center justify-center text-2xl">
                      {feature.icon}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${feature.statusColor}`}>
                      {feature.status}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-procurvv-muted group-hover:text-procurvv-accent transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-procurvv-text mb-3">
                  {feature.title}
                </h3>
                <p className="text-procurvv-text-light leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-procurvv-gradient-start to-procurvv-gradient-end rounded-2xl p-8 border border-procurvv-accent/20">
              <h2 className="text-2xl font-bold text-procurvv-text mb-4">
                Ready to transform your procurement?
              </h2>
              <p className="text-procurvv-text-light mb-6">
                Join 150+ companies using AI to streamline their source-to-pay processes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-procurvv-accent to-procurvv-accent-light text-white px-8 py-3 rounded-lg hover:from-procurvv-accent-dark hover:to-procurvv-accent transition-all duration-200 font-medium">
                  Get started free
                </button>
                <button className="bg-white border border-procurvv-border text-procurvv-text px-8 py-3 rounded-lg hover:bg-procurvv-gradient-start transition-all duration-200 font-medium">
                  Schedule demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
