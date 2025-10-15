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
import LandingPage from '../components/LandingPage';
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
  const [showLanding, setShowLanding] = useState(true);
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
  const [isAuctionDiscussionMode, setIsAuctionDiscussionMode] = useState(false);
  
  const auctionRef = useRef<NodeJS.Timeout | null>(null);
  const commentaryRef = useRef<NodeJS.Timeout | null>(null);
  // Snapshot of previous state to generate event-driven commentary
  const prevSnapshotRef = useRef<{ bids: Record<string, number>; compliance: Record<string, boolean>; leaderId?: string } | null>(null);
  // Control end-of-auction side-effects
  const endModalTimeoutRef = useRef<number | NodeJS.Timeout | null>(null);
  const confettiOffTimeoutRef = useRef<number | NodeJS.Timeout | null>(null);
  const endTriggeredRef = useRef<boolean>(false);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (auctionRef.current) clearInterval(auctionRef.current);
      if (commentaryRef.current) clearInterval(commentaryRef.current);
    };
  }, []);

  const handleStartChat = (text?: string) => {
    // Check if user has email access
    const userEmail = localStorage.getItem('procurvv-user-email');
    if (userEmail) {
      // User has email access, redirect to dedicated chat interface
      window.location.href = `/chat?email=${encodeURIComponent(userEmail)}`;
      return;
    }
    
    // Fallback to original behavior for users without email
    setShowLanding(false);
    if (text) {
      // If text is provided, send it as a message
      setTimeout(() => {
        handleSendMessage(text);
      }, 100);
    }
  };

  const addMessage = (text: string, isUser: boolean, isTyping = false) => {
    const uniqueId = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
      ? (crypto as any).randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const message: Message = {
      id: uniqueId,
      text,
      isUser,
      timestamp: new Date(),
      isTyping
    };
    setMessages(prev => [...prev, message]);
    return message.id;
  };

  const handleSendMessage = async (text: string) => {
    // Check for reset keywords
    const resetKeywords = ['new auction', 'start new', 'new procurement', 'reset', 'start over', 'begin again'];
    const isResetRequest = resetKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    if (isResetRequest) {
      // Reset to initial state
      setMessages([]);
      setParsedSlots(null);
      setAuctionStatus(null);
      setAuctionId(null);
      setIsAuctionDiscussionMode(false);
      setShowResults(false);
      setShowPOPreview(false);
      setShowConfetti(false);
      setIsPitchMode(false);
      setCurrentCommentary('');
      setIsCommentaryTyping(false);
      
      // Clear any pending timeouts
      if (auctionRef.current) clearInterval(auctionRef.current);
      if (commentaryRef.current) clearTimeout(commentaryRef.current);
      if (endModalTimeoutRef.current) clearTimeout(endModalTimeoutRef.current as number);
      if (confettiOffTimeoutRef.current) clearTimeout(confettiOffTimeoutRef.current as number);
      
      // Add reset confirmation message
      addMessage("Great! Let's start fresh. What would you like to procure today? Please tell me about your procurement needs - what items, quantity, budget, and delivery timeline you're looking for.", false);
      return;
    }
    
    // Add user message
    addMessage(text, true);
    
    // If we have auction results, we're in discussion mode
    if (auctionStatus && !isAuctionDiscussionMode) {
      setIsAuctionDiscussionMode(true);
    }
    
    // Add typing indicator
    const typingId = addMessage('', false, true);
    
    try {
      // If user is asking for reasoning during/after auction, call summarize endpoint
      const wantsReason = /why|winner|chosen|reason|explain|how select/i.test(text) && (auctionStatus !== null);
      if (wantsReason && auctionStatus) {
        const topBids = (auctionStatus.vendors || [])
          .map(v => ({ vendor: v.name, price: v.currentBid, compliant: v.isCompliant }))
          .sort((a,b) => a.price - b.price)
          .slice(0, 5);
        const leaderVendor = auctionStatus.leader ? auctionStatus.vendors.find(v => v.id === auctionStatus.leader!.id) : undefined;
        const sorted = [...(auctionStatus.vendors || [])].sort((a,b) => a.currentBid - b.currentBid);
        const leader = sorted[0] ? { vendor: sorted[0].name, price: sorted[0].currentBid, compliant: sorted[0].isCompliant } : undefined;
        const runnerUp = sorted[1] ? { vendor: sorted[1].name, price: sorted[1].currentBid, compliant: sorted[1].isCompliant } : undefined;
        const priceGap = leader && runnerUp ? (runnerUp.price - leader.price).toFixed(2) : undefined;
        const complianceNotes = leader && runnerUp ? (leader.compliant && !runnerUp.compliant ? `${leader.vendor} has compliance advantage.` : (runnerUp.compliant && !leader.compliant ? `${runnerUp.vendor} is compliant while leader is not.` : 'No clear compliance advantage.')) : 'N/A';
        const sumResp = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ round: auctionStatus.round, topBids, leader, runnerUp, priceGap, complianceNotes, context: 'User asked: ' + text })
        });
        const sumData = await sumResp.json();
        setMessages(prev => prev.filter(m => m.id !== typingId));
        addMessage(sumData.summary || 'Here is a brief explanation based on current bids and compliance.', false);
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, contextSlots: parsedSlots })
      });
      
      const data = await response.json();
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== typingId));
      
      // Add AI response
      addMessage(data.message, false);
      
      // Persist any extracted slots (even during clarification steps)
      if (data.slots) {
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
      // Read uploaded suppliers if any
      let uploadedVendors: any[] | undefined = undefined;
      try {
        const raw = localStorage.getItem('procurv-uploaded-suppliers');
        if (raw) uploadedVendors = JSON.parse(raw);
      } catch {}

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
        body: JSON.stringify({ auctionId, vendors: uploadedVendors })
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
        if (!response.ok) {
          // If the function cold-started and lost state, skip this tick gracefully
          console.warn('auctionStatus not ok:', response.status);
          return;
        }
        const status = await response.json();

        // Guard against unexpected shapes
        if (!status || !Array.isArray(status.vendors)) {
          console.warn('auctionStatus missing vendors; skipping update');
          return;
        }

        setAuctionStatus(status);

        // Generate commentary
        if (status.leader && status.vendors.length > 0) {
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
    const prev = prevSnapshotRef.current;
    const bids: Record<string, number> = {};
    const compliance: Record<string, boolean> = {};
    status.vendors.forEach(v => { bids[v.id] = v.currentBid; compliance[v.id] = v.isCompliant; });

    let message = '';
    const leaderId = status.leader?.id;

    // Leader change
    if (leaderId && prev?.leaderId && leaderId !== prev.leaderId) {
      const newLeader = status.vendors.find(v => v.id === leaderId)!;
      message = `${newLeader.name} takes the lead at $${newLeader.currentBid.toFixed(2)}!`;
    }

    // Biggest price drop since last tick
    if (!message && prev) {
      let biggestDropVendor: string | null = null;
      let biggestDrop = 0;
      status.vendors.forEach(v => {
        const prevBid = prev.bids[v.id];
        if (prevBid !== undefined) {
          const drop = prevBid - v.currentBid;
          if (drop > biggestDrop + 0.009) {
            biggestDrop = drop;
            biggestDropVendor = v.name;
          }
        }
      });
      if (biggestDropVendor) {
        const leader = status.leader!;
        message = `${biggestDropVendor} drops $${biggestDrop.toFixed(2)}. ${leader.name} leads at $${leader.bid.toFixed(2)}.`;
      }
    }

    // Compliance advantage at same price
    if (!message && leaderId) {
      const leader = status.vendors.find(v => v.id === leaderId)!;
      const challenger = status.vendors
        .filter(v => v.id !== leaderId && Math.abs(v.currentBid - leader.currentBid) < 0.01)
        .find(v => v.isCompliant && !leader.isCompliant);
      if (challenger) {
        message = `${challenger.name} matches price and is more compliant — pressure on ${leader.name}!`;
      }
    }

    // Fallback generic
    if (!message) {
      const runnerUp = status.vendors
        .filter(v => v.id !== leaderId)
        .sort((a, b) => a.currentBid - b.currentBid)[0];
      message = generateCommentary(
        status.round,
        status.leader?.name || 'Leader',
        status.leader?.bid || 0,
        runnerUp?.name,
        runnerUp?.currentBid
      );
    }

    prevSnapshotRef.current = { bids, compliance, leaderId };

    setIsCommentaryTyping(true);
    setCurrentCommentary('');
    setTimeout(() => {
      setIsCommentaryTyping(false);
      setCurrentCommentary(message);
    }, 350);
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

  // Show landing page initially
  if (showLanding) {
    return <LandingPage onStartChat={handleStartChat} />;
  }

  return (
    <div className="min-h-screen bg-procurvv-dark-bg text-procurvv-dark-text">
      {/* Header */}
      <div className="bg-procurvv-dark-bg border-b border-procurvv-dark-border p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-procurvv-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-2xl font-bold text-procurvv-dark-text">
              Procurv
            </h1>
          </a>
          <div className="flex items-center space-x-6">
            <a href="/" className="text-procurvv-dark-muted hover:text-procurvv-dark-text transition-colors">← Back to Home</a>
            <a href="/features" className="text-procurvv-dark-muted hover:text-procurvv-dark-text transition-colors">Features</a>
            <a href="/how-it-works" className="text-procurvv-dark-muted hover:text-procurvv-dark-text transition-colors">How it works</a>
            <a href="/customers" className="text-procurvv-dark-muted hover:text-procurvv-dark-text transition-colors">Customers</a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Parsed Summary */}
        {parsedSlots && (
          <ParsedSummaryCard
            slots={parsedSlots}
            onStartAuction={handleStartAuction}
            isLoading={isLoading}
          />
        )}

        {/* Chat – keep pre-auction conversation ABOVE auction widgets */}
        <div className="mt-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-procurvv-dark-text mb-4">
              {isAuctionDiscussionMode ? 'Discuss the Results' : 'Chat with Procurement Assistant'}
            </h2>
            <p className="text-procurvv-dark-muted text-sm">
              {isAuctionDiscussionMode 
                ? 'Ask questions about the auction results, winner selection, or procurement details. Say "new auction" to start fresh.' 
                : 'Describe your procurement needs to get started.'}
            </p>
          </div>
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
          <ChatBox
            onSendMessage={handleSendMessage}
            disabled={isLoading || isPitchMode}
            placeholder={isAuctionDiscussionMode 
              ? "Ask about the auction results... (e.g., 'Why was this vendor selected?', 'What are their conditions?')" 
              : "Describe your procurement needs... (e.g., 'I need 100 ergonomic chairs under $120 each, delivered in 30 days')"}
          />
        </div>

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
                    if (endTriggeredRef.current) return; // avoid double-trigger
                    endTriggeredRef.current = true;
                    setShowConfetti(true);
                    endModalTimeoutRef.current = window.setTimeout(() => setShowResults(true), 1000);
                    // Turn off confetti after 3 seconds
                    confettiOffTimeoutRef.current = window.setTimeout(() => setShowConfetti(false), 3000);
                  }}
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT SIDE - Vendor List (Live Bid Table) */}
              <div>
                <VendorList
                  vendors={auctionStatus.vendors}
                  leaderId={auctionStatus.leader?.id}
                />
              </div>
              
              {/* RIGHT SIDE - AI Commentary Box */}
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

        {/* Post-auction discussion input at the bottom when auction ends */}
        {auctionStatus && auctionStatus.status === 'ended' && (
          <div className="mt-8">
            <ChatBox
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              placeholder="Ask about the auction results... (e.g., 'Why was this vendor selected?')"
            />
          </div>
        )}
      </div>

      {/* Results Modal */}
      {showResults && (
        <ResultsModal
          isOpen={showResults}
          onClose={() => {
            setShowResults(false);
            setShowConfetti(false);
            // Ensure user can continue chatting after results
            setIsPitchMode(false);
            // Clear any pending timers that could re-open the modal or re-trigger confetti
            if (endModalTimeoutRef.current) {
              clearTimeout(endModalTimeoutRef.current as number);
              endModalTimeoutRef.current = null;
            }
            if (confettiOffTimeoutRef.current) {
              clearTimeout(confettiOffTimeoutRef.current as number);
              confettiOffTimeoutRef.current = null;
            }
            endTriggeredRef.current = true;
          }}
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