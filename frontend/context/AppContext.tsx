"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Trend, Bookmark, Vertical } from '../lib/types';
import { MOCK_USERS, MOCK_TRENDS, VERTICALS } from '../lib/data';

interface AppContextType {
  user: User | null;
  trends: Trend[];
  bookmarks: Bookmark[];
  verticals: Vertical[];
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string) => Promise<boolean>;
  addTrend: (trend: Omit<Trend, 'id' | 'dateAdded' | 'author'>) => void;
  updateTrend: (trend: Trend) => void;
  archiveTrend: (id: string) => void;
  toggleBookmark: (trendId: string) => void;
  isBookmarked: (trendId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setTrends(MOCK_TRENDS);
      
      // Check for saved user in localStorage
      const savedUser = localStorage.getItem('lighthouse_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      // Load bookmarks
      const savedBookmarks = localStorage.getItem('lighthouse_bookmarks');
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }

      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Persist bookmarks
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('lighthouse_bookmarks', JSON.stringify(bookmarks));
    }
  }, [bookmarks, isLoading]);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('lighthouse_user', JSON.stringify(foundUser));
          resolve(true);
        } else {
          resolve(false);
        }
        setIsLoading(false);
      }, 800);
    });
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        const exists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          resolve(false);
          setIsLoading(false);
          return;
        }

        const newUser: User = {
          id: `u${Date.now()}`,
          name,
          email,
          role: 'user',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        };

        // In a real app, we'd add to MOCK_USERS or DB
        setUser(newUser);
        localStorage.setItem('lighthouse_user', JSON.stringify(newUser));
        resolve(true);
        setIsLoading(false);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lighthouse_user');
  };

  const addTrend = (trendData: Omit<Trend, 'id' | 'dateAdded' | 'author'>) => {
    const newTrend: Trend = {
      ...trendData,
      id: `t${Date.now()}`,
      dateAdded: new Date().toISOString(),
      author: user?.name || 'Admin',
    };
    setTrends(prev => [newTrend, ...prev]);
  };

  const updateTrend = (updatedTrend: Trend) => {
    setTrends(prev => prev.map(t => t.id === updatedTrend.id ? updatedTrend : t));
  };

  const archiveTrend = (id: string) => {
    setTrends(prev => prev.map(t => t.id === id ? { ...t, status: 'archived' } : t));
  };

  const toggleBookmark = (trendId: string) => {
    if (!user) return;

    setBookmarks(prev => {
      const exists = prev.find(b => b.trendId === trendId && b.userId === user.id);
      if (exists) {
        return prev.filter(b => b.id !== exists.id);
      } else {
        return [...prev, {
          id: `b${Date.now()}`,
          userId: user.id,
          trendId,
          createdAt: new Date().toISOString()
        }];
      }
    });
  };

  const isBookmarked = (trendId: string) => {
    if (!user) return false;
    return bookmarks.some(b => b.trendId === trendId && b.userId === user.id);
  };

  return (
    <AppContext.Provider value={{
      user,
      trends,
      bookmarks,
      verticals: VERTICALS,
      isLoading,
      login,
      logout,
      register,
      addTrend,
      updateTrend,
      archiveTrend,
      toggleBookmark,
      isBookmarked
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

