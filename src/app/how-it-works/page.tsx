'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Describe your need",
      description: "Tell us what you need in plain English — no forms, no complicated interfaces. Source suppliers, analyze spend, run auctions, check compliance",
      icon: "💬",
      color: "from-procurvv-accent-blue to-procurvv-accent-blue-light"
    },
    {
      number: "02", 
      title: "AI agents take action",
      description: "Our AI handles the complex workflows automatically while you watch in real-time. Supplier discovery, bid analysis, contract review, compliance checks",
      icon: "🧠",
      color: "from-procurvv-accent to-procurvv-accent-light"
    },
    {
      number: "03",
      title: "Real-time intelligence", 
      description: "Gather market data and supplier information instantly from global sources. Pricing data, supplier ratings, compliance status, availability",
      icon: "📊",
      color: "from-procurvv-accent-blue-light to-procurvv-accent"
    },
    {
      number: "04",
      title: "Get actionable results",
      description: "Receive comprehensive analysis with full audit trails and documentation. Sourced recommendations, cost savings, risk assessments",
      icon: "📄",
      color: "from-procurvv-accent to-procurvv-accent-blue"
    }
  ];

  const benefits = [
    {
      icon: "⚡",
      title: "Lightning fast",
      description: "Tasks that take weeks now complete in minutes"
    },
    {
      icon: "🧠",
      title: "Self-learning",
      description: "Gets smarter with every procurement decision"
    },
    {
      icon: "📋",
      title: "Audit ready",
      description: "Complete documentation and compliance tracking"
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
              <span className="text-black font-semibold text-xl">Procurvv</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/features" className="text-black hover:text-purple-600 transition-colors">Features</a>
              <a href="/how-it-works" className="text-procurvv-accent font-medium">How it works</a>
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
              How it works
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl font-bold text-black mb-6"
            >
              From prompt to{' '}
              <span className="bg-gradient-to-r from-procurvv-accent-blue to-procurvv-accent bg-clip-text text-transparent">
                procurement
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-black max-w-2xl mx-auto"
            >
              Our AI agents handle the entire workflow, so you can focus on strategic decisions.
            </motion.p>
          </div>

          {/* Steps Section */}
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="relative"
                >
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-procurvv-border transform translate-x-8 z-0">
                      <div className="absolute top-1/2 right-0 w-2 h-2 bg-procurvv-border rounded-full transform -translate-y-1/2"></div>
                    </div>
                  )}
                  
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-procurvv-border relative z-10">
                    {/* Number Circle */}
                    <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg mb-6`}>
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-procurvv-accent/10 to-procurvv-accent-light/10 rounded-xl flex items-center justify-center text-3xl mb-6">
                      {step.icon}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-procurvv-text mb-4">
                      {step.title}
                    </h3>
                    <p className="text-procurvv-text leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-procurvv-accent/10 to-procurvv-accent-light/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-procurvv-text mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-procurvv-text">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#" className="text-procurvv-accent hover:text-procurvv-accent-dark transition-colors flex items-center space-x-2">
                <span>•</span>
                <span>See it in action — watch AI agents work in real-time</span>
              </a>
              <button className="bg-gradient-to-r from-procurvv-accent to-procurvv-accent-blue text-white px-8 py-3 rounded-lg hover:from-procurvv-accent-dark hover:to-procurvv-accent-blue-light transition-all duration-200 font-medium flex items-center space-x-2">
                <span>Try Procurvv Free</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
