
export interface BacklinkItem {
  url: string;
  anchor: string;
  authority: number;
  type: 'dofollow' | 'nofollow';
}

export interface SEOReport {
  healthScore: number;
  domainInfo: {
    age: string;
    authority: number;
    indexedPages: number;
    httpsStatus: string;
    securityInfo: string;
  };
  technical: {
    coreWebVitals: {
      lcp: string;
      cls: string;
      inp: string;
    };
    mobileFriendly: boolean;
    speedScore: number;
    sitemapStatus: string;
    robotsTxt: string;
  };
  onPage: {
    titles: { status: string; count: number; issues: string[] };
    metaDescriptions: { status: string; count: number; issues: string[] };
    headings: { h1: number; h2: number; h3: number; issues: string[] };
    internalLinking: string;
    imageAltTags: string;
    schemaTypes: string[];
  };
  content: {
    originalityScore: number;
    topicalAuthority: string;
    aiIndicator: string;
    gaps: string[];
    improvements: string[];
  };
  backlinks: {
    total: number;
    referringDomains: number;
    doFollowRatio: number;
    toxicPercentage: number;
    detailedSources: BacklinkItem[];
  };
  competitors: Array<{
    name: string;
    authority: number;
    strength: string;
    gap: string;
  }>;
  keywords: Array<{
    term: string;
    volume: string;
    difficulty: number;
    competition: number;
    cpc: string;
    intent: 'Informational' | 'Transactional' | 'Navigational';
  }>;
  recommendations: Array<{
    priority: 'Critical' | 'Medium' | 'Low';
    issue: string;
    action: string;
    impact: string;
    effort: 'Low' | 'Medium' | 'High';
  }>;
  roadmap: Array<{
    phase: string;
    duration: string;
    tasks: string[];
  }>;
  sources: Array<{
    title: string;
    uri: string;
  }>;
}

export interface AnalysisInput {
  url: string;
  location: string;
  industry: string;
}
