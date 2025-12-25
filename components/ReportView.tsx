
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Globe, Shield, Zap, Layers, Link as LinkIcon, 
  TrendingUp, AlertCircle, CheckCircle2, FileText, ChevronRight, 
  ExternalLink, Info, Link2
} from 'lucide-react';
import { SEOReport } from '../types';
import { DashboardCard } from './DashboardCard';

interface ReportViewProps {
  report: SEOReport;
}

export const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const competitorData = report.competitors.map(c => ({ name: c.name, val: c.authority }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 pb-20">
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-indigo-900 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">SEO Health Analysis</h2>
          <p className="text-indigo-200 text-lg">Detailed performance audit for your digital footprint.</p>
          <div className="mt-4 flex flex-wrap gap-3">
             {report.domainInfo.httpsStatus === 'Secure' && (
               <span className="flex items-center gap-1.5 bg-indigo-800/50 px-3 py-1 rounded-full text-sm">
                 <Shield size={14} className="text-emerald-400" /> HTTPS Verified
               </span>
             )}
             <span className="flex items-center gap-1.5 bg-indigo-800/50 px-3 py-1 rounded-full text-sm">
               <Globe size={14} className="text-blue-400" /> {report.domainInfo.age} Old
             </span>
          </div>
        </div>
        <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-indigo-800" />
            <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * report.healthScore) / 100} className="text-emerald-400" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl md:text-5xl font-black">{report.healthScore}</span>
            <span className="text-[10px] uppercase font-bold text-indigo-300">Score</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Domain Authority" 
          value={report.domainInfo.authority} 
          icon={<Globe size={20} />} 
          trend={report.domainInfo.authority > 40 ? 'up' : 'neutral'}
          subtitle={`Indexed Pages: ${report.domainInfo.indexedPages}`}
        />
        <DashboardCard 
          title="Backlinks" 
          value={report.backlinks.total.toLocaleString()} 
          icon={<LinkIcon size={20} />} 
          trend={report.backlinks.toxicPercentage < 10 ? 'up' : 'down'}
          subtitle={`Ref Domains: ${report.backlinks.referringDomains}`}
        />
        <DashboardCard 
          title="Core Web Vitals" 
          value={report.technical.speedScore} 
          icon={<Zap size={20} />} 
          trend={report.technical.speedScore > 80 ? 'up' : 'down'}
          subtitle={`LCP: ${report.technical.coreWebVitals.lcp}`}
        />
        <DashboardCard 
          title="Mobile Friendly" 
          value={report.technical.mobileFriendly ? 'YES' : 'NO'} 
          icon={<Layers size={20} />} 
          trend={report.technical.mobileFriendly ? 'up' : 'down'}
        />
      </div>

      {/* Detailed Backlink List */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Link2 className="text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-800">Backlink Profile (Live Identified)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="pb-3 px-2 font-medium">Source URL</th>
                <th className="pb-3 px-2 font-medium">Anchor Text</th>
                <th className="pb-3 px-2 font-medium">Auth</th>
                <th className="pb-3 px-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {report.backlinks.detailedSources.length > 0 ? (
                report.backlinks.detailedSources.map((link, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2 text-sm text-indigo-600 truncate max-w-xs">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                        {link.url} <ExternalLink size={10} />
                      </a>
                    </td>
                    <td className="py-4 px-2 text-slate-600 text-sm italic">"{link.anchor || 'No anchor'}"</td>
                    <td className="py-4 px-2">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                         link.authority > 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                       }`}>
                         {link.authority}
                       </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                        link.type === 'dofollow' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {link.type}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-sm">No specific detailed backlinks could be isolated for this report.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical & Content Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-800">Technical Foundation</h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4 border-slate-50">
               <div>
                 <p className="text-sm font-semibold text-slate-800">HTTPS Status</p>
                 <p className="text-xs text-slate-500">{report.domainInfo.securityInfo}</p>
               </div>
               <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-lg text-sm">{report.domainInfo.httpsStatus}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-4 border-slate-50">
               <div>
                 <p className="text-sm font-semibold text-slate-800">Sitemap & Robots</p>
                 <p className="text-xs text-slate-500">Crawling efficiency metrics</p>
               </div>
               <span className="text-slate-600 font-mono text-sm">{report.technical.sitemapStatus}</span>
            </div>
            <div className="pt-4">
              <p className="text-sm font-semibold text-slate-800 mb-3">Schema Structures Detected</p>
              <div className="flex flex-wrap gap-2">
                {report.onPage.schemaTypes.map((s, i) => (
                  <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-800">Content Intelligence</h3>
          </div>
          <div className="space-y-4">
            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-indigo-500" style={{ width: `${report.content.originalityScore}%` }} />
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tight">
              <span>Originality Score</span>
              <span>{report.content.originalityScore}%</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl italic">
              " {report.content.topicalAuthority} "
            </p>
            <div className="mt-4">
               <p className="text-sm font-semibold text-slate-800 mb-2">Content Gaps Identified</p>
               <ul className="space-y-2">
                 {report.content.gaps.map((gap, i) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                     <AlertCircle size={14} className="text-amber-500 mt-1 shrink-0" />
                     {gap}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Competitors & Keywords Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Competitor Visibility Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitorData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
                <Bar dataKey="val" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <h3 className="text-xl font-bold text-slate-800 mb-6 px-2">Top Keywords Opportunity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-3 px-2 font-medium">Keyword</th>
                  <th className="pb-3 px-2 font-medium">Vol</th>
                  <th className="pb-3 px-2 font-medium">Diff</th>
                  <th className="pb-3 px-2 font-medium">Comp</th>
                  <th className="pb-3 px-2 font-medium">CPC</th>
                  <th className="pb-3 px-2 font-medium">Intent</th>
                </tr>
              </thead>
              <tbody>
                {report.keywords.map((k, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2 font-medium text-slate-700 text-sm">{k.term}</td>
                    <td className="py-4 px-2 text-slate-500 text-xs">{k.volume}</td>
                    <td className="py-4 px-2">
                       <div className="flex items-center gap-1.5">
                          <div className="w-8 h-1 bg-slate-100 rounded-full">
                            <div className={`h-full rounded-full ${k.difficulty > 70 ? 'bg-rose-400' : k.difficulty > 40 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${k.difficulty}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{k.difficulty}</span>
                       </div>
                    </td>
                    <td className="py-4 px-2">
                       <div className="flex items-center gap-1.5">
                          <div className="w-8 h-1 bg-slate-100 rounded-full">
                            <div className={`h-full rounded-full ${k.competition > 70 ? 'bg-indigo-400' : k.competition > 40 ? 'bg-indigo-300' : 'bg-indigo-100'}`} style={{ width: `${k.competition}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{k.competition}</span>
                       </div>
                    </td>
                    <td className="py-4 px-2 text-slate-500 font-mono text-[10px]">{k.cpc}</td>
                    <td className="py-4 px-2">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                        k.intent === 'Transactional' ? 'bg-indigo-100 text-indigo-700' : 
                        k.intent === 'Informational' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {k.intent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
             <AlertCircle className="text-rose-500" />
             <h3 className="text-2xl font-bold text-slate-800">Actionable Priorities</h3>
           </div>
           <span className="text-sm font-medium text-slate-500">Ordered by ROI impact</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {report.recommendations.map((rec, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${
              rec.priority === 'Critical' ? 'bg-rose-50/30 border-rose-100' : 
              rec.priority === 'Medium' ? 'bg-amber-50/30 border-amber-100' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                  rec.priority === 'Critical' ? 'bg-rose-500 text-white' : 
                  rec.priority === 'Medium' ? 'bg-amber-500 text-white' : 'bg-slate-500 text-white'
                }`}>
                  {rec.priority}
                </span>
                <span className="text-xs font-bold text-slate-400">Effort: {rec.effort}</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{rec.issue}</h4>
              <p className="text-sm text-slate-600 mb-4">{rec.action}</p>
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
                 <CheckCircle2 size={16} className="text-emerald-500" />
                 <span className="text-xs font-bold text-slate-500">Impact: {rec.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-indigo-900 p-10 rounded-3xl text-white shadow-2xl">
         <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <TrendingUp /> Growth Roadmap (6 Months)
         </h3>
         <div className="relative border-l-2 border-indigo-700/50 ml-4 pl-10 space-y-12">
            {report.roadmap.map((phase, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-14 top-1 w-8 h-8 bg-indigo-500 rounded-full border-4 border-indigo-900 flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h4 className="text-xl font-bold text-white">{phase.phase}</h4>
                  <span className="bg-indigo-800 text-indigo-200 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{phase.duration}</span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {phase.tasks.map((task, ti) => (
                    <li key={ti} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 text-sm hover:bg-white/10 transition-colors">
                       <ChevronRight size={14} className="text-indigo-400" />
                       {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
         </div>
      </div>

      {/* Sources Footer */}
      {report.sources.length > 0 && (
        <div className="mt-12 bg-slate-50 p-6 rounded-2xl border border-slate-200">
           <div className="flex items-center gap-2 mb-4 text-slate-700">
              <Info size={18} />
              <h4 className="font-bold">Analysis Sources</h4>
           </div>
           <div className="flex flex-wrap gap-4">
              {report.sources.map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                >
                  <ExternalLink size={12} />
                  {source.title.length > 40 ? source.title.substring(0, 40) + '...' : source.title}
                </a>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
