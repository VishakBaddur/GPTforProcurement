'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  endTime: Date;
  onTimeUp: () => void;
}

export default function CountdownTimer({ endTime, onTimeUp }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft(Math.ceil(difference / 1000));
        
        // Show warning when less than 10 seconds
        if (difference < 10000) {
          setIsEnding(true);
        }
      } else {
        setTimeLeft(0);
        onTimeUp();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${
        isEnding 
          ? 'bg-red-500/20 border-red-500 text-red-400' 
          : 'bg-procurvv-card border-procurvv-border text-procurvv-text'
      }`}
    >
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${
          isEnding ? 'bg-red-400 animate-pulse' : 'bg-procurvv-accent'
        }`} />
        <span className="text-sm font-medium">
          {timeLeft > 0 ? `Auction ends in ${formatTime(timeLeft)}` : 'Auction ended'}
        </span>
      </div>
    </motion.div>
  );
}
