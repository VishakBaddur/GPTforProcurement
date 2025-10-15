'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStartChat: (text?: string) => void;
}

export default function LandingPage({ onStartChat }: LandingPageProps) {
  const [inputValue, setInputValue] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onStartChat(inputValue.trim());
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        // Store email for developer reference
        localStorage.setItem('procurvv-user-email', email.trim());
        
        // Send email to API for developer reference
        await fetch('/api/store-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            source: 'landing-page'
          }),
        });

        // Also store in localStorage for developer dashboard
        const emailData = {
          email: email.trim(),
          source: 'landing-page',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ip: 'client-side'
        };
        
        const existingEmails = JSON.parse(localStorage.getItem('procurvv-emails') || '[]');
        existingEmails.push(emailData);
        localStorage.setItem('procurvv-emails', JSON.stringify(existingEmails));
        
        // Redirect to chat interface
        window.location.href = `/chat?email=${encodeURIComponent(email.trim())}`;
      } catch (error) {
        console.error('Error storing email:', error);
        // Still redirect even if API call fails
        window.location.href = `/chat?email=${encodeURIComponent(email.trim())}`;
      }
    }
  };

  const handleInputClick = () => {
    setShowEmailInput(true);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const exampleQueries = [
    "Find supplies for 500 laptops under $800 each",
    "Analise Q3 spend across all categories", 
    "Source custom metal fabrication for auto motive parts",
    "Run compliance checks on 10 suppliers"
  ];

  const workflowSteps = [
    {
      number: "01",
      title: "Describe your need",
      description: "Tell us what you need in plain English — no forms, no complicated interfaces. Sketch budgets, ensure good-faith bidding, create contracts.",
      image: "/step1.png?v=1"
    },
    {
      number: "02", 
      title: "AI agents take action",
      description: "Our AI handles the complex workflows automatically while you watch in real-time. Supplier discovery, bid analysis, contract review, compliance checks.",
      image: "/step2.png?v=2"
    },
    {
      number: "03",
      title: "Real-time intelligence", 
      description: "Gather market data and supplier information instantly from global sources. Innovate, supplier ratings, compliance status, availability.",
      image: "/step3.png?v=3"
    },
    {
      number: "04",
      title: "Get actionable results",
      description: "Receive comprehensive analysis with full audit trails and documentation. Sourcing recommendations, cost savings, risk assessments.",
      image: "/step4.png?v=4"
    }
  ];

  const features = [
    {
      title: "Reverse Auction",
      description: "Launch smarter auctions directly through AI chat in minutes.",
      status: "Live Feature",
      icon: "🎯"
    },
    {
      title: "Self-Learning AI", 
      description: "Launch smarter auctions directly through AI chat in minutes.",
      status: "Coming Soon",
      icon: "🧠"
    },
    {
      title: "Procurement AI Studio",
      description: "Build, Deploy, and Control AI Procurement Agents.",
      status: "Coming Soon", 
      icon: "⚙️"
    }
  ];

  const faqs = [
    {
      question: "How secure is our procurement data with Procurv?",
      answer: "Procurv uses enterprise-grade encryption (AES-256) for all data transmission and storage. We're SOC 2 Type II compliant and maintain strict access controls. Your procurement data is never shared with third parties without explicit consent."
    },
    {
      question: "Can we control which AI agents handle our procurement requests?",
      answer: "Yes, you have full control over agent behavior. You can set approval workflows, define spending limits, and configure which agents can make decisions. All agent actions are logged and can be reviewed before execution."
    },
    {
      question: "How does the AI ensure compliance with our procurement policies?",
      answer: "Procurv's AI is trained on your specific procurement policies and compliance requirements. It automatically validates vendor credentials, checks against your approved supplier lists, and ensures all transactions meet your regulatory standards before processing."
    },
    {
      question: "What happens if the AI makes a decision we disagree with?",
      answer: "All AI decisions are transparent and auditable. You can override any decision, and the system learns from your feedback. Critical decisions require human approval, and you can set spending thresholds that require manual review."
    },
    {
      question: "How does Procurv integrate with our existing ERP systems?",
      answer: "Procurv offers seamless integration with major ERP systems (SAP, Oracle, Microsoft Dynamics) through secure APIs. The integration maintains data consistency and provides real-time synchronization with your existing procurement workflows."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-black font-semibold text-xl">Procurv</span>
            </a>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors">Benefits</a>
              <a href="#video" className="text-gray-600 hover:text-gray-900 transition-colors">Product Walkthrough</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQs</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <a href="/login" className="bg-white border border-black text-black px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">Log in</a>
              <a href="/login" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Get started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Rounded content box */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-16 relative overflow-hidden">
            {/* Cloud-like background texture inside the box */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-16 bg-white/20 rounded-full blur-xl"></div>
              <div className="absolute top-20 right-20 w-24 h-12 bg-white/15 rounded-full blur-lg"></div>
              <div className="absolute bottom-20 left-1/4 w-40 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-1/3 w-28 h-14 bg-white/25 rounded-full blur-lg"></div>
            </div>
            
            <div className="text-center relative z-10 text-white">
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
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  The AI Co-pilot for Procurement
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
                  Source-to-Pay without rigid workflows. Chat, don't click — procurement simplified with self-learning AI that gets smarter with every query.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              >
                <a 
                  href="/login"
                  className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg flex items-center space-x-2"
                >
                  <span>Get Instant Access</span>
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center ml-2">
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
                <button 
                  onClick={() => {
                    const videoSection = document.getElementById('video');
                    if (videoSection) {
                      videoSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-white border-2 border-black text-black px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg flex items-center space-x-2"
                >
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <span>Watch Demo</span>
                </button>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-2xl mx-auto mb-8"
              >
                {!showEmailInput ? (
                  <form onSubmit={handleSubmit} className="relative">
                    <div className="relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onClick={handleInputClick}
                        placeholder="What procurement task can I help you with today?"
                        className="w-full px-6 py-4 pr-16 text-lg bg-white border border-gray-200 rounded-xl text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="relative">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Please enter your email"
                        className="w-full pl-6 pr-40 sm:pr-44 py-4 text-base sm:text-lg bg-white border border-gray-200 rounded-xl text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                      >
                        Get Instant Access
                      </button>
                      <div className="absolute left-6 -top-6 sm:-top-7 text-white/90 text-xs sm:text-sm">
                        Please enter your email
                      </div>
                    </div>
                  </form>
                )}
              </motion.div>

              {/* Example Queries */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-8"
              >
                <p className="text-blue-200 mb-4">Try these examples</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {exampleQueries.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => onStartChat(query)}
                      className="px-4 py-2 bg-blue-200/30 text-white rounded-full text-sm transition-colors hover:bg-blue-200/50 border border-blue-300/50"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Feature Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap justify-center gap-8 text-sm text-white/90"
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
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              How it works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              From prompt to procurement
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI agents handle the entire workflow, so you can focus on strategic decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-blue-200 transform translate-x-8 z-0"></div>
                  )}
                </div>
                <div className="w-full h-48 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Benefits
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Complete source-to-pay
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              One AI co-pilot handles your entire procurement workflow. No more jumping between tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    feature.status === 'Live Feature' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {feature.status}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="video" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Product Walkthrough
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See Procurv in action
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Watch our AI agents handle complex procurement workflows in real-time — from sourcing to contract completion.
          </p>
          
          <div className="relative bg-black rounded-xl overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <button 
                onClick={() => setShowVideoModal(true)}
                className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              FAQs
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Common Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Procurv.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg 
                      className={`w-6 h-6 transition-transform duration-200 ${expandedFaq === index ? 'rotate-45' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-100"
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-white font-semibold text-xl">Procurv</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to transform your procurement?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 150+ companies using AI to streamline their source-to-pay processes.
          </p>
          
          <a 
            href="/login"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg flex items-center space-x-2 mx-auto inline-flex"
          >
            <span>Get Started for Free</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-2">AI moves fast</p>
              <p className="text-gray-600">We'll keep you up to date with the latest.</p>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600">© 2025 Procurv. All rights reserved.</p>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <span className="text-black font-semibold text-xl">Procurv</span>
                <p className="text-gray-600 text-sm">The AI co-pilot to procurement</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Procurv Demo Video</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Demo Video Coming Soon</h4>
                  <p className="text-gray-300">This would be a real video showcasing Procurv's AI procurement capabilities.</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}