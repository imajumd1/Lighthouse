"use client";

import React from 'react';
import { useApp } from '../context/AppContext';

interface TrendFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedVertical: string | null;
  setSelectedVertical: (verticalId: string | null) => void;
}

const TrendFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedVertical, 
  setSelectedVertical 
}: TrendFiltersProps) => {
  const { verticals } = useApp();

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 sm:text-sm transition-all duration-200"
            placeholder="Search trends by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Vertical Filter Dropdown (Mobile) */}
        <div className="md:hidden">
          <select
            value={selectedVertical || ''}
            onChange={(e) => setSelectedVertical(e.target.value || null)}
            className="block w-full pl-3 pr-10 py-3 text-base border border-white/10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl bg-slate-900/50 text-slate-300"
          >
            <option value="">All Verticals</option>
            {verticals.map((vertical) => (
              <option key={vertical.id} value={vertical.id}>
                {vertical.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vertical Filter Chips (Desktop) */}
      <div className="hidden md:flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedVertical(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedVertical === null
              ? 'bg-white text-slate-900 shadow-lg shadow-white/10'
              : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
          }`}
        >
          All
        </button>
        {verticals.map((vertical) => (
          <button
            key={vertical.id}
            onClick={() => setSelectedVertical(vertical.id === selectedVertical ? null : vertical.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedVertical === vertical.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border-transparent'
                : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
            }`}
          >
            {vertical.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendFilters;

