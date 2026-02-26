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

export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
  date: string;
}

export interface Trend {
  id: string;
  title: string;
  justificationSummary: string; // Now more comprehensive
  whyTrend: string;
  howConsultanciesLeverage: string;
  analysisDetail: string; // New field for detailed explanation
  affectedVerticals: string[]; // Array of Vertical IDs
  sourceUrl: string; // Primary source
  additionalSources: Source[]; // New field for supporting sources
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

