'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CustomersPage() {
  const stats = [
    { number: "150+", label: "Companies trust Procurvv" },
    { number: "$50M+", label: "Spend managed through our platform" },
    { number: "40%", label: "Average savings cost reduction" },
    { number: "99.9%", label: "Uptime enterprise grade" }
  ];

  const testimonials = [
    {
      quote: "Procurvv reduced our source-to-contract time from 6 weeks to 2 days. The transparency is incredible – I can see exactly what the AI is doing.",
      author: "Sarah Chen",
      title: "Chief Procurement Officer",
      company: "TechScale",
      metric: "6 weeks → 2 days",
      avatar: null
    },
    {
      quote: "The AI found suppliers we never knew existed and saved us 31% on our cloud infrastructure spend. It's like having a team of experts working 24/7.",
      author: "Michael Rodriguez", 
      title: "VP of Operations",
      company: "Manufacturing Pro",
      metric: "31% cost savings",
      avatar: "👨‍💼"
    },
    {
      quote: "We've processed $2.3M in spend through Procurvv. The compliance automation saves our team 20 hours per week.",
      author: "Lisa Park",
      title: "Senior Procurement Manager", 
      company: "GlobalTech",
      metric: "$2.3M managed",
      avatar: "👩‍💼"
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
              <a href="/how-it-works" className="text-black hover:text-purple-600 transition-colors">How it works</a>
              <a href="/customers" className="text-procurvv-accent font-medium">Customers</a>
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
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-black mb-6"
            >
              Trusted by procurement{' '}
              <span className="text-purple-600">
                leaders
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              See how teams are transforming their procurement operations.
            </motion.p>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-black mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* GitHub Stars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-3 bg-white rounded-lg px-6 py-3 border border-gray-200">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <span className="text-black font-medium">2,847 stars on GitHub</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-procurvv-text-light text-sm ml-2">Open source</span>
              </div>
            </div>
          </motion.div>

          {/* Testimonials Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
              >
                {/* Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-procurvv-gradient-start rounded-full flex items-center justify-center text-xl">
                    {testimonial.avatar || "👤"}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-black">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.title}, {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Metric */}
                <div className="mt-4">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    {testimonial.metric}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="text-center"
          >
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-4">
                Ready to transform your procurement?
              </h2>
              <p className="text-gray-600 mb-6">
                Join 150+ companies using AI to streamline their source-to-pay processes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-procurvv-accent to-procurvv-accent-blue text-white px-8 py-3 rounded-lg hover:from-procurvv-accent-dark hover:to-procurvv-accent-blue-light transition-all duration-200 font-medium">
                  Get started free
                </button>
                <button className="bg-white border border-gray-300 text-black px-8 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium">
                  Schedule demo
                </button>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mt-20 pt-12 border-t border-procurvv-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Company Info */}
              <div className="md:col-span-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-procurvv-accent rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <span className="text-black font-semibold text-xl">Procurvv</span>
                </div>
                <p className="text-procurvv-text text-sm mb-4">
                  The AI copilot that transforms procurement from source-to-pay with intelligent automation.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-procurvv-muted hover:text-procurvv-accent transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-procurvv-muted hover:text-procurvv-accent transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-procurvv-muted hover:text-procurvv-accent transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Links */}
              <div>
                <h3 className="font-semibold text-procurvv-text mb-4">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/features" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Features</a></li>
                  <li><a href="/how-it-works" className="text-procurvv-text hover:text-procurvv-accent transition-colors">How it works</a></li>
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">API</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-procurvv-text mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">About</a></li>
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Blog</a></li>
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Careers</a></li>
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Contact</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-procurvv-text mb-4">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Help center</a></li>
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Community</a></li>
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Status</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-procurvv-text mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Privacy</a></li>
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Terms</a></li>
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Security</a></li>
                  <li><a href="#" className="text-procurvv-text hover:text-procurvv-accent transition-colors">Cookies</a></li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
