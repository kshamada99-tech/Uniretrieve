
import React from 'react';

export const TechSpecs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Architecture</h2>
        <p className="text-slate-500 mt-2 font-medium">Detailed documentation of database schemas and API endpoints.</p>
      </div>

      {/* Database Schema Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-database"></i>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Relational Database Schema</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between">
              <span className="font-bold text-slate-700">Table: reports</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded font-black">CORE</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 text-slate-400 text-left">
                <tr>
                  <th className="px-4 py-2 font-bold uppercase text-[10px]">Column</th>
                  <th className="px-4 py-2 font-bold uppercase text-[10px]">Type</th>
                  <th className="px-4 py-2 font-bold uppercase text-[10px]">Constraints</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td className="px-4 py-3 font-mono text-indigo-600">id</td><td className="px-4 py-3">UUID</td><td className="px-4 py-3 text-xs">PK, NOT NULL</td></tr>
                <tr><td className="px-4 py-3 font-mono text-indigo-600">type</td><td className="px-4 py-3">ENUM</td><td className="px-4 py-3 text-xs">'LOST', 'FOUND'</td></tr>
                <tr><td className="px-4 py-3 font-mono text-indigo-600">reporter_id</td><td className="px-4 py-3">UUID</td><td className="px-4 py-3 text-xs">FK(users.id)</td></tr>
                <tr><td className="px-4 py-3 font-mono text-indigo-600">location</td><td className="px-4 py-3">GEOGRAPHY</td><td className="px-4 py-3 text-xs">PostGIS point</td></tr>
                <tr><td className="px-4 py-3 font-mono text-indigo-600">status</td><td className="px-4 py-3">VARCHAR</td><td className="px-4 py-3 text-xs">Default: 'ACTIVE'</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between">
              <span className="font-bold text-slate-700">Table: chat_sessions</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded font-black">MESSAGING</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 text-slate-400 text-left">
                <tr>
                  <th className="px-4 py-2 font-bold uppercase text-[10px]">Column</th>
                  <th className="px-4 py-2 font-bold uppercase text-[10px]">Type</th>
                  <th className="px-4 py-2 font-bold uppercase text-[10px]">Constraints</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td className="px-4 py-3 font-mono text-emerald-600">id</td><td className="px-4 py-3">UUID</td><td className="px-4 py-3 text-xs">PK, NOT NULL</td></tr>
                <tr><td className="px-4 py-3 font-mono text-emerald-600">report_a_id</td><td className="px-4 py-3">UUID</td><td className="px-4 py-3 text-xs">FK(reports.id)</td></tr>
                <tr><td className="px-4 py-3 font-mono text-emerald-600">report_b_id</td><td className="px-4 py-3">UUID</td><td className="px-4 py-3 text-xs">FK(reports.id)</td></tr>
                <tr><td className="px-4 py-3 font-mono text-emerald-600">match_score</td><td className="px-4 py-3">DECIMAL</td><td className="px-4 py-3 text-xs">0.00 to 1.00</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* API Documentation Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-network-wired"></i>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">RESTful API Endpoints</h3>
        </div>

        <div className="space-y-4">
          {[
            { method: 'POST', path: '/api/v1/reports', desc: 'Creates a new lost or found item report with AI enhancement.', body: '{ title, type, category, location, date }' },
            { method: 'GET', path: '/api/v1/matches/:id', desc: 'Retrieves ranked matches for a specific report using similarity engine.', params: 'report_id (UUID)' },
            { method: 'PATCH', path: '/api/v1/reports/:id/status', desc: 'Updates report status (e.g., mark as RESOLVED).', body: '{ status: "RESOLVED" }' },
            { method: 'GET', path: '/api/v1/locations/search', desc: 'Proxy to Gemini Maps grounding for validated location strings.', query: 'q (String), lat (Float), lng (Float)' },
          ].map((api, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="md:w-48 shrink-0">
                <span className={`inline-block px-3 py-1 rounded text-xs font-black uppercase tracking-widest ${api.method === 'POST' ? 'bg-indigo-600 text-white' : api.method === 'GET' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {api.method}
                </span>
                <p className="mt-2 font-mono text-sm font-bold text-slate-800">{api.path}</p>
              </div>
              <div className="flex-grow">
                <p className="text-slate-600 text-sm mb-4">{api.desc}</p>
                <div className="bg-slate-900 rounded-xl p-4 text-emerald-400 font-mono text-[10px]">
                  {api.body && <div><span className="text-slate-500">// Body</span><br/>{api.body}</div>}
                  {api.params && <div><span className="text-slate-500">// Params</span><br/>{api.params}</div>}
                  {api.query && <div><span className="text-slate-500">// Query</span><br/>{api.query}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* User Testing Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-vial"></i>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Usability & QA Testing Plan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <h4 className="font-bold text-amber-900 mb-2">Accessibility Audit</h4>
            <p className="text-amber-800/70 text-sm">Testing contrast ratios, ARIA labels, and keyboard navigation across all reporting steps.</p>
          </div>
          <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
            <h4 className="font-bold text-sky-900 mb-2">Cognitive Load Test</h4>
            <p className="text-sky-800/70 text-sm">Measuring time-to-complete for "Found Item" forms to ensure high reporting rates.</p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <h4 className="font-bold text-emerald-900 mb-2">Edge Case Handling</h4>
            <p className="text-emerald-800/70 text-sm">Simulating network failure during Gemini API calls and ensuring local cache persistence.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
