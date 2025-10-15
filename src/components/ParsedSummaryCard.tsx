'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ParsedSlots } from '../utils/parseRequest';

interface ParsedSummaryCardProps {
  slots: ParsedSlots;
  onStartAuction: () => void;
  onEdit?: () => void;
  isLoading?: boolean;
}

export default function ParsedSummaryCard({ slots, onStartAuction, onEdit, isLoading = false }: ParsedSummaryCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedCount, setUploadedCount] = useState<number>(0);

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [] as any[];
    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const idx = (name: string) => header.findIndex(h => h === name);
    const res: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      if (!cols.length) continue;
      const supplierName = cols[idx('supplier_name')] || cols[0];
      const email = idx('email') >= 0 ? cols[idx('email')] : '';
      const base = parseFloat(cols[idx('base_price')] || '0') || 0;
      const compliance = parseFloat(cols[idx('compliance_score')] || '0') || 0;
      if (!supplierName) continue;
      res.push({ supplier_name: supplierName, email, base_price: base, compliance_score: compliance });
    }
    return res;
  };

  const shapeVendors = (rows: any[]): any[] => {
    return rows.map((r, i) => ({
      id: `csv_${Date.now()}_${i}`,
      name: String(r.supplier_name || r.name || `Vendor ${i + 1}`),
      basePrice: Number(r.base_price || r.startingBid || 0) || Math.max(1, (slots.budget || slots.maxBudget || 100) * 0.9),
      minAcceptable: Number(r.minAcceptable || 0) || Math.max(0.5, (slots.budget || slots.maxBudget || 100) * 0.6),
      aggressiveness: Number(r.aggressiveness || 1),
      warrantyMonths: Number(r.warrantyMonths || slots.warrantyMonths || 12),
      maxDeliveryDays: Number(r.maxDeliveryDays || slots.deliveryDays || 30),
      complianceScore: Number(r.compliance_score || 0) || 0
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      let rows: any[] = [];
      if (file.name.toLowerCase().endsWith('.json')) {
        rows = JSON.parse(text);
      } else {
        rows = parseCSV(text);
      }
      const vendors = shapeVendors(rows);
      localStorage.setItem('procurv-uploaded-suppliers', JSON.stringify(vendors));
      setUploadedCount(vendors.length);
    } catch (err) {
      console.error('Upload parse error:', err);
      setUploadedCount(0);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mb-8"
    >
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Auction: {slots.item}
          </h3>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-700 text-sm">
            Got it — {slots.quantity} {slots.item}, budget ${slots.budget}/unit, delivery within {slots.deliveryDays} days.
          </p>
          <p className="text-blue-600 text-sm font-medium mt-1">
            Shall I start a reverse auction?
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Quantity</div>
            <div className="text-lg font-semibold text-gray-800">
              {slots.quantity?.toLocaleString() || 'Not specified'}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Budget</div>
            <div className="text-lg font-semibold text-gray-800">
              ${slots.budget?.toLocaleString() || slots.maxBudget?.toLocaleString() || 'Not specified'}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Delivery</div>
            <div className="text-lg font-semibold text-gray-800">
              {slots.deliveryDays ? `${slots.deliveryDays} days` : 'Not specified'}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Warranty</div>
            <div className="text-lg font-semibold text-gray-800">
              {slots.warranty || 'Not specified'}
            </div>
          </div>
        </div>
        
        {/* Upload suppliers */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            {uploadedCount > 0 ? `${uploadedCount} suppliers loaded from file` : 'Optionally upload suppliers (CSV/JSON)'}
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept=".csv,.json" onChange={handleUpload} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              type="button"
            >
              Upload suppliers
            </button>
          </div>
        </div>

        <motion.button
          onClick={onStartAuction}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
