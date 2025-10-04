'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface VendorRowProps {
  vendor: {
    id: string;
    name: string;
    currentBid: number;
    isCompliant: boolean;
    complianceScore: number;
    bidHistory: number[];
  };
  isLeader: boolean;
  previousBid?: number;
  rank: number;
}

export default function VendorRow({ vendor, isLeader, previousBid, rank }: VendorRowProps) {
  const priceChange = previousBid ? ((vendor.currentBid - previousBid) / previousBid) * 100 : 0;
  const isPriceDrop = priceChange < 0;
  
  // Prepare data for sparkline
  const sparklineData = vendor.bidHistory.map((bid, index) => ({
    round: index,
    price: bid
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
        isLeader 
          ? 'border-procurvv-accent bg-procurvv-card shadow-lg shadow-procurvv-accent/20' 
          : 'border-procurvv-border bg-procurvv-bg hover:border-procurvv-accent/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            isLeader ? 'bg-procurvv-accent text-white' : 'bg-procurvv-muted text-procurvv-bg'
          }`}>
            {rank}
          </div>
          
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-procurvv-accent flex items-center justify-center text-white font-bold">
            {vendor.name.charAt(0)}
          </div>
          
          {/* Vendor Info */}
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-procurvv-text">{vendor.name}</h4>
              {isLeader && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-procurvv-accent"
                >
                  🏆
                </motion.div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className={`px-2 py-1 rounded-full text-xs ${
                vendor.isCompliant 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {vendor.isCompliant ? '✅ Compliant' : '⚠️ Partial'}
              </span>
              <span className="text-procurvv-muted">
                Score: {vendor.complianceScore}
              </span>
            </div>
          </div>
        </div>
        
        {/* Price and Chart */}
        <div className="flex items-center space-x-4">
          {/* Sparkline */}
          <div className="w-20 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isLeader ? "#00bfff" : "#98a0a6"} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Price */}
          <div className="text-right">
            <motion.div
              key={vendor.currentBid}
              initial={{ scale: 1.1, backgroundColor: isPriceDrop ? '#10b981' : '#ef4444' }}
              animate={{ scale: 1, backgroundColor: 'transparent' }}
              transition={{ duration: 0.3 }}
              className={`text-2xl font-bold ${
                isLeader ? 'text-procurvv-accent' : 'text-procurvv-text'
              }`}
            >
              ${vendor.currentBid.toFixed(2)}
            </motion.div>
            {priceChange !== 0 && (
              <div className={`text-sm ${
                isPriceDrop ? 'text-green-400' : 'text-red-400'
              }`}>
                {isPriceDrop ? '↓' : '↑'} {Math.abs(priceChange).toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
