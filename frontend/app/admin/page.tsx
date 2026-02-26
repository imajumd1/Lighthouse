"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Trend } from '../../lib/types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, trends, addTrend, archiveTrend, verticals } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [whyTrend, setWhyTrend] = useState('');
  const [leverage, setLeverage] = useState('');
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
      setSummary('This is a simulated summary fetched from the provided URL. In a real app, this would come from an Open Graph scraper.');
      setIsFetching(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTrend({
      title,
      justificationSummary: summary,
      whyTrend,
      howConsultanciesLeverage: leverage,
      affectedVerticals: selectedVerticals,
      sourceUrl: url,
      status: 'current',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000' // Placeholder
    });

    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setSummary('');
    setWhyTrend('');
    setLeverage('');
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
          <Button onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? 'Cancel' : 'Add New Trend'}
          </Button>
        </div>

        {/* Add Trend Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-12 bg-slate-900/50 border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6">Add New Trend</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4 items-end">
                <Input
                  label="Source URL"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleFetchMetadata}
                  isLoading={isFetching}
                  className="mb-[2px]"
                >
                  Fetch Metadata
                </Button>
              </div>

              <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Justification Summary</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-24"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Why It's a Trend</label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-32"
                    value={whyTrend}
                    onChange={(e) => setWhyTrend(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Consulting Leverage</label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-32"
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    required
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
                    <h4 className="font-medium text-white">{trend.title}</h4>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-1">{trend.justificationSummary}</p>
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

