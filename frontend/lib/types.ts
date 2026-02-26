export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Vertical {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface Trend {
  id: string;
  title: string;
  justificationSummary: string;
  whyTrend: string;
  howConsultanciesLeverage: string;
  affectedVerticals: string[]; // Array of Vertical IDs
  sourceUrl: string;
  status: 'current' | 'archived';
  dateAdded: string;
  author: string;
  imageUrl?: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  trendId: string;
  createdAt: string;
}

