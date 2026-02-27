/**
 * API client for Lighthouse backend
 * Base URL: http://localhost:8000/api/v1
 */

const API_BASE_URL = typeof window !== 'undefined'
  ? (window as any).NEXT_PUBLIC_API_URL || 'https://lighthouse-backend-fc77.onrender.com'
  : 'https://lighthouse-backend-fc77.onrender.com';

interface ApiError {
  error: string;
}

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

/**
 * Generic fetch wrapper with auth header
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: 'An error occurred',
    }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// Auth API
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  async signup(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<{ message: string }> {
    return apiFetch('/auth/logout', {
      method: 'POST',
    });
  },

  async me(): Promise<User> {
    return apiFetch('/auth/me');
  },
};

// ============================================================================
// Trends API
// ============================================================================

export interface Trend {
  id: string;
  title: string;
  headline: string;
  trendCategory: string;
  justificationSummary: string;
  whyTrend: string;
  howConsultanciesLeverage: string;
  analysisDetail: string;
  strategicImpact: string;
  timeHorizon: string;
  confidenceScore: number;
  confidenceReasoning: string;
  heatMapScores: {
    capabilityMaturity: number;
    capitalBacking: number;
    enterpriseAdoption: number;
    regulatoryFriction: number;
    competitiveIntensity: number;
  };
  marketValidation: string;
  financialSignal: string;
  competitiveIntelligence: string;
  riskGovernance: string;
  trendMomentum: string;
  actionGuidance: string;
  affectedVerticals: string[];
  sourceUrl: string;
  additionalSources?: Array<{
    id: string;
    title: string;
    url: string;
    publisher: string;
    date: string;
  }>;
  status: 'current' | 'archived';
  dateAdded: string;
  author: string;
  imageUrl?: string;
}

export const trendsApi = {
  async list(params?: {
    status?: 'current' | 'archived';
    search?: string;
    vertical?: string;
    limit?: number;
  }): Promise<{ trends: Trend[] }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.vertical) queryParams.append('vertical', params.vertical);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiFetch(`/trends${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<Trend> {
    return apiFetch(`/trends/${id}`);
  },

  async create(data: Omit<Trend, 'id' | 'dateAdded' | 'author'>): Promise<Trend> {
    return apiFetch('/trends', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Trend>): Promise<Trend> {
    return apiFetch(`/trends/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async archive(id: string): Promise<Trend> {
    return apiFetch(`/trends/${id}/archive`, {
      method: 'PATCH',
    });
  },
};

// ============================================================================
// Bookmarks API
// ============================================================================

export interface Bookmark {
  id: string;
  userId: string;
  trendId: string;
  createdAt: string;
  trend?: Trend;
}

export const bookmarksApi = {
  async create(trendId: string): Promise<Bookmark> {
    return apiFetch('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ trendId }),
    });
  },

  async delete(trendId: string): Promise<{ message: string }> {
    return apiFetch(`/bookmarks/${trendId}`, {
      method: 'DELETE',
    });
  },

  async list(): Promise<{ bookmarks: Bookmark[] }> {
    return apiFetch('/bookmarks');
  },
};

// ============================================================================
// Users API
// ============================================================================

export const usersApi = {
  async getProfile(): Promise<User> {
    return apiFetch('/users/me');
  },

  async updateProfile(data: {
    name?: string;
    email?: string;
  }): Promise<User> {
    return apiFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAccount(): Promise<{ message: string }> {
    return apiFetch('/users/me', {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// Verticals API
// ============================================================================

export interface Vertical {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export const verticalsApi = {
  async list(): Promise<{ verticals: Vertical[] }> {
    return apiFetch('/verticals');
  },
};

// ============================================================================
// Chat API
// ============================================================================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversation_history?: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  role: 'assistant';
}

export const chatApi = {
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    // Chat API is at /api/chat
    const CHAT_API_URL = typeof window !== 'undefined'
      ? (window as any).NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://lighthouse-backend-fc77.onrender.com'
      : 'https://lighthouse-backend-fc77.onrender.com';
    
    const response = await fetch(`${CHAT_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'An error occurred',
      }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  },

  async healthCheck(): Promise<{ status: string; service: string; openai_configured: boolean }> {
    const CHAT_API_URL = typeof window !== 'undefined'
      ? (window as any).NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://lighthouse-backend-fc77.onrender.com'
      : 'https://lighthouse-backend-fc77.onrender.com';
    
    const response = await fetch(`${CHAT_API_URL}/api/chat/health`);
    return response.json();
  },
};
