'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ParsedSlots } from '../utils/parseRequest';

interface ParsedSummaryCardProps {
  slots: ParsedSlots;
  onStartAuction: () => void;
  onEdit?: () => void;
  isLoading?: boolean;
}

export default function ParsedSummaryCard({ slots, onStartAuction, onEdit, isLoading = false }: ParsedSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mb-8"
    >
      <div className="bg-procurvv-card border border-procurvv-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-procurvv-text">
            Auction: {slots.item}
          </h3>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-procurvv-accent hover:text-procurvv-accent/80 text-sm font-medium transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        
        <div className="mb-4 p-3 bg-procurvv-bg rounded-lg">
          <p className="text-procurvv-text text-sm">
            Got it — {slots.quantity} {slots.item}, budget ${slots.budget}/unit, delivery within {slots.deliveryDays} days.
          </p>
          <p className="text-procurvv-accent text-sm font-medium mt-1">
            Shall I start a reverse auction?
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-procurvv-bg rounded-lg p-4">
            <div className="text-sm text-procurvv-muted mb-1">Quantity</div>
            <div className="text-lg font-semibold text-procurvv-text">
              {slots.quantity?.toLocaleString() || 'Not specified'}
            </div>
          </div>
          
          <div className="bg-procurvv-bg rounded-lg p-4">
            <div className="text-sm text-procurvv-muted mb-1">Budget</div>
            <div className="text-lg font-semibold text-procurvv-text">
              ${slots.budget?.toLocaleString() || slots.maxBudget?.toLocaleString() || 'Not specified'}
            </div>
          </div>
          
          <div className="bg-procurvv-bg rounded-lg p-4">
            <div className="text-sm text-procurvv-muted mb-1">Delivery</div>
            <div className="text-lg font-semibold text-procurvv-text">
              {slots.deliveryDays ? `${slots.deliveryDays} days` : 'Not specified'}
            </div>
          </div>
          
          <div className="bg-procurvv-bg rounded-lg p-4">
            <div className="text-sm text-procurvv-muted mb-1">Warranty</div>
            <div className="text-lg font-semibold text-procurvv-text">
              {slots.warranty || 'Not specified'}
            </div>
          </div>
        </div>
        
        <motion.button
          onClick={onStartAuction}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-procurvv-accent text-white font-semibold rounded-xl hover:bg-procurvv-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Starting Auction...
            </div>
          ) : (
            'Start Auction'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
