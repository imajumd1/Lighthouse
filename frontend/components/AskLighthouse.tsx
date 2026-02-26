"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import Button from './ui/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Mock Knowledge Base for General Strategic Questions
const KNOWLEDGE_BASE = [
  {
    keywords: ['saas', 'software', 'doomed', 'seat-based'],
    response: "**Executive Perspective:** SaaS isn't doomed, but the *seat-based pricing model* is facing an existential threat. \n\nWe are witnessing a shift toward **Service-as-Software** (outcome-based pricing). \n\n1. **The Shift:** Legacy SaaS apps that merely add AI as a 'copilot' feature will struggle against AI-native apps that replace entire workflows.\n2. **Financial Impact:** Expect margin compression in horizontal SaaS (CRM, HRIS) as AI features become commoditized.\n3. **Opportunity:** Vertical AI agents that own the 'execution layer' will command premium valuations."
  },
  {
    keywords: ['agent', 'autonomous', 'future', 'next big thing'],
    response: "**Trend Analysis:** Autonomous agents represent the next major platform shift after Mobile and Cloud.\n\n**Projection:** By 2025, we project 40% of enterprise software interactions will be non-human (agent-to-agent).\n\n**Strategic Imperative:** Your immediate priority should be building 'agent-ready' APIs. If your data isn't accessible to agents, your application becomes invisible in the new stack."
  },
  {
    keywords: ['gpu', 'compute', 'nvidia', 'infrastructure', 'cost'],
    response: "**Infrastructure Outlook:** While GPU scarcity is stabilizing, *inference costs* are becoming the new bottleneck for scaling AI.\n\n**Recommendation:** Do not rely solely on frontier models (like GPT-4) for all tasks. Adopt a **tiered model strategy**:\n- Use Frontier Models for complex reasoning.\n- Use SLMs (Small Language Models) for routine, high-volume tasks to protect margins."
  },
  {
    keywords: ['regulation', 'law', 'eu ai act', 'compliance'],
    response: "**Regulatory Landscape:** The era of self-regulation is over. The EU AI Act is setting the global standard (the 'Brussels Effect').\n\n**Risk:** The biggest exposure for enterprises isn't fines, but **reputational damage** and **forced model deletion** if data lineage cannot be proven. \n\n**Action:** Implement a 'Model Bill of Materials' (MBOM) for every AI deployment immediately."
  },
  {
    keywords: ['job', 'workforce', 'replace', 'hiring'],
    response: "**Workforce Transformation:** AI is not replacing jobs; it is replacing *tasks*. \n\n**Impact:** We are seeing a 'hollowing out' of mid-level cognitive tasks (data entry, basic analysis, tier-1 support). \n\n**Strategy:** Reallocate headcount budget from execution roles to **oversight and orchestration** roles. The most valuable employee skill in 2025 will be 'AI Literacy' and 'Prompt Engineering'."
  },
  {
    keywords: ['build', 'buy', 'vendor'],
    response: "**Build vs. Buy Strategy:**\n\n- **BUY** for commodity capabilities (email drafting, meeting summaries, basic code gen). The vendor market is moving too fast to compete.\n- **BUILD** (or fine-tune) for core differentiation where you have proprietary data that no competitor can access.\n\n**Warning:** Avoid building 'wrappers' around public APIs that offer no defensible moat."
  }
];

const AskLighthouse = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello. I am your Lighthouse AI analyst. I can help you synthesize market trends, assess strategic risks, or answer questions like "Are SaaS companies doomed?"',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { trends } = useApp();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const generateResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // 1. Check Context: Are we on a specific trend page?
    const trendIdMatch = pathname?.match(/\/trends\/(.+)/);
    const currentTrendId = trendIdMatch ? trendIdMatch[1] : null;
    const currentTrend = currentTrendId ? trends.find(t => t.id === currentTrendId) : null;

    if (currentTrend) {
      if (lowerQuery.includes('cost') || lowerQuery.includes('price') || lowerQuery.includes('budget') || lowerQuery.includes('financial')) {
        return `**Financial Impact Analysis for ${currentTrend.title}:**\n\n${currentTrend.financialSignal}\n\n**Strategic Impact:**\n${currentTrend.strategicImpact}`;
      }
      if (lowerQuery.includes('risk') || lowerQuery.includes('danger') || lowerQuery.includes('compliance') || lowerQuery.includes('governance')) {
        return `**Risk Assessment for ${currentTrend.title}:**\n\n${currentTrend.riskGovernance}\n\n**Regulatory Friction Score:** ${currentTrend.heatMapScores?.regulatoryFriction}/10`;
      }
      if (lowerQuery.includes('competitor') || lowerQuery.includes('who') || lowerQuery.includes('market') || lowerQuery.includes('player')) {
        return `**Competitive Landscape:**\n\n${currentTrend.competitiveIntelligence}\n\n**Market Validation:**\n${currentTrend.marketValidation}`;
      }
      // Default trend context response
      return `**Strategic Analysis of ${currentTrend.headline}:**\n\nThis trend is currently in the **${currentTrend.timeHorizon}** horizon with a confidence score of **${currentTrend.confidenceScore}/10**.\n\n**Why it matters:** ${currentTrend.whyTrend}\n\n**Recommendation:** ${currentTrend.actionGuidance}`;
    }

    // 2. Check Knowledge Base for General Strategic Questions
    for (const entry of KNOWLEDGE_BASE) {
      if (entry.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return entry.response;
      }
    }

    // 3. General Trend/Market Queries
    if (lowerQuery.includes('trend') || lowerQuery.includes('hot') || lowerQuery.includes('new')) {
      return "Based on our real-time index, **Generative AI in Regulatory Compliance** and **AI in Media Content Creation** are showing the highest momentum this week. Both are rated 'Accelerating' with strong capital backing.";
    }
    
    // 4. Fallback for unknown queries
    return "That is a nuanced strategic question. While I don't have a specific pre-trained answer for that exact phrase, I can tell you that **data sovereignty** and **model governance** are the two most critical themes across all our current intelligence. \n\nWould you like me to analyze the impact of these themes on a specific vertical like Healthcare or Finance?";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time (randomized for realism)
    const delay = Math.floor(Math.random() * 1000) + 1000; // 1-2 seconds
    
    setTimeout(() => {
      const responseText = generateResponse(userMsg.content);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center text-white border border-white/10"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Lighthouse AI</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-slate-900">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a strategic question..."
                  className="w-full bg-slate-800 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </button>
              </form>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button 
                  onClick={() => setInputValue("Are SaaS companies doomed?")}
                  className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-slate-400 hover:text-white transition-colors border border-white/5"
                >
                  SaaS Future
                </button>
                <button 
                  onClick={() => setInputValue("What is the risk of AI agents?")}
                  className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-slate-400 hover:text-white transition-colors border border-white/5"
                >
                  Agent Risk
                </button>
                <button 
                  onClick={() => setInputValue("Build vs Buy AI?")}
                  className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-slate-400 hover:text-white transition-colors border border-white/5"
                >
                  Build vs Buy
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AskLighthouse;

