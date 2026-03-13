"use client";

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import TrendCard from '../components/TrendCard';
import TrendFilters from '../components/TrendFilters';
import RiskOpportunityIndex from '../components/RiskOpportunityIndex';
import { motion } from 'framer-motion';

export default function Home() {
  const { trends, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const filteredTrends = useMemo(() => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    return trends.filter(trend => {
      // Filter by status (only current)
      if (trend.status !== 'current') return false;

      // Filter out articles older than 2 years
      const articleDate = new Date(trend.dateAdded);
      if (articleDate < twoYearsAgo) return false;

      // Filter by selected month
      if (selectedMonth) {
        const trendDate = new Date(trend.dateAdded);
        const trendMonthKey = `${trendDate.getFullYear()}-${String(trendDate.getMonth() + 1).padStart(2, '0')}`;
        if (trendMonthKey !== selectedMonth) return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = trend.title.toLowerCase().includes(query);
        const matchesSummary = trend.justificationSummary.toLowerCase().includes(query);
        const matchesKeywords = trend.keywords?.some(keyword =>
          keyword.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesSummary && !matchesKeywords) return false;
      }

      // Filter by vertical
      if (selectedVertical) {
        if (!trend.affectedVerticals.includes(selectedVertical)) return false;
      }

      return true;
    });
  }, [trends, searchQuery, selectedVertical, selectedMonth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Analyzing Curated News Sources
            </h3>
            <p className="text-slate-400 mb-4">
              Scraping 54 premium AI sources and analyzing trends with OpenAI...
            </p>
            <p className="text-sm text-slate-500">
              This may take 1-2 minutes
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4 tracking-tight"
          >
            Top Ten AI Trends
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Curated market intelligence for consulting leaders. Stay ahead of the curve with our weekly analysis of the most impactful AI developments.
          </motion.p>
        </div>

        {/* Risk & Opportunity Index */}
        <RiskOpportunityIndex trends={trends.filter(t => t.status === 'current')} />

        {/* Filters */}
        <TrendFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedVertical={selectedVertical}
          setSelectedVertical={setSelectedVertical}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          trends={trends.filter(t => t.status === 'current')}
        />

        {/* Trends Grid */}
        <div className="space-y-4">
          {filteredTrends.length > 0 ? (
            filteredTrends.map((trend, index) => (
              <TrendCard key={trend.id} trend={trend} index={index} />
            ))
          ) : (
            <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No trends found</h3>
              <p className="text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedVertical(null);
                  setSelectedMonth(null);
                }}
                className="mt-6 text-blue-400 hover:text-blue-300 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

