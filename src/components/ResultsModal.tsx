'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Winner {
  id: string;
  name: string;
  finalBid: number;
  isCompliant: boolean;
  warrantyMonths: number;
  maxDeliveryDays: number;
}

interface AuctionSummary {
  totalRounds: number;
  totalBids: number;
  duration: number;
}

interface PODetails {
  poNumber: string;
  buyerName: string;
  buyerEmail: string;
  vendorName: string;
  vendorEmail: string;
  item: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDays: number;
  warrantyMonths: number;
  orderDate: string;
  deliveryDate: string;
}

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: Winner;
  rationale: string;
  auctionSummary: AuctionSummary;
  poDetails: PODetails;
  onGeneratePO: () => void;
}

export default function ResultsModal({ 
  isOpen, 
  onClose, 
  winner, 
  rationale, 
  auctionSummary, 
  poDetails,
  onGeneratePO 
}: ResultsModalProps) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {isOpen ? (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#0d1117] border border-[#98a0a6] rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#e6eef3]">Auction Results - FIXED!</h2>
            <button
              onClick={() => {
                console.log('Close button clicked');
                onClose();
              }}
              className="text-[#98a0a6] hover:text-[#e6eef3] transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Winner Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#ff6f61] to-[#ff8a80] rounded-xl p-6 mb-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">🏆</div>
              <div>
                <h3 className="text-2xl font-bold text-white">{winner.name}</h3>
                <p className="text-white/80">Winner</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-white">
              <div>
                <div className="text-sm opacity-80">Final Bid</div>
                <div className="text-3xl font-bold">${winner.finalBid.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm opacity-80">Compliance</div>
                <div className="text-lg font-semibold">
                  {winner.isCompliant ? '✅ Full' : '⚠️ Partial'}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Rationale */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-[#e6eef3] mb-3">Selection Rationale</h4>
            <p className="text-[#98a0a6] leading-relaxed">{rationale}</p>
          </div>
          
          {/* Auction Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0f1720] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#e6eef3]">{auctionSummary.totalRounds}</div>
              <div className="text-sm text-[#98a0a6]">Rounds</div>
            </div>
            <div className="bg-[#0f1720] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#e6eef3]">{auctionSummary.totalBids}</div>
              <div className="text-sm text-[#98a0a6]">Total Bids</div>
            </div>
            <div className="bg-[#0f1720] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[#e6eef3]">
                {Math.round(auctionSummary.duration / 1000)}s
              </div>
              <div className="text-sm text-[#98a0a6]">Duration</div>
            </div>
          </div>
          
          {/* PO Preview */}
          <div className="bg-[#0f1720] rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-[#e6eef3] mb-3">Purchase Order Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#98a0a6]">PO Number:</span>
                <span className="text-[#e6eef3]">{poDetails.poNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98a0a6]">Item:</span>
                <span className="text-[#e6eef3]">{poDetails.item}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98a0a6]">Quantity:</span>
                <span className="text-[#e6eef3]">{poDetails.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#98a0a6]">Total Price:</span>
                <span className="text-[#e6eef3] font-semibold">${poDetails.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-4">
            <motion.button
              onClick={onGeneratePO}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-gradient-to-r from-[#ff6f61] to-[#ff8a80] text-white font-semibold rounded-xl hover:from-[#ff8a80] hover:to-[#ff6f61] transition-all duration-200"
            >
              Generate PO
            </motion.button>
            <motion.button
              onClick={() => {
                onClose();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border border-[#98a0a6] text-[#e6eef3] rounded-xl hover:bg-[#0f1720] transition-colors"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
