"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';
import { Trend } from '../../../lib/types';
import Button from '../../../components/ui/Button';
import ShareModal from '../../../components/ShareModal';
import HeatMap from '../../../components/HeatMap';

export default function TrendDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { trends, verticals, isBookmarked, toggleBookmark, user, isLoading } = useApp();
  const [trend, setTrend] = useState<Trend | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const foundTrend = trends.find(t => t.id === id);
      if (foundTrend) {
        setTrend(foundTrend);
      } else {
        // Handle not found
        // router.push('/404'); 
      }
    }
  }, [id, trends, isLoading]);

  if (isLoading || !trend) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const getVertical = (id: string) => verticals.find(v => v.id === id);
  const bookmarked = isBookmarked(trend.id);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const getMomentumColor = (momentum: string) => {
    switch (momentum) {
      case 'Early Signal': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Accelerating': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Mainstream Adoption': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        title={trend.title}
        url={currentUrl}
      />

      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          {trend.imageUrl && (
            <img 
              src={trend.imageUrl} 
              alt={trend.title}
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/"
              className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Feed
            </Link>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getMomentumColor(trend.trendMomentum)}`}>
                {trend.trendMomentum}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {trend.trendCategory}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {trend.timeHorizon}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {trend.headline}
            </h1>
            <p className="text-xl text-slate-300 mb-6 font-light">{trend.title}</p>

            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>{new Date(trend.dateAdded).toLocaleDateString()}</span>
              <span>Source: {trend.author}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Executive Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full" />
                Executive Summary
              </h2>
              <div className="text-lg text-slate-300 leading-relaxed whitespace-pre-line">
                {trend.justificationSummary}
              </div>
            </motion.div>

            {/* Strategic Impact */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full" />
                Strategic Impact
              </h2>
              <div className="text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                {trend.strategicImpact}
              </div>
            </motion.div>

            {/* Market Signals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl"
              >
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Market Validation</h3>
                <p className="text-slate-200 text-sm">{trend.marketValidation}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl"
              >
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Financial Signal</h3>
                <p className="text-slate-200 text-sm">{trend.financialSignal}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl"
              >
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Competitive Intel</h3>
                <p className="text-slate-200 text-sm">{trend.competitiveIntelligence}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl"
              >
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Risk & Governance</h3>
                <p className="text-red-200 text-sm">{trend.riskGovernance}</p>
              </motion.div>
            </div>

            {/* Action Guidance */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-500 rounded-full" />
                What To Do Now
              </h2>
              <p className="text-slate-200 font-medium leading-relaxed">
                {trend.actionGuidance}
              </p>
            </motion.div>

            {/* Deep Dive Toggle */}
            <div className="pt-6 border-t border-white/10">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {showDetails ? 'Hide Deep Dive Analysis' : 'View Deep Dive Analysis'}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className={`w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 space-y-6">
                      <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-3">Context & Analysis</h3>
                        <p className="text-slate-300 leading-relaxed mb-4">{trend.whyTrend}</p>
                        <p className="text-slate-300 leading-relaxed">{trend.analysisDetail}</p>
                      </div>

                      <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5">
                        <h3 className="text-lg font-semibold text-white mb-3">Consulting Leverage</h3>
                        <p className="text-slate-300 leading-relaxed">{trend.howConsultanciesLeverage}</p>
                      </div>
                      
                      {trend.additionalSources && trend.additionalSources.length > 0 && (
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
                          <h4 className="text-sm font-semibold text-white mb-3">Supporting Sources</h4>
                          <ul className="space-y-2">
                            {trend.additionalSources.map(source => (
                              <li key={source.id}>
                                <a 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors group"
                                >
                                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-blue-400 transition-colors" />
                                  <span className="font-medium text-slate-300">{source.title}</span>
                                  <span className="text-slate-500">- {source.publisher}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24"
            >
              {/* Confidence Score */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Confidence Score</h3>
                  <span className="text-2xl font-bold text-white">{trend.confidenceScore}/10</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" 
                    style={{ width: `${trend.confidenceScore * 10}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 italic">{trend.confidenceReasoning}</p>
              </div>

              {/* Heat Map */}
              {trend.heatMapScores && (
                <div className="mb-8">
                  <HeatMap scores={trend.heatMapScores} />
                </div>
              )}

              <h3 className="text-lg font-semibold text-white mb-6">Actions</h3>
              
              <div className="space-y-4">
                {user ? (
                  <Button
                    variant={bookmarked ? "secondary" : "primary"}
                    fullWidth
                    onClick={() => toggleBookmark(trend.id)}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                    {bookmarked ? 'Remove from Saved' : 'Save Trend'}
                  </Button>
                ) : (
                  <Link href="/login" className="block">
                    <Button variant="primary" fullWidth>
                      Sign in to Save
                    </Button>
                  </Link>
                )}

                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center justify-center gap-2"
                >
                  Share Trend
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                </Button>

                <a 
                  href={trend.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
                    Read Original Source
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

