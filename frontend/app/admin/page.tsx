"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Trend, TrendCategory, TimeHorizon, TrendMomentum } from '../../lib/types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Link from 'next/link';
import { APPROVED_SOURCES } from '../../lib/data';

export default function AdminDashboard() {
  const { user, trends, addTrend, archiveTrend, verticals } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [showSources, setShowSources] = useState(false);
  
  // Form State
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [trendCategory, setTrendCategory] = useState<TrendCategory>('Capability');
  const [summary, setSummary] = useState('');
  const [whyTrend, setWhyTrend] = useState('');
  const [leverage, setLeverage] = useState('');
  const [analysisDetail, setAnalysisDetail] = useState('');
  const [strategicImpact, setStrategicImpact] = useState('');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('Emerging (3–12 months)');
  const [confidenceScore, setConfidenceScore] = useState(7);
  const [confidenceReasoning, setConfidenceReasoning] = useState('');
  const [marketValidation, setMarketValidation] = useState('');
  const [financialSignal, setFinancialSignal] = useState('');
  const [competitiveIntelligence, setCompetitiveIntelligence] = useState('');
  const [riskGovernance, setRiskGovernance] = useState('');
  const [trendMomentum, setTrendMomentum] = useState<TrendMomentum>('Early Signal');
  const [actionGuidance, setActionGuidance] = useState('');
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-4">You do not have permission to view this page.</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300">Return Home</Link>
        </div>
      </div>
    );
  }

  const handleFetchMetadata = async () => {
    if (!url) return;
    setIsFetching(true);
    
    // Simulate fetching metadata
    setTimeout(() => {
      setTitle('Simulated Fetched Title from URL');
      setHeadline('Simulated Executive Headline (10 words max)');
      setSummary('• Key point 1\n• Key point 2\n• Key point 3');
      setIsFetching(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTrend({
      title,
      headline,
      trendCategory,
      justificationSummary: summary,
      whyTrend,
      howConsultanciesLeverage: leverage,
      analysisDetail: analysisDetail || 'Detailed analysis pending...',
      strategicImpact,
      timeHorizon,
      confidenceScore,
      confidenceReasoning,
      marketValidation,
      financialSignal,
      competitiveIntelligence,
      riskGovernance,
      trendMomentum,
      actionGuidance,
      affectedVerticals: selectedVerticals,
      sourceUrl: url,
      additionalSources: [],
      status: 'current',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000' // Placeholder
    });

    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setHeadline('');
    setTrendCategory('Capability');
    setSummary('');
    setWhyTrend('');
    setLeverage('');
    setAnalysisDetail('');
    setStrategicImpact('');
    setTimeHorizon('Emerging (3–12 months)');
    setConfidenceScore(7);
    setConfidenceReasoning('');
    setMarketValidation('');
    setFinancialSignal('');
    setCompetitiveIntelligence('');
    setRiskGovernance('');
    setTrendMomentum('Early Signal');
    setActionGuidance('');
    setSelectedVerticals([]);
  };

  const toggleVertical = (id: string) => {
    setSelectedVerticals(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Manage trends and content curation.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => setShowSources(!showSources)}>
              {showSources ? 'Hide Sources' : 'View Approved Sources'}
            </Button>
            <Button onClick={() => setIsAdding(!isAdding)}>
              {isAdding ? 'Cancel' : 'Add New Trend'}
            </Button>
          </div>
        </div>

        {/* Approved Sources Panel */}
        {showSources && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-12 bg-slate-900/50 border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6">Approved Source List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(APPROVED_SOURCES).map(([category, sources]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <ul className="space-y-2">
                    {sources.map((source, idx) => (
                      <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                        <span className="w-1 h-1 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add Trend Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-12 bg-slate-900/50 border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6">Add New Trend</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Core Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Source URL"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="flex items-end">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleFetchMetadata}
                    isLoading={isFetching}
                    fullWidth
                  >
                    Fetch Metadata
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Internal Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <Input
                  label="Executive Headline (10 words max)"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Trend Category</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={trendCategory}
                    onChange={(e) => setTrendCategory(e.target.value as TrendCategory)}
                  >
                    <option>Capability</option>
                    <option>Enterprise Adoption</option>
                    <option>Infrastructure</option>
                    <option>Regulation</option>
                    <option>Capital Markets</option>
                    <option>Competitive Move</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Time Horizon</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(e.target.value as TimeHorizon)}
                  >
                    <option>Immediate (0–3 months)</option>
                    <option>Emerging (3–12 months)</option>
                    <option>Structural (1–3 years)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Trend Momentum</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={trendMomentum}
                    onChange={(e) => setTrendMomentum(e.target.value as TrendMomentum)}
                  >
                    <option>Early Signal</option>
                    <option>Accelerating</option>
                    <option>Mainstream Adoption</option>
                  </select>
                </div>
              </div>

              {/* Analysis */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">3-Bullet Executive Summary</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-24"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Strategic Impact (Cost, Revenue, Risk)</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-24"
                  value={strategicImpact}
                  onChange={(e) => setStrategicImpact(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Market Validation</label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-24"
                    value={marketValidation}
                    onChange={(e) => setMarketValidation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Financial Signal</label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-24"
                    value={financialSignal}
                    onChange={(e) => setFinancialSignal(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Competitive Intelligence</label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-24"
                    value={competitiveIntelligence}
                    onChange={(e) => setCompetitiveIntelligence(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Risk & Governance</label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-24"
                    value={riskGovernance}
                    onChange={(e) => setRiskGovernance(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Action Guidance (What To Do Now)</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-24"
                  value={actionGuidance}
                  onChange={(e) => setActionGuidance(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Confidence Score (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={confidenceScore}
                    onChange={(e) => setConfidenceScore(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Confidence Reasoning</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={confidenceReasoning}
                    onChange={(e) => setConfidenceReasoning(e.target.value)}
                  />
                </div>
              </div>

              {/* Deep Dive Fields (Hidden by default in UI but available) */}
              <div className="space-y-6 pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white">Deep Dive Content</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Context & Analysis (Why Trend)</label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-32"
                    value={whyTrend}
                    onChange={(e) => setWhyTrend(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Consulting Leverage</label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-32"
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Deep Dive Analysis</label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-32"
                    value={analysisDetail}
                    onChange={(e) => setAnalysisDetail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">Affected Verticals</label>
                <div className="flex flex-wrap gap-2">
                  {verticals.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => toggleVertical(v.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedVerticals.includes(v.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <Button type="submit" size="lg">
                  Publish Trend
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Trends List */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <h3 className="font-semibold text-white">Current Trends</h3>
          </div>
          <div className="divide-y divide-white/10">
            {trends.map((trend) => (
              <div key={trend.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex-grow pr-8">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      trend.status === 'current' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {trend.status.toUpperCase()}
                    </span>
                    <h4 className="font-medium text-white">{trend.headline}</h4>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-1">{trend.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/trends/${trend.id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                  {trend.status === 'current' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => archiveTrend(trend.id)}
                      className="text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50"
                    >
                      Archive
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

