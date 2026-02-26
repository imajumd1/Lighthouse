"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HeatMapScores } from '../lib/types';

interface HeatMapProps {
  scores: HeatMapScores;
}

const HeatMap = ({ scores }: HeatMapProps) => {
  const metrics = [
    { key: 'capabilityMaturity', label: 'Capability Maturity', color: 'bg-blue-500' },
    { key: 'capitalBacking', label: 'Capital Backing', color: 'bg-green-500' },
    { key: 'enterpriseAdoption', label: 'Enterprise Adoption', color: 'bg-purple-500' },
    { key: 'regulatoryFriction', label: 'Regulatory Friction', color: 'bg-red-500' },
    { key: 'competitiveIntensity', label: 'Competitive Intensity', color: 'bg-orange-500' },
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
        AI Disruption Heat Map
      </h3>
      
      <div className="space-y-5">
        {metrics.map((metric, index) => {
          const score = scores[metric.key as keyof HeatMapScores];
          return (
            <div key={metric.key}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">{metric.label}</span>
                <span className="text-sm font-bold text-white">{score}/10</span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score * 10}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full rounded-full ${metric.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeatMap;

