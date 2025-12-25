
import { GoogleGenAI, Type } from "@google/genai";
import { SEOReport, AnalysisInput } from "../types";

// In Vite/Netlify, we check for both process.env and import.meta.env
const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || 
               (import.meta as any).env?.VITE_GEMINI_API_KEY || 
               "";

const ai = new GoogleGenAI({ apiKey });

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    healthScore: { type: Type.NUMBER },
    domainInfo: {
      type: Type.OBJECT,
      properties: {
        age: { type: Type.STRING },
        authority: { type: Type.NUMBER },
        indexedPages: { type: Type.NUMBER },
        httpsStatus: { type: Type.STRING },
        securityInfo: { type: Type.STRING },
      },
      required: ["age", "authority", "indexedPages", "httpsStatus", "securityInfo"]
    },
    technical: {
      type: Type.OBJECT,
      properties: {
        coreWebVitals: {
          type: Type.OBJECT,
          properties: {
            lcp: { type: Type.STRING },
            cls: { type: Type.STRING },
            inp: { type: Type.STRING },
          },
          required: ["lcp", "cls", "inp"]
        },
        mobileFriendly: { type: Type.BOOLEAN },
        speedScore: { type: Type.NUMBER },
        sitemapStatus: { type: Type.STRING },
        robotsTxt: { type: Type.STRING },
      },
      required: ["coreWebVitals", "mobileFriendly", "speedScore", "sitemapStatus", "robotsTxt"]
    },
    onPage: {
      type: Type.OBJECT,
      properties: {
        titles: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            count: { type: Type.NUMBER },
            issues: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["status", "count", "issues"]
        },
        metaDescriptions: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            count: { type: Type.NUMBER },
            issues: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["status", "count", "issues"]
        },
        headings: {
          type: Type.OBJECT,
          properties: {
            h1: { type: Type.NUMBER },
            h2: { type: Type.NUMBER },
            h3: { type: Type.NUMBER },
            issues: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["h1", "h2", "h3", "issues"]
        },
        internalLinking: { type: Type.STRING },
        imageAltTags: { type: Type.STRING },
        schemaTypes: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["titles", "metaDescriptions", "headings", "internalLinking", "imageAltTags", "schemaTypes"]
    },
    content: {
      type: Type.OBJECT,
      properties: {
        originalityScore: { type: Type.NUMBER },
        topicalAuthority: { type: Type.STRING },
        aiIndicator: { type: Type.STRING },
        gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
        improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["originalityScore", "topicalAuthority", "aiIndicator", "gaps", "improvements"]
    },
    backlinks: {
      type: Type.OBJECT,
      properties: {
        total: { type: Type.NUMBER },
        referringDomains: { type: Type.NUMBER },
        doFollowRatio: { type: Type.NUMBER },
        toxicPercentage: { type: Type.NUMBER },
        detailedSources: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              url: { type: Type.STRING },
              anchor: { type: Type.STRING },
              authority: { type: Type.NUMBER },
              type: { type: Type.STRING, enum: ['dofollow', 'nofollow'] }
            },
            required: ["url", "anchor", "authority", "type"]
          }
        }
      },
      required: ["total", "referringDomains", "doFollowRatio", "toxicPercentage", "detailedSources"]
    },
    competitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          authority: { type: Type.NUMBER },
          strength: { type: Type.STRING },
          gap: { type: Type.STRING }
        },
        required: ["name", "authority", "strength", "gap"]
      }
    },
    keywords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          volume: { type: Type.STRING },
          difficulty: { type: Type.NUMBER },
          competition: { type: Type.NUMBER },
          cpc: { type: Type.STRING },
          intent: { type: Type.STRING }
        },
        required: ["term", "volume", "difficulty", "competition", "cpc", "intent"]
      }
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          priority: { type: Type.STRING },
          issue: { type: Type.STRING },
          action: { type: Type.STRING },
          impact: { type: Type.STRING },
          effort: { type: Type.STRING }
        },
        required: ["priority", "issue", "action", "impact", "effort"]
      }
    },
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          duration: { type: Type.STRING },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["phase", "duration", "tasks"]
      }
    }
  }
};

export async function generateSEOAnalysis(input: AnalysisInput): Promise<SEOReport> {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please set the API_KEY environment variable.");
  }

  const prompt = `Perform a comprehensive SEO audit for the URL: ${input.url}.
  Context:
  - Target Location: ${input.location || 'Global'}
  - Industry/Niche: ${input.industry || 'General'}

  Tasks:
  1. Technical Audit: Research domain age, authority, indexing, Core Web Vitals, speed, and mobile friendliness.
  2. On-Page Analysis: Check titles, meta tags, heading structure, and schema.
  3. Content Analysis: Evaluate originality, topical authority, and find content gaps.
  4. Off-Page Analysis: Find a detailed list of identified backlinks. Include Source URL, Anchor Text, estimated DR/Authority, and dofollow/nofollow status.
  5. Competitive Intel: Identify top 5 organic competitors and compare authority.
  6. Keyword Strategy: Find ranking keywords and high-intent opportunities. 
     Include metrics: Volume, Difficulty (0-100), Competition (0-100), and CPC (USD).
  7. Provide prioritized recommendations (Critical, Medium, Low) and a 3-6 month roadmap.

  USE GOOGLE SEARCH to find actual data about this site's visibility, backlink profile (link: operator or mentions), and competition.
  If specific real-time metrics are unavailable, provide logical AI-inferred estimations based on similar site archetypes and search footprints.
  Return the output in the requested JSON format.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: REPORT_SCHEMA,
    },
  });

  const rawText = response.text;
  const report = JSON.parse(rawText) as SEOReport;
  
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({
      title: chunk.web?.title || 'SEO Resource',
      uri: chunk.web?.uri || '#'
    })) || [];

  return { ...report, sources };
}
