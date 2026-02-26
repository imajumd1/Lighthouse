"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useApp } from '../../../context/AppContext';
import { Trend } from '../../../lib/types';
import Button from '../../../components/ui/Button';
import ShareModal from '../../../components/ShareModal';

export default function TrendDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { trends, verticals, isBookmarked, toggleBookmark, user, isLoading } = useApp();
  const [trend, setTrend] = useState<Trend | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

            <div className="flex flex-wrap gap-2 mb-4">
              {trend.affectedVerticals.map(vId => {
                const vertical = getVertical(vId);
                if (!vertical) return null;
                return (
                  <span 
                    key={vId} 
                    className={`text-xs px-3 py-1 rounded-full font-medium bg-blue-500/20 text-blue-200 border border-blue-500/30 backdrop-blur-sm`}
                  >
                    {vertical.name}
                  </span>
                );
              })}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {trend.title}
            </h1>

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
            {/* Justification Summary */}
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
              <p className="text-lg text-slate-300 leading-relaxed">
                {trend.justificationSummary}
              </p>
            </motion.div>

            {/* Why It's a Trend */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full" />
                Why It's a Trend
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {trend.whyTrend}
              </p>
            </motion.div>

            {/* How Consultancies Leverage */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-pink-500 rounded-full" />
                Consulting Leverage
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {trend.howConsultanciesLeverage}
              </p>
            </motion.div>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24"
            >
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

