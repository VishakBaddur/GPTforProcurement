'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  isTyping?: boolean;
}

export default function MessageBubble({ message, isUser, timestamp, isTyping = false }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <motion.div
          className={`px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-procurvv-card text-procurvv-text rounded-br-md border border-procurvv-border' 
              : 'bg-procurvv-card text-procurvv-text rounded-bl-md border border-procurvv-border'
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {isTyping ? (
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              <span className="ml-2 text-sm">AI is thinking...</span>
            </div>
          ) : (
            <div>
              <p className="text-sm leading-relaxed">{message}</p>
              {timestamp && (
                <p className={`text-xs mt-1 ${isUser ? 'text-[#98a0a6]' : 'text-white/70'}`}>
                  {timestamp.toLocaleTimeString()}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
