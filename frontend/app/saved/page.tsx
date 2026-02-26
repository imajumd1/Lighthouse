"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import TrendCard from '../../components/TrendCard';
import Link from 'next/link';

export default function SavedTrendsPage() {
  const { trends, bookmarks, user, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in to view saved trends</h2>
          <p className="text-slate-400 mb-8">Create an account or sign in to bookmark trends and build your personal intelligence library.</p>
          <Link 
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const savedTrends = trends.filter(trend => 
    bookmarks.some(b => b.trendId === trend.id && b.userId === user.id)
  );

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Saved Trends
          </motion.h1>
          <p className="text-slate-400">
            Your personal collection of market intelligence.
          </p>
        </div>

        <div className="space-y-4">
          {savedTrends.length > 0 ? (
            savedTrends.map((trend, index) => (
              <TrendCard key={trend.id} trend={trend} index={index} />
            ))
          ) : (
            <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No saved trends yet</h3>
              <p className="text-slate-400 mb-6">Bookmark trends from the feed to save them here.</p>
              <Link 
                href="/"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Browse Trends
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

