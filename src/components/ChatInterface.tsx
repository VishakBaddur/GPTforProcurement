'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ChatBox from './ChatBox';
import MessageBubble from './MessageBubble';
import ParsedSummaryCard from './ParsedSummaryCard';
import VendorList from './VendorList';
import CommentaryBox from './CommentaryBox';
import BiddingFeed from './BiddingFeed';
import ResultsModal from './ResultsModal';
import POPreview from './POPreview';
import CountdownTimer from './CountdownTimer';
import ConfettiAnimation from './ConfettiAnimation';
import { ParsedSlots } from '../utils/parseRequest';
import { generateCommentary } from '../utils/commentaryTemplates';

interface ChatInterfaceProps {
  userEmail: string;
}

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
  startedAt?: string;
  endsAt?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  auctionId?: string;
  parsedSlots?: ParsedSlots;
}

export default function ChatInterface({ userEmail }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [parsedSlots, setParsedSlots] = useState<ParsedSlots | null>(null);
  const [auctionId, setAuctionId] = useState<string | null>(null);
  const [auctionStatus, setAuctionStatus] = useState<AuctionStatus | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showPOPreview, setShowPOPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCommentary, setCurrentCommentary] = useState('');
  const [isCommentaryTyping, setIsCommentaryTyping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAuctionDiscussionMode, setIsAuctionDiscussionMode] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const auctionRef = useRef<NodeJS.Timeout | null>(null);
  const commentaryRef = useRef<NodeJS.Timeout | null>(null);
  const prevSnapshotRef = useRef<{ bids: Record<string, number>; compliance: Record<string, boolean>; leaderId?: string } | null>(null);
  const endModalTimeoutRef = useRef<number | NodeJS.Timeout | null>(null);
  const confettiOffTimeoutRef = useRef<number | NodeJS.Timeout | null>(null);
  const endTriggeredRef = useRef<boolean>(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('procurvv-chat-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (auctionRef.current) clearInterval(auctionRef.current);
      if (commentaryRef.current) clearTimeout(commentaryRef.current);
    };
  }, []);

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

  const generateChatTitle = (messages: Message[]): string => {
    // Find the first user message to use as title
    const firstUserMessage = messages.find(m => m.isUser && !m.isTyping);
    if (firstUserMessage) {
      // Truncate if too long
      return firstUserMessage.text.length > 50 
        ? firstUserMessage.text.substring(0, 50) + '...'
        : firstUserMessage.text;
    }
    return 'New Chat';
  };

  const saveCurrentChat = () => {
    if (messages.length > 0) {
      const sessionId = currentSessionId || Date.now().toString();
      const title = generateChatTitle(messages);
      
      const chatSession: ChatSession = {
        id: sessionId,
        title,
        messages: [...messages],
        timestamp: new Date(),
        auctionId: auctionId || undefined,
        parsedSlots: parsedSlots || undefined
      };

      setChatHistory(prev => {
        // Remove existing session if it exists
        const filtered = prev.filter(session => session.id !== sessionId);
        // Add new session at the beginning
        return [chatSession, ...filtered].slice(0, 10); // Keep only last 10 sessions
      });

      // Store in localStorage
      const updatedHistory = [chatSession, ...chatHistory.filter(s => s.id !== sessionId)].slice(0, 10);
      localStorage.setItem('procurvv-chat-history', JSON.stringify(updatedHistory));
    }
  };

  const loadChatSession = (sessionId: string) => {
    const session = chatHistory.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
      setParsedSlots(session.parsedSlots || null);
      setAuctionId(session.auctionId || null);
      
      // If there was an auction, try to restore auction status
      if (session.auctionId) {
        // Note: In a real app, you'd fetch the auction status from the server
        console.log('Restoring auction session:', session.auctionId);
      }
    }
  };

  const startNewSession = () => {
    // Save current chat before starting new one
    saveCurrentChat();
    
    // Generate new session ID
    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    
    // Reset everything
    setMessages([]);
    setParsedSlots(null);
    setAuctionStatus(null);
    setAuctionId(null);
    setIsAuctionDiscussionMode(false);
    setShowResults(false);
    setShowPOPreview(false);
    setShowConfetti(false);
    setCurrentCommentary('');
    setIsCommentaryTyping(false);
    
    // Clear any pending timeouts
    if (auctionRef.current) clearInterval(auctionRef.current);
    if (commentaryRef.current) clearTimeout(commentaryRef.current);
    if (endModalTimeoutRef.current) clearTimeout(endModalTimeoutRef.current as number);
    if (confettiOffTimeoutRef.current) clearTimeout(confettiOffTimeoutRef.current as number);
    
    // Add welcome message
    addMessage("Hello! I'm your Procurv Sourcing Agent. What would you like to procure today? Please tell me about your procurement needs - what items, quantity, budget, and delivery timeline you're looking for.", false);
  };

  const handleNewChat = () => {
    startNewSession();
  };

  const handleSendMessage = async (text: string) => {
    // Check for reset keywords
    const resetKeywords = ['new auction', 'new chat', 'start new', 'new procurement', 'reset', 'start over', 'begin again'];
    const isResetRequest = resetKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    if (isResetRequest) {
      startNewSession();
      return;
    }
    
    // Check for start auction keywords
    const startAuctionKeywords = ['start auction', 'begin auction', 'launch auction', 'start the auction', 'begin the auction'];
    const isStartAuctionRequest = startAuctionKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    // Add user message
    addMessage(text, true);
    
    // If user wants to start auction and we have parsed slots, start it
    if (isStartAuctionRequest && parsedSlots && !auctionStatus) {
      await handleStartAuction();
      return;
    }
    
    // If we have auction results, we're in discussion mode
    if (auctionStatus && !isAuctionDiscussionMode) {
      setIsAuctionDiscussionMode(true);
    }
    
    // Check if this is a reasoning question (post-auction)
    const reasoningKeywords = ['why', 'how', 'explain', 'reason', 'justify', 'decision', 'chosen', 'selected', 'winner', 'result'];
    const isReasoningQuestion = reasoningKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    // Add typing indicator
    const typingId = addMessage('', false, true);
    
    try {
      let response;
      
      console.log('Sending message:', text, 'Reasoning question:', isReasoningQuestion, 'Auction status:', !!auctionStatus);
      
    // Route post-auction (or during auction) questions to /api/summarize for richer context.
    // We use it either when it's a reasoning question OR whenever an auction is active.
    if ((isReasoningQuestion || auctionStatus) && auctionStatus && auctionStatus.leader) {
      const sortedVendors = auctionStatus.vendors.sort((a, b) => a.currentBid - b.currentBid);
        const runnerUp = sortedVendors.find(v => v.id !== auctionStatus.leader?.id);
        
        response = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            round: auctionStatus.round,
            leader: {
              vendor: auctionStatus.leader.name,
              price: auctionStatus.leader.bid,
              compliant: auctionStatus.leader.isCompliant
            },
            runnerUp: runnerUp ? {
              vendor: runnerUp.name,
              price: runnerUp.currentBid,
              compliant: runnerUp.isCompliant
            } : null,
            priceGap: runnerUp ? runnerUp.currentBid - auctionStatus.leader.bid : 0,
            topBids: sortedVendors.slice(0, 5).map(v => ({
              vendor: v.name,
              price: v.currentBid,
              compliant: v.isCompliant
            })),
            context: text,
            history: messages.slice(-10).map(m => ({ role: m.isUser ? 'user' : 'assistant', content: m.text })),
            complianceNotes: sortedVendors.filter(v => v.isCompliant).length > 0 ? 
              `${sortedVendors.filter(v => v.isCompliant).length} compliant vendors` : 'No compliance issues'
          })
        });
      } else {
        // Regular chat for pre-auction or non-reasoning questions
        console.log('Calling /api/chat with:', { text, contextSlots: parsedSlots });
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, contextSlots: parsedSlots })
        });
        console.log('Response status:', response.status);
      }
      
      const data = await response.json();
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== typingId));
      
      // Add AI response
      addMessage(data.message, false);
      
      // Persist any extracted slots, even during clarification
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
          console.warn('auctionStatus not ok:', response.status);
          return;
        }
        const status = await response.json();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleFeedbackSubmit = () => {
    console.log('Feedback submitted:', { email: userEmail, feedback: feedbackText });
    alert('Thank you for your feedback! We\'ll review it and get back to you.');
    setShowFeedbackModal(false);
    setFeedbackText('');
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col p-4 shadow-sm sticky top-0 md:static z-40">
        <div className="flex items-center mb-6">
          <a 
            href="/" 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-2">
              <span className="font-bold text-white text-lg">P</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Procurv</h1>
          </a>
          <button className="ml-auto p-2 rounded-md hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <button 
          onClick={handleNewChat}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center mb-6 hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New chat
        </button>

        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent chats</h2>
          <ul className="space-y-2">
            {chatHistory.length > 0 ? (
              chatHistory.slice(0, 5).map((session) => (
                <li key={session.id}>
                  <button
                    onClick={() => loadChatSession(session.id)}
                    className={`block text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 p-2 rounded-md transition-colors w-full text-left ${
                      currentSessionId === session.id ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    {session.title}
                  </button>
                </li>
              ))
            ) : (
              <li>
                <span className="block text-sm text-gray-500 p-2">
                  No recent chats
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="mb-4">
          <a href="#" className="block text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 p-2 rounded-md transition-colors">
            Create new agent <span className="text-xs text-gray-400 ml-1">Coming soon</span>
          </a>
          <a href="#" className="block text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-100 p-2 rounded-md transition-colors">
            Manage agents <span className="text-xs text-gray-400 ml-1">Coming soon</span>
          </a>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200">
          {/* Feedback Button */}
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center mb-4 hover:bg-gray-200 transition-colors text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Add Feedback
          </button>

          <div className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="font-bold text-white text-sm">{userEmail.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{userEmail}</p>
              <p className="text-xs text-gray-500">Procurv User</p>
            </div>
            <button className="ml-auto p-1 rounded-md hover:bg-gray-200">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 md:p-8">
        <div className="absolute top-4 right-4">
          <Link href="/upgrade" className="text-sm text-blue-600 hover:underline">
            Free plan • <span className="font-medium">Upgrade</span>
          </Link>
        </div>

        {/* Welcome Section - Only show when no messages and no auction */}
        {messages.length === 0 && !auctionStatus && !parsedSlots && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Hello, Welcome to</h2>
              <h1 className="text-6xl font-extrabold text-blue-700">Procurv Reverse Auction Agent</h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-4 mb-8"
            >
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center mb-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="How can I help you today?"
                    className="flex-1 px-4 py-3 text-lg bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                  <div className="flex items-center space-x-2 mr-4">
                    <button 
                      type="button" 
                      onClick={() => {
                        // Add new item/option functionality
                        console.log('Add new item clicked');
                        alert('Add new item feature coming soon!');
                      }}
                      className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                      title="Add new item"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        // File attachment functionality
                        console.log('File attachment clicked');
                        alert('File attachment feature coming soon!');
                      }}
                      className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                      title="Attach file"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        // Chat history functionality
                        console.log('Chat history clicked');
                        if (chatHistory.length > 0) {
                          alert(`You have ${chatHistory.length} recent chats. Click on them in the left sidebar to load.`);
                        } else {
                          alert('No chat history yet. Start a conversation to see your chat history here!');
                        }
                      }}
                      className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
                      title="Chat history"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Procurv Beta 1.2</span>
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full max-w-3xl mx-auto text-center"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Try these examples</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleExampleClick("Find supplies for 500 laptops under $800 each")}
                  className="bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  Find supplies for 500 laptops under $800 each
                </button>
                <button 
                  onClick={() => handleExampleClick("Analyse Q3 spend across all categories")}
                  className="bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  Analyse Q3 spend across all categories
                </button>
                <button 
                  onClick={() => handleExampleClick("Source custom metal fabrication for auto motive parts")}
                  className="bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  Source custom metal fabrication for auto motive parts
                </button>
                <button 
                  onClick={() => handleExampleClick("Run compliance checks on 10 suppliers")}
                  className="bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  Run compliance checks on 10 suppliers
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* Main Content Area - Integrated Chat and Auction Experience */}
        <div className="max-w-4xl mx-auto">
          {/* Pre-Auction Chat Messages - Show above auction widgets */}
          {messages.length > 0 && !auctionStatus && (
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
            </div>
          )}

          {/* Parsed Summary */}
          {parsedSlots && (
            <div className="mb-8">
              <ParsedSummaryCard
                slots={parsedSlots}
                onStartAuction={handleStartAuction}
                isLoading={isLoading}
              />
            </div>
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
                      if (endTriggeredRef.current) return;
                      endTriggeredRef.current = true;
                      setShowConfetti(true);
                      endModalTimeoutRef.current = window.setTimeout(() => setShowResults(true), 1000);
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
            <div className="mb-8">
              <BiddingFeed events={auctionStatus.events} />
            </div>
          )}

          {/* Post-Auction Chat Messages - Show below auction widgets */}
          {messages.length > 0 && auctionStatus && (
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
            </div>
          )}

          {/* Always show chat input */}
          <div className="mb-12">
            <ChatBox
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              placeholder={isAuctionDiscussionMode 
                ? "Ask about the auction results... (e.g., 'Why was this vendor selected?', 'What are their conditions?')" 
                : "Describe your procurement needs or upload a supplier CSV (paperclip icon)"}
            />
          </div>
        </div>

        {/* Results Modal */}
        {showResults && (
          <ResultsModal
            isOpen={showResults}
            onClose={() => {
              setShowResults(false);
              setShowConfetti(false);
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

        {/* Confetti Animation */}
        <ConfettiAnimation isActive={showConfetti} />

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Send Feedback</h3>
              <p className="text-gray-700 mb-4">We'd love to hear your thoughts! (Email: {userEmail})</p>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
                rows={4}
                placeholder="Enter your feedback here..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
