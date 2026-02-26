"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trend, Vertical } from '../lib/types';
import { useApp } from '../context/AppContext';

interface TrendCardProps {
  trend: Trend;
  index: number;
}

const TrendCard = ({ trend, index }: TrendCardProps) => {
  const { verticals, isBookmarked, toggleBookmark, user } = useApp();
  
  const getVertical = (id: string) => verticals.find(v => v.id === id);
  const bookmarked = isBookmarked(trend.id);

  return (
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
              
              {user && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleBookmark(trend.id);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    bookmarked 
                      ? 'text-yellow-400 bg-yellow-400/10' 
                      : 'text-slate-500 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                </button>
              )}
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
              {trend.justificationSummary}
            </p>
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
            
            <span className="text-xs text-slate-500">
              {new Date(trend.dateAdded).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendCard;

