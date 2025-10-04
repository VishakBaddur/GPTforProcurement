'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PitchModeButtonProps {
  onStartPitchMode: () => void;
  isRunning?: boolean;
}

export default function PitchModeButton({ onStartPitchMode, isRunning = false }: PitchModeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const demoScript = [
    "I need 100 ergonomic chairs under $120 per unit, delivery within 30 days, 1 year warranty.",
    "Procure 200 steel rods, budget $5,000 max, delivery 2 weeks.",
    "Looking for 50 packs of personal protective equipment - can we have in 7 days?"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.button
        onClick={onStartPitchMode}
        disabled={isRunning}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          isRunning
            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
            : 'bg-procurvv-accent text-white hover:bg-procurvv-accent/90 shadow-lg'
        }`}
      >
        {isRunning ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Running Demo...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>🎯</span>
            <span>Pitch Mode</span>
          </div>
        )}
      </motion.button>
      
      {/* Demo Script Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isHovered && !isRunning ? 1 : 0,
          y: isHovered && !isRunning ? 0 : 10
        }}
        className="absolute bottom-full right-0 mb-2 w-80 bg-procurvv-bg border border-procurvv-border rounded-xl p-4 shadow-xl"
      >
        <h4 className="text-sm font-semibold text-procurvv-text mb-2">Demo Script Examples:</h4>
        <div className="space-y-2 text-xs text-procurvv-muted">
          {demoScript.map((script, index) => (
            <div key={index} className="p-2 bg-procurvv-card rounded-lg">
              "{script}"
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-procurvv-accent">
          💡 Click to run automated 90-second demo
        </div>
      </motion.div>
    </motion.div>
  );
}
