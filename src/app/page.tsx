'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBox from '../components/ChatBox';
import MessageBubble from '../components/MessageBubble';
import ParsedSummaryCard from '../components/ParsedSummaryCard';
import VendorList from '../components/VendorList';
import CommentaryBox from '../components/CommentaryBox';
import BiddingFeed from '../components/BiddingFeed';
import ResultsModal from '../components/ResultsModal';
import POPreview from '../components/POPreview';
import PitchModeButton from '../components/PitchModeButton';
import CountdownTimer from '../components/CountdownTimer';
import ConfettiAnimation from '../components/ConfettiAnimation';
import { ParsedSlots } from '../utils/parseRequest';
import { generateCommentary } from '../utils/commentaryTemplates';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface AuctionStatus {
  status: string;
  round: number;
  leader?: {
    id: string;
    name: string;
    bid: number;
    isCompliant: boolean;
  };
  vendors: Array<{
    id: string;
    name: string;
    currentBid: number;
    isCompliant: boolean;
    complianceScore: number;
    bidHistory: number[];
  }>;
  events: Array<{
    type: string;
    vendorId?: string;
    amount?: number;
    round?: number;
    timestamp: Date;
    message: string;
  }>;
  totalBids: number;
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [parsedSlots, setParsedSlots] = useState<ParsedSlots | null>(null);
  const [auctionId, setAuctionId] = useState<string | null>(null);
  const [auctionStatus, setAuctionStatus] = useState<AuctionStatus | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showPOPreview, setShowPOPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPitchMode, setIsPitchMode] = useState(false);
  const [currentCommentary, setCurrentCommentary] = useState('');
  const [isCommentaryTyping, setIsCommentaryTyping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const auctionRef = useRef<NodeJS.Timeout | null>(null);
  const commentaryRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (auctionRef.current) clearInterval(auctionRef.current);
      if (commentaryRef.current) clearInterval(commentaryRef.current);
    };
  }, []);

  const addMessage = (text: string, isUser: boolean, isTyping = false) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      isTyping
    };
    setMessages(prev => [...prev, message]);
    return message.id;
  };

  const handleSendMessage = async (text: string) => {
    // Add user message
    addMessage(text, true);
    
    // Add typing indicator
    const typingId = addMessage('', false, true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== typingId));
      
      // Add AI response
      addMessage(data.message, false);
      
      if (data.action === 'preview' && data.slots) {
        setParsedSlots(data.slots);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(m => m.id !== typingId));
      addMessage('Sorry, I encountered an error. Please try again.', false);
    }
  };

  const handleStartAuction = async () => {
    if (!parsedSlots) return;
    
    setIsLoading(true);
    
    try {
      // Create auction
      const createResponse = await fetch('/api/createAuction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots: parsedSlots })
      });
      
      const { auctionId } = await createResponse.json();
      setAuctionId(auctionId);
      
      // Start auction
      const startResponse = await fetch('/api/startAuction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auctionId })
      });
      
      if (startResponse.ok) {
        // Start polling for auction status
        startAuctionPolling(auctionId);
      }
    } catch (error) {
      console.error('Error starting auction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startAuctionPolling = (auctionId: string) => {
    if (auctionRef.current) clearInterval(auctionRef.current);
    
    auctionRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/auctionStatus?auctionId=${auctionId}`);
        const status = await response.json();
        
        setAuctionStatus(status);
        
        // Generate commentary
        if (status.leader && status.vendors) {
          generateAuctionCommentary(status);
        }
        
        // Check if auction ended
        if (status.status === 'ended') {
          clearInterval(auctionRef.current!);
          setShowConfetti(true);
          setTimeout(() => setShowResults(true), 1000);
        }
      } catch (error) {
        console.error('Error polling auction status:', error);
      }
    }, 2000);
  };

  const generateAuctionCommentary = (status: AuctionStatus) => {
    if (status.leader && status.vendors.length > 0) {
      const secondPlace = status.vendors
        .filter(v => v.id !== status.leader?.id)
        .sort((a, b) => a.currentBid - b.currentBid)[0];
      
      const commentary = generateCommentary(
        status.round,
        status.leader.name,
        status.leader.bid,
        secondPlace?.name,
        secondPlace?.currentBid
      );
      
      setIsCommentaryTyping(true);
      setCurrentCommentary('');
      
      // Simulate typing delay
      setTimeout(() => {
        setIsCommentaryTyping(false);
        setCurrentCommentary(commentary);
      }, Math.random() * 500 + 500);
    }
  };

  const handleGeneratePO = async () => {
    if (!auctionId) return;
    
    try {
      const response = await fetch(`/api/results?auctionId=${auctionId}`);
      const results = await response.json();
      
      setShowPOPreview(true);
    } catch (error) {
      console.error('Error getting results:', error);
    }
  };

  const startPitchMode = async () => {
    setIsPitchMode(true);
    
    // Demo script
    const demoText = "I need 100 ergonomic chairs under $120 per unit, delivery within 30 days, 1 year warranty.";
    
    // Simulate user input
    await new Promise(resolve => setTimeout(resolve, 1000));
    await handleSendMessage(demoText);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    await handleStartAuction();
    
    // Auto-close pitch mode after demo
    setTimeout(() => {
      setIsPitchMode(false);
    }, 90000); // 90 seconds
  };

  return (
    <div className="min-h-screen bg-procurvv-bg text-procurvv-text">
      {/* Header */}
      <div className="bg-procurvv-bg border-b border-procurvv-border p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-procurvv-logo rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-2xl font-bold text-procurvv-text">
              Procurvv
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-procurvv-muted hover:text-procurvv-text transition-colors">Features</a>
            <a href="#" className="text-procurvv-muted hover:text-procurvv-text transition-colors">FAQ</a>
            <a href="#" className="text-procurvv-muted hover:text-procurvv-text transition-colors">About</a>
            <button className="px-4 py-2 border border-procurvv-muted text-procurvv-text rounded-lg hover:bg-procurvv-card transition-colors">
              Join Waitlist
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Main Content */}
        <div className="text-center mb-12">
          {/* Tag */}
          <div className="inline-flex items-center space-x-2 bg-procurvv-card border border-procurvv-border rounded-full px-4 py-2 mb-8">
            <span className="text-white">✨</span>
            <span className="text-procurvv-text text-sm">ChatGPT for Procurement</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl font-bold text-procurvv-text mb-6">
            Run a reverse e-auction in chat
          </h1>
          
          {/* Sub-text */}
          <p className="text-xl text-procurvv-muted mb-12 max-w-2xl mx-auto">
            Launch a competitive <span className="text-procurvv-accent">e-auction</span> in minutes. Join waitlist to unlock <span className="text-procurvv-accent">3 free reverse events</span>
          </p>
        </div>

        {/* Chat Section */}
        <div className="mb-8">
          <div className="space-y-4 mb-6">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                  isTyping={message.isTyping}
                />
              ))}
            </AnimatePresence>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-procurvv-muted">Your Chat Assistant for Procurement</p>
          </div>
          
          <ChatBox
            onSendMessage={handleSendMessage}
            disabled={isLoading || isPitchMode}
            placeholder="A whole new way for reverse auction"
          />
        </div>

        {/* Parsed Summary */}
        {parsedSlots && (
          <ParsedSummaryCard
            slots={parsedSlots}
            onStartAuction={handleStartAuction}
            isLoading={isLoading}
          />
        )}

        {/* Auction View */}
        {auctionStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 mb-8"
          >
            {/* Countdown Timer */}
            {auctionStatus.startedAt && auctionStatus.endsAt && (
              <div className="flex justify-center">
                <CountdownTimer
                  endTime={new Date(auctionStatus.endsAt)}
                  onTimeUp={() => {
                    setShowConfetti(true);
                    setTimeout(() => setShowResults(true), 1000);
                  }}
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Vendor List */}
              <div className="lg:col-span-2">
                <VendorList
                  vendors={auctionStatus.vendors}
                  leaderId={auctionStatus.leader?.id}
                />
              </div>
              
              {/* Commentary */}
              <div>
                <CommentaryBox
                  commentary={currentCommentary}
                  isTyping={isCommentaryTyping}
                  round={auctionStatus.round}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Bidding Feed */}
        {auctionStatus && (
          <BiddingFeed events={auctionStatus.events} />
        )}
      </div>

      {/* Results Modal */}
      {showResults && (
        <ResultsModal
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          winner={auctionStatus?.leader ? {
            id: auctionStatus.leader.id,
            name: auctionStatus.leader.name,
            finalBid: auctionStatus.leader.bid,
            isCompliant: auctionStatus.leader.isCompliant,
            warrantyMonths: 12,
            maxDeliveryDays: 30
          } : {
            id: '',
            name: '',
            finalBid: 0,
            isCompliant: false,
            warrantyMonths: 0,
            maxDeliveryDays: 0
          }}
          rationale="Winner selected based on competitive pricing and compliance with all requirements."
          auctionSummary={{
            totalRounds: auctionStatus?.round || 0,
            totalBids: auctionStatus?.totalBids || 0,
            duration: 0
          }}
          poDetails={{
            poNumber: 'PO-123456',
            buyerName: 'Demo Company',
            buyerEmail: 'procurement@democompany.com',
            vendorName: auctionStatus?.leader?.name || 'Vendor',
            vendorEmail: 'vendor@example.com',
            item: parsedSlots?.item || 'Item',
            quantity: parsedSlots?.quantity || 0,
            unitPrice: auctionStatus?.leader?.bid || 0,
            totalPrice: (auctionStatus?.leader?.bid || 0) * (parsedSlots?.quantity || 0),
            deliveryDays: 30,
            warrantyMonths: 12,
            orderDate: new Date().toLocaleDateString(),
            deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }}
          onGeneratePO={handleGeneratePO}
        />
      )}

      {/* PO Preview */}
      {showPOPreview && (
        <POPreview
          poDetails={{
            poNumber: 'PO-123456',
            buyerName: 'Demo Company',
            buyerEmail: 'procurement@democompany.com',
            vendorName: auctionStatus?.leader?.name || 'Vendor',
            vendorEmail: 'vendor@example.com',
            item: parsedSlots?.item || 'Item',
            quantity: parsedSlots?.quantity || 0,
            unitPrice: auctionStatus?.leader?.bid || 0,
            totalPrice: (auctionStatus?.leader?.bid || 0) * (parsedSlots?.quantity || 0),
            deliveryDays: 30,
            warrantyMonths: 12,
            orderDate: new Date().toLocaleDateString(),
            deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }}
          onClose={() => setShowPOPreview(false)}
        />
      )}

      {/* Pitch Mode Button */}
      <PitchModeButton
        onStartPitchMode={startPitchMode}
        isRunning={isPitchMode}
      />

      {/* Confetti Animation */}
      <ConfettiAnimation isActive={showConfetti} />
    </div>
  );
}