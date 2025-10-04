'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentaryBoxProps {
  commentary: string;
  isTyping?: boolean;
  round?: number;
}

export default function CommentaryBox({ commentary, isTyping = false, round }: CommentaryBoxProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (commentary && !isTyping) {
      setIsAnimating(true);
      setDisplayedText('');
      
      // Simulate typing effect
      let index = 0;
      const timer = setInterval(() => {
        if (index < commentary.length) {
          setDisplayedText(commentary.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
          setIsAnimating(false);
        }
      }, 30); // 30ms per character
      
      return () => clearInterval(timer);
    }
  }, [commentary, isTyping]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-procurvv-card border border-procurvv-border rounded-xl p-6 h-fit"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-procurvv-accent flex items-center justify-center">
          <span className="text-white font-bold">AI</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-procurvv-text">Auction Commentary</h3>
          {round && (
            <p className="text-sm text-procurvv-muted">Round {round}</p>
          )}
        </div>
      </div>
      
      <div className="min-h-[120px] flex items-center">
        <AnimatePresence mode="wait">
          {isTyping ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="flex space-x-1">
                <motion.div
                  className="w-2 h-2 bg-procurvv-accent rounded-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-procurvv-accent rounded-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-procurvv-accent rounded-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              <span className="text-procurvv-muted text-sm">Analyzing market dynamics...</span>
            </motion.div>
          ) : (
            <motion.div
              key="commentary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-procurvv-text leading-relaxed"
            >
              {displayedText}
              {isAnimating && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-1"
                >
                  |
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
