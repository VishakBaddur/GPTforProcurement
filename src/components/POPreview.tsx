'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { createPOPreview, downloadPO, PODetails } from '../utils/exportPo';

interface POPreviewProps {
  poDetails: PODetails;
  onClose: () => void;
}

export default function POPreview({ poDetails, onClose }: POPreviewProps) {
  const handlePrint = () => {
    const html = createPOPreview(poDetails);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    downloadPO(poDetails);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Purchase Order Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* PO Content */}
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: createPOPreview(poDetails) 
          }}
        />
        
        {/* Actions */}
        <div className="flex space-x-4 mt-6 pt-6 border-t">
          <motion.button
            onClick={handlePrint}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Print PO
          </motion.button>
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Download HTML
          </motion.button>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
