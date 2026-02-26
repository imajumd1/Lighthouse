"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in to view your profile</h2>
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would update the user in the backend/context
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-[2px]">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                alt={user.name}
                className="w-full h-full rounded-full object-cover border-4 border-slate-900"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-slate-400">{user.email}</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-md capitalize border border-blue-500/30">
                {user.role} Account
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
                <Input
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
                
                {isEditing && (
                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                )}
              </form>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Account Actions</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" onClick={logout}>
                  Sign Out
                </Button>
                <Button variant="outline" className="text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

