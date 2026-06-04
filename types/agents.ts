export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed';

export type WorkflowType = 'full_pipeline' | 'research_only' | 'seo_only' | 'optimize_only';

export type ContentPlatform =
  | 'blog'
  | 'linkedin'
  | 'twitter'
  | 'facebook'
  | 'instagram'
  | 'landing_page'
  | 'email';

export interface BrandVoice {
  tone: string;
  adjectives: string[];
  persona: string;
  avoidWords: string[];
}

export interface SocialAccounts {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

export interface PostingSchedule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  days: string[];
  time: string;
  timezone: string;
}

export interface BrandProfile {
  id?: string;
  userId: string;
  companyId?: string | null;
  brandName: string;
  websiteUrl: string;
  industry: string;
  targetAudience: string;
  brandVoice: BrandVoice;
  brandColors: string[];
  socialAccounts: SocialAccounts;
  contentCategories: string[];
  postingSchedule: PostingSchedule;
  isSetupComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContentBrief {
  id?: string;
  userId: string;
  companyId?: string | null;
  agentRunId?: string;
  topic: string;
  searchIntent: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  faqs: string[];
  competitorInsights: string[];
  contentOutline: ContentOutlineSection[];
  targetWordCount: number;
  tone: string;
  platform: ContentPlatform;
  status: 'pending' | 'generating' | 'complete' | 'failed';
  generatedContent?: string;
  seoReport?: SEOReport;
  optimizationNotes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ContentOutlineSection {
  level: number;
  heading: string;
  keyPoints: string[];
}

export type SEOReport = SEOOutput;

export interface HeadingAnalysis {
  tag: string;
  text: string;
  hasKeyword: boolean;
}

export interface AgentRunStep {
  name: string;
  status: AgentStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
  outputSummary?: string;
}

export interface AgentRun {
  id?: string;
  userId: string;
  companyId?: string | null;
  workflowType: WorkflowType;
  status: AgentStatus;
  currentStep?: string;
  steps: AgentRunStep[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
  resultBriefId?: string;
  resultContentId?: string;
  topic?: string;
  platform?: ContentPlatform;
  createdAt?: string;
}

export interface ResearchOutput {
  topic: string;
  searchIntent: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  faqs: string[];
  competitorInsights: string[];
  contentOutline: ContentOutlineSection[];
  trendingAngles: string[];
  contentGaps: string[];
}

export interface SEOOutput {
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  keywordDensity: number;
  headingStructure: HeadingAnalysis[];
  internalLinkingSuggestions: string[];
  schemaRecommendations: string[];
  seoScore: number;
  recommendations: string[];
}

export interface OptimizationOutput {
  optimizedContent: string;
  improvements: OptimizationImprovement[];
  overallScore: number;
  seoScore: number;
  readabilityScore: number;
  engagementScore: number;
  brandScore: number;
}

export interface OptimizationImprovement {
  category: 'seo' | 'readability' | 'engagement' | 'brand' | 'quality';
  issue: string;
  fix: string;
  impact: 'high' | 'medium' | 'low';
}

export interface OrchestratorResult {
  agentRunId: string;
  status: AgentStatus;
  brief?: ContentBrief;
  content?: string;
  seoReport?: SEOReport;
  optimizedContent?: string;
  improvements?: OptimizationImprovement[];
  steps: AgentRunStep[];
  error?: string;
}

export interface MarketingInsight {
  type: 'topic' | 'timing' | 'format' | 'cta' | 'hook';
  title: string;
  description: string;
  confidence: number;
  dataPoints: string[];
}

export interface AgentDashboardStats {
  todayGenerated: number;
  todayPublished: number;
  todayScheduled: number;
  weeklyViews: number;
  weeklyEngagement: number;
  weeklyClicks: number;
  topPerformingTopics: string[];
  bestPostingTimes: string[];
  agentRuns: AgentRun[];
  insights: MarketingInsight[];
}
