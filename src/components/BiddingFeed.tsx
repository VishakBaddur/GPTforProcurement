'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuctionEvent {
  type: 'vendor_joined' | 'bid_submitted' | 'leader_changed' | 'round_started' | 'round_ended' | 'auction_finalized';
  vendorId?: string;
  amount?: number;
  round?: number;
  timestamp: Date;
  message: string;
}

interface BiddingFeedProps {
  events: AuctionEvent[];
  maxEvents?: number;
}

export default function BiddingFeed({ events, maxEvents = 20 }: BiddingFeedProps) {
  const recentEvents = events.slice(-maxEvents);
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'vendor_joined': return '👥';
      case 'bid_submitted': return '⬇️';
      case 'leader_changed': return '🏆';
      case 'round_started': return '⏱️';
      case 'round_ended': return '✅';
      case 'auction_finalized': return '🎯';
      default: return '📝';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'bid_submitted': return 'text-green-400';
      case 'leader_changed': return 'text-[#ff6f61]';
      case 'auction_finalized': return 'text-blue-400';
      default: return 'text-[#98a0a6]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-procurvv-card border border-procurvv-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-procurvv-text">Bidding Feed</h3>
        <div className="text-sm text-procurvv-muted">
          {events.length} events
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto space-y-2">
        <AnimatePresence>
          {recentEvents.map((event, index) => (
            <motion.div
              key={`${event.timestamp.getTime()}-${index}`}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center space-x-3 p-3 bg-procurvv-bg rounded-lg hover:bg-procurvv-card transition-colors"
            >
              <div className="text-2xl">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${getEventColor(event.type)}`}>
                  {event.message}
                </p>
                <p className="text-xs text-procurvv-muted mt-1">
                  {event.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {event.amount && (
                <div className="text-sm font-semibold text-procurvv-text">
                  ${event.amount.toFixed(2)}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {recentEvents.length === 0 && (
        <div className="text-center py-8 text-procurvv-muted">
          <div className="text-4xl mb-2">📊</div>
          <p>No events yet</p>
        </div>
        )}
      </div>
    </motion.div>
  );
}
