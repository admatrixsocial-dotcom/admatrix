
import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Globe, MapPin, Briefcase, Zap, AlertCircle } from 'lucide-react';
import { generateSEOAnalysis } from './services/geminiService';
import { SEOReport, AnalysisInput } from './types';
import { ReportView } from './components/ReportView';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SEOReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AnalysisInput>({
    url: '',
    location: '',
    industry: ''
  });

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) return;
    
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const results = await generateSEOAnalysis(formData);
      setReport(results);
    } catch (err) {
      console.error(err);
      setError("Failed to complete analysis. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="fill-current" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">SEO Intel Agent</h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-500 font-medium">
             <a href="#" className="hover:text-indigo-600">Dashboard</a>
             <a href="#" className="hover:text-indigo-600">Competitors</a>
             <a href="#" className="hover:text-indigo-600">Keywords</a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Search Section */}
        {!report && !loading && (
          <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-6">
              <Zap size={16} /> Advanced AI Search Grounding
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              Unlock Deep <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">SEO Intelligence</span> in seconds.
            </h2>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Identify technical flaws, content gaps, and competitor secrets with our agent-driven SEO audit platform.
            </p>

            <form onSubmit={handleAnalyze} className="bg-white p-2 rounded-2xl shadow-2xl shadow-indigo-100 border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="flex items-center px-4 py-3 bg-slate-50 rounded-xl focus-within:ring-2 ring-indigo-500 transition-all">
                  <Globe size={18} className="text-slate-400 mr-3" />
                  <input 
                    type="url" 
                    placeholder="Website URL (e.g. https://...)" 
                    className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-800 placeholder:text-slate-400"
                    required
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>
                <div className="flex items-center px-4 py-3 bg-slate-50 rounded-xl focus-within:ring-2 ring-indigo-500 transition-all">
                  <MapPin size={18} className="text-slate-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Target Location" 
                    className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-800 placeholder:text-slate-400"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="flex items-center px-4 py-3 bg-slate-50 rounded-xl focus-within:ring-2 ring-indigo-500 transition-all">
                  <Briefcase size={18} className="text-slate-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Industry" 
                    className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-800 placeholder:text-slate-400"
                    value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                <Search size={20} className="group-hover:scale-110 transition-transform" />
                Analyze Domain Performance
              </button>
            </form>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
               {['Backlink Analysis', 'Content Quality', 'Core Web Vitals', 'Search Intent'].map((item, i) => (
                 <div key={i} className="flex flex-col items-center gap-2 text-slate-400">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <span className="text-xs font-semibold uppercase">{item}</span>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-4xl mx-auto px-6 py-32 text-center flex flex-col items-center">
            <div className="relative mb-10">
              <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-indigo-400 animate-pulse" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">SEO Agent at work...</h3>
            <div className="space-y-4 max-w-sm mx-auto">
              <p className="text-slate-500 text-sm animate-pulse">Running technical crawlers...</p>
              <p className="text-slate-500 text-sm animate-pulse delay-75">Fetching backlink data using Google Search...</p>
              <p className="text-slate-500 text-sm animate-pulse delay-150">Auditing competitor keyword strategies...</p>
              <p className="text-slate-500 text-sm animate-pulse delay-200">Synthesizing professional report...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-xl mx-auto px-6 py-20 text-center">
             <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 flex flex-col items-center">
               <AlertCircle size={48} className="text-rose-500 mb-4" />
               <h3 className="text-xl font-bold text-rose-900 mb-2">Analysis Interrupted</h3>
               <p className="text-rose-700 mb-6">{error}</p>
               <button 
                 onClick={() => setError(null)}
                 className="bg-rose-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-rose-700 transition-colors"
               >
                 Try Again
               </button>
             </div>
          </div>
        )}

        {/* Report Results */}
        {report && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center bg-white border-b border-slate-100 mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analysis Target</p>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Globe size={16} className="text-indigo-600" /> {formData.url}
                  </h2>
                </div>
                <button 
                  onClick={() => setReport(null)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg"
                >
                  New Analysis
                </button>
             </div>
             <ReportView report={report} />
          </div>
        )}
      </main>

      {/* Persistent Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-2 text-white mb-6">
            <Sparkles className="fill-current text-indigo-500" />
            <span className="font-bold text-xl">SEO Intel Agent</span>
          </div>
          <p className="text-sm max-w-lg mx-auto mb-8">
            Advanced search intelligence platform for SEO consultants and marketing teams. Built with Gemini 3 Pro reasoning.
          </p>
          <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Documentation</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

const CheckCircle2: React.FC<{className?: string, size?: number}> = ({className, size=24}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);
