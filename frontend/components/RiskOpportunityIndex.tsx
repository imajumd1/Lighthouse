"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trend } from '../lib/types';

interface RiskOpportunityIndexProps {
  trends: Trend[];
}

const RiskOpportunityIndex = ({ trends }: RiskOpportunityIndexProps) => {
  // Calculate aggregate scores
  const avgRisk = trends.reduce((acc, t) => acc + (t.heatMapScores?.regulatoryFriction || 0), 0) / trends.length;
  const avgOpportunity = trends.reduce((acc, t) => acc + (t.heatMapScores?.capitalBacking || 0), 0) / trends.length;
  const avgMaturity = trends.reduce((acc, t) => acc + (t.heatMapScores?.capabilityMaturity || 0), 0) / trends.length;

  return (
    <div className="mb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/10 rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Quarterly AI Risk & Opportunity Index</h2>
              <p className="text-slate-400">Aggregate market signals across top 10 trends</p>
            </div>
            <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <span className="text-sm text-slate-400">Market Sentiment: </span>
              <span className="text-sm font-bold text-green-400">Bullish but Cautious</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Opportunity Score */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Capital Intensity</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-white">{avgOpportunity.toFixed(1)}</span>
                <span className="text-sm text-slate-400 mb-1">/ 10</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">High capital inflow indicates strong market validation.</p>
            </div>

            {/* Risk Score */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Regulatory Friction</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-white">{avgRisk.toFixed(1)}</span>
                <span className="text-sm text-slate-400 mb-1">/ 10</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Higher score indicates increasing compliance barriers.</p>
            </div>

            {/* Maturity Score */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tech Maturity</h3>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-white">{avgMaturity.toFixed(1)}</span>
                <span className="text-sm text-slate-400 mb-1">/ 10</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Readiness for enterprise-scale deployment.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskOpportunityIndex;

