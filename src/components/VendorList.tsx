'use client';

import React from 'react';
import { motion } from 'framer-motion';
import VendorRow from './VendorRow';

interface Vendor {
  id: string;
  name: string;
  currentBid: number;
  isCompliant: boolean;
  complianceScore: number;
  bidHistory: number[];
}

interface VendorListProps {
  vendors: Vendor[];
  leaderId?: string;
  previousBids?: Record<string, number>;
}

export default function VendorList({ vendors, leaderId, previousBids = {} }: VendorListProps) {
  // Sort vendors by current bid (ascending)
  const sortedVendors = [...vendors].sort((a, b) => a.currentBid - b.currentBid);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-procurvv-text">Vendors</h3>
        <div className="text-sm text-procurvv-muted">
          {vendors.length} active vendors
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedVendors.map((vendor, index) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <VendorRow
              vendor={vendor}
              isLeader={vendor.id === leaderId}
              previousBid={previousBids[vendor.id]}
              rank={index + 1}
            />
          </motion.div>
        ))}
      </div>
      
      {vendors.length === 0 && (
        <div className="text-center py-8 text-procurvv-muted">
          <div className="text-4xl mb-2">🏢</div>
          <p>No vendors participating yet</p>
        </div>
      )}
    </motion.div>
  );
}
