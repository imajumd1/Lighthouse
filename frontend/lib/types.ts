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

export type TrendCategory = 'Capability' | 'Enterprise Adoption' | 'Infrastructure' | 'Regulation' | 'Capital Markets' | 'Competitive Move';
export type TimeHorizon = 'Immediate (0–3 months)' | 'Emerging (3–12 months)' | 'Structural (1–3 years)';
export type TrendMomentum = 'Early Signal' | 'Accelerating' | 'Mainstream Adoption';

export interface Trend {
  id: string;
  title: string; // Internal title
  headline: string; // Executive summary headline (10 words max)
  trendCategory: TrendCategory;
  
  // Core Analysis
  justificationSummary: string; // 3-Bullet Executive Summary
  whyTrend: string; // Context
  howConsultanciesLeverage: string;
  analysisDetail: string; // Deep dive
  
  // Strategic Impact
  strategicImpact: string; // Cost, Revenue, Differentiation, Risk
  
  // Executive Metrics
  timeHorizon: TimeHorizon;
  confidenceScore: number; // 1-10
  confidenceReasoning: string; // e.g., "Validated by enterprise deployments"
  
  // Market Signals
  marketValidation: string; // Adoption, funding, infra availability
  financialSignal: string; // Funding volume, revenue metrics, pricing
  competitiveIntelligence: string; // Competitor moves, big tech, startups
  
  // Risk & Governance
  riskGovernance: string; // Regulatory, bias, hallucination, data leakage
  
  // Actionable Insights
  trendMomentum: TrendMomentum;
  actionGuidance: string; // What to do now
  
  affectedVerticals: string[]; // Array of Vertical IDs
  sourceUrl: string;
  additionalSources: Source[];
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

