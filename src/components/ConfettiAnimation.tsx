'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConfettiAnimationProps {
  isActive: boolean;
}

export default function ConfettiAnimation({ isActive }: ConfettiAnimationProps) {
  useEffect(() => {
    if (isActive) {
      // Create confetti effect
      const createConfetti = () => {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
        const confettiCount = 50;
        const confettiElements: HTMLElement[] = [];
        
        for (let i = 0; i < confettiCount; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti-particle';
          confetti.style.position = 'fixed';
          confetti.style.left = Math.random() * 100 + 'vw';
          confetti.style.top = '-10px';
          confetti.style.width = '10px';
          confetti.style.height = '10px';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.borderRadius = '50%';
          confetti.style.pointerEvents = 'none';
          confetti.style.zIndex = '9999';
          
          document.body.appendChild(confetti);
          confettiElements.push(confetti);
          
          // Animate confetti falling
          confetti.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) rotate(360deg)`, opacity: 0 }
          ], {
            duration: 3000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }).onfinish = () => {
            confetti.remove();
          };
        }
        
        // Cleanup function
        return () => {
          confettiElements.forEach(confetti => {
            if (confetti.parentNode) {
              confetti.remove();
            }
          });
        };
      };
      
      const cleanup = createConfetti();
      
      // Cleanup when component unmounts or isActive becomes false
      return cleanup;
    } else {
      // Clean up any existing confetti when isActive becomes false
      const existingConfetti = document.querySelectorAll('.confetti-particle');
      existingConfetti.forEach(confetti => confetti.remove());
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const existingConfetti = document.querySelectorAll('.confetti-particle');
      existingConfetti.forEach(confetti => confetti.remove());
    };
  }, []);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-50"
    >
      {/* Success overlay */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl"
      >
        🎉
      </motion.div>
    </motion.div>
  );
}
