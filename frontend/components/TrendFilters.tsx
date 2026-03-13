"use client";

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

interface TrendFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedVertical: string | null;
  setSelectedVertical: (verticalId: string | null) => void;
  selectedMonth: string | null;
  setSelectedMonth: (month: string | null) => void;
  trends: any[];
}

const TrendFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedVertical, 
  setSelectedVertical,
  selectedMonth,
  setSelectedMonth
}: TrendFiltersProps) => {
  const { trends } = useApp();
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Extract all unique keywords from trends
  const allKeywords = useMemo(() => {
    const keywordSet = new Set<string>();
    trends.forEach(trend => {
      if (trend.keywords && Array.isArray(trend.keywords)) {
        trend.keywords.forEach(keyword => keywordSet.add(keyword.toLowerCase()));
      }
    });
    return Array.from(keywordSet).sort();
  }, [trends]);

  // Filter keywords based on search query
  const suggestedKeywords = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return allKeywords
      .filter(keyword => keyword.includes(query) && keyword !== query)
      .slice(0, 5);
  }, [searchQuery, allKeywords]);

  // Get available months from trends
  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>();
    trends.forEach(trend => {
      const date = new Date(trend.dateAdded);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthSet.add(monthKey);
    });
    return Array.from(monthSet).sort().reverse(); // Most recent first
  }, [trends]);

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search with Keyword Suggestions */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 sm:text-sm transition-all duration-200"
            placeholder="Search trends by keyword (e.g., LLM, enterprise, regulation)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          
          {/* Keyword Suggestions */}
          {showSuggestions && suggestedKeywords.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
              <div className="px-3 py-2 text-xs text-slate-500 border-b border-white/5">
                Suggested keywords:
              </div>
              {suggestedKeywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(keyword);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {keyword}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Archive Dropdown */}
        <div className="w-full md:w-64">
          <select
            value={selectedMonth || ''}
            onChange={(e) => setSelectedMonth(e.target.value || null)}
            className="block w-full pl-3 pr-10 py-3 text-base border border-white/10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl bg-slate-900/50 text-slate-300 transition-all duration-200"
          >
            <option value="">All Months</option>
            {availableMonths.map((monthKey) => (
              <option key={monthKey} value={monthKey}>
                {formatMonthLabel(monthKey)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedMonth) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Keyword: {searchQuery}
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-blue-300"
              >
                ×
              </button>
            </span>
          )}
          {selectedMonth && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {formatMonthLabel(selectedMonth)}
              <button
                onClick={() => setSelectedMonth(null)}
                className="hover:text-purple-300"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMonth(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-300 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default TrendFilters;
