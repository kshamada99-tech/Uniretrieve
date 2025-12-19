
import React, { useState, useEffect } from 'react';
import { PortalView, ItemType, ItemReport, Match, ReportStatus } from './types';
import { RequirementsList } from './components/RequirementsList';
import { UserFlowDiagram } from './components/UserFlowDiagram';
import { ItemReportSimulator } from './components/ItemReportSimulator';
import { PortalForm } from './components/PortalForm';
import { saveReport, findMatches } from './services/storageService';
import { MatchDashboard } from './components/MatchDashboard';
import { ChatInterface } from './components/ChatInterface';
import { TechSpecs } from './components/TechSpecs';

const App: React.FC = () => {
  const [view, setView] = useState<PortalView>(PortalView.LANDING);
  const [lastSubmitted, setLastSubmitted] = useState<ItemReport | null>(null);
  const [activeMatches, setActiveMatches] = useState<Match[]>([]);
  const [activeChatMatch, setActiveChatMatch] = useState<Match | null>(null);
  const [scanningStatus, setScanningStatus] = useState(0);

  const handleReportSubmit = (report: ItemReport) => {
    saveReport(report);
    setLastSubmitted(report);
    setView(PortalView.SUCCESS);
    
    // Simulated scanning animation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScanningStatus(progress);
      if (progress >= 100) {
        clearInterval(interval);
        const matches = findMatches(report);
        setActiveMatches(matches);
      }
    }, 300);
  };

  const handleViewMatches = () => {
    setView(PortalView.MATCHES);
  };

  const handleInitiateChat = (match: Match) => {
    setActiveChatMatch(match);
    setView(PortalView.CHAT);
  };

  if (view === PortalView.SUCCESS) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 text-center animate-in zoom-in-90">
          <div className="relative mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all duration-1000 ${scanningStatus >= 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-50 text-indigo-500'}`}>
              <i className={`fas ${scanningStatus >= 100 ? 'fa-check-circle' : 'fa-brain animate-pulse'} text-5xl`}></i>
            </div>
            {scanningStatus < 100 && (
              <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 rotate-[-90deg]">
                <circle cx="48" cy="48" r="46" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                <circle 
                  cx="48" cy="48" r="46" 
                  fill="transparent" 
                  stroke="#6366f1" 
                  strokeWidth="4" 
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * scanningStatus) / 100}
                  className="transition-all duration-300"
                />
              </svg>
            )}
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {scanningStatus >= 100 ? 'Matching Complete!' : 'AI is Scanning...'}
          </h2>
          
          <p className="text-slate-500 mb-8 font-medium">
            {scanningStatus >= 100 
              ? `We found ${activeMatches.length} possible matches for your ${lastSubmitted?.title}.` 
              : 'Our neural engine is analyzing cross-referenced reports, location overlaps, and visual descriptions.'}
          </p>

          <div className="space-y-3">
            {scanningStatus >= 100 ? (
              <>
                <button 
                  onClick={handleViewMatches}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20"
                >
                  View Matches ({activeMatches.length})
                </button>
                <button 
                  onClick={() => setView(PortalView.LANDING)}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Go to Dashboard
                </button>
              </>
            ) : (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-400 font-bold flex items-center gap-3">
                <i className="fas fa-shield-halved text-emerald-500"></i>
                <span className="uppercase tracking-widest">End-to-End Encrypted Matching</span>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-1 opacity-20">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-1 h-1 rounded-full ${i <= (scanningStatus/20) ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={() => setView(PortalView.LANDING)} className="flex items-center gap-3 text-left">
            <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-box-open text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">RETRIEVE-IT</h1>
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Global Lost & Found</p>
            </div>
          </button>
          
          <nav className="hidden md:flex gap-8">
            <button onClick={() => setView(PortalView.LANDING)} className={`text-sm font-bold ${view === PortalView.LANDING ? 'text-indigo-600' : 'text-slate-600'} hover:text-indigo-600 transition-colors`}>Portal</button>
            <button onClick={() => setView(PortalView.TECH_SPECS)} className={`text-sm font-bold ${view === PortalView.TECH_SPECS ? 'text-indigo-600' : 'text-slate-600'} hover:text-indigo-600 transition-colors`}>Tech Specs</button>
          </nav>

          <div className="flex gap-3">
            <button 
              onClick={() => setView(PortalView.LOST_FORM)}
              className="bg-rose-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-rose-700 transition-all"
            >
              I Lost Something
            </button>
            <button 
              onClick={() => setView(PortalView.FOUND_FORM)}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-700 transition-all"
            >
              I Found Something
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-12 pb-24">
        {view === PortalView.LANDING && (
          <div className="space-y-16">
            <section className="text-center space-y-6 max-w-3xl mx-auto animate-in fade-in duration-700">
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                Unified Ecosystem for Item Recovery
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Turning lost moments into <span className="text-indigo-600">Reunions</span>.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">
                Our platform uses advanced AI and real-time mapping to reconnect people with their belongings. Simple, secure, and fast.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                 <button onClick={() => setView(PortalView.LOST_FORM)} className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:scale-105 transition-all">Report Lost</button>
                 <button onClick={() => setView(PortalView.FOUND_FORM)} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">Report Found</button>
              </div>
            </section>

            <section id="requirements" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center">
                    <i className="fas fa-list-check text-indigo-500 mr-4"></i>
                    Functional Requirements
                  </h3>
                  <RequirementsList />
                </div>
              </div>
              <div id="simulator" className="lg:col-span-1">
                <ItemReportSimulator />
              </div>
            </section>
          </div>
        )}

        {view === PortalView.TECH_SPECS && <TechSpecs />}

        {(view === PortalView.LOST_FORM || view === PortalView.FOUND_FORM) && (
          <div className="mt-8 animate-in slide-in-from-bottom-8 duration-500">
            <PortalForm 
              type={view === PortalView.LOST_FORM ? ItemType.LOST : ItemType.FOUND}
              onCancel={() => setView(PortalView.LANDING)}
              onSubmit={handleReportSubmit}
            />
          </div>
        )}

        {view === PortalView.MATCHES && (
          <div className="mt-8">
            <MatchDashboard 
              matches={activeMatches} 
              onInitiateChat={handleInitiateChat}
              onBack={() => setView(PortalView.LANDING)}
            />
          </div>
        )}

        {view === PortalView.CHAT && activeChatMatch && (
          <div className="mt-8">
            <ChatInterface 
              match={activeChatMatch}
              onBack={() => setView(PortalView.MATCHES)}
            />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-box-open text-sm"></i>
              </div>
              <h4 className="text-white font-black tracking-tight">RETRIEVE-IT</h4>
           </div>
           <p className="text-xs font-medium">Secure Matching. Encrypted Chats. Technical Compliance V2. © 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
