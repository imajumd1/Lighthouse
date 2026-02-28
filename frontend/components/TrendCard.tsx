"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trend, Vertical } from '../lib/types';
import { useApp } from '../context/AppContext';
import ShareModal from './ShareModal';

interface TrendCardProps {
  trend: Trend;
  index: number;
}

const TrendCard = ({ trend, index }: TrendCardProps) => {
  const router = useRouter();
  const { verticals, isBookmarked, toggleBookmark, user } = useApp();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const getVertical = (id: string) => verticals.find(v => v.id === id);
  const bookmarked = isBookmarked(trend.id);
  const trendUrl = typeof window !== 'undefined' ? `${window.location.origin}/trends/${trend.id}` : '';

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // Prompt user to log in
      if (confirm('Please sign in to bookmark trends. Would you like to go to the login page?')) {
        router.push('/login');
      }
      return;
    }
    toggleBookmark(trend.id);
  };

  return (
    <>
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        title={trend.title}
        url={trendUrl}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="group relative bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-slate-800/50 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image / Number */}
          <div className="flex-shrink-0">
            <div className="relative w-full md:w-48 h-32 md:h-full min-h-[120px] rounded-xl overflow-hidden bg-slate-800">
              {trend.imageUrl ? (
                <img 
                  src={trend.imageUrl} 
                  alt={trend.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <span className="text-4xl font-bold text-slate-700">#{index + 1}</span>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                <span className="text-xs font-bold text-white">#{index + 1}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <Link href={`/trends/${trend.id}`} className="group-hover:text-blue-400 transition-colors">
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {trend.title}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsShareModalOpen(true);
                    }}
                    className="p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    title="Share"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleBookmarkClick}
                    className={`p-2 rounded-full transition-colors ${
                      bookmarked
                        ? 'text-yellow-400 bg-yellow-400/10'
                        : 'text-slate-500 hover:text-white hover:bg-white/10'
                    }`}
                    title={bookmarked ? "Remove from Saved" : user ? "Save Trend" : "Sign in to Save Trend"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                {trend.justificationSummary}
              </p>
              
              {/* Keywords */}
              {trend.keywords && trend.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {trend.keywords.slice(0, 6).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                  {trend.keywords.length > 6 && (
                    <span className="text-xs text-slate-500 px-2 py-0.5">
                      +{trend.keywords.length - 6}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {trend.affectedVerticals.slice(0, 3).map(vId => {
                const vertical = getVertical(vId);
                if (!vertical) return null;
                return (
                  <span 
                    key={vId} 
                    className={`text-xs px-2.5 py-1 rounded-full font-medium bg-slate-800 text-slate-300 border border-white/5`}
                  >
                    {vertical.name}
                  </span>
                );
              })}
              {trend.affectedVerticals.length > 3 && (
                <span className="text-xs text-slate-500 px-2 py-1">
                  +{trend.affectedVerticals.length - 3} more
                </span>
              )}
              
              <div className="flex-grow" />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TrendCard;

