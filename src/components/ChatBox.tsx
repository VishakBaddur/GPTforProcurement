'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ChatBoxProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatBox({ onSendMessage, disabled = false, placeholder = "Describe your procurement needs..." }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // For demo purposes, we'll just show the filename
      // In a real app, you'd process the file content
      onSendMessage(`📎 Uploaded file: ${file.name}`);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-procurvv-card border border-procurvv-border rounded-xl px-4 py-3">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent text-procurvv-text placeholder-procurvv-muted focus:outline-none"
          />
          <div className="flex items-center space-x-3 ml-4">
            <button
              type="button"
              onClick={handleAttachmentClick}
              className="text-procurvv-muted hover:text-procurvv-text transition-colors"
              title="Upload vendor list or requirements file"
            >
              📎
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.json,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <motion.button
              type="submit"
              disabled={!message.trim() || disabled}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-procurvv-muted hover:text-procurvv-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➤
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
