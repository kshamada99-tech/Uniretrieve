
import React from 'react';
import { Match, ItemReport, PortalView } from '../types';
import { getReportById } from '../services/storageService';

interface MatchDashboardProps {
  matches: Match[];
  onInitiateChat: (match: Match) => void;
  onBack: () => void;
}

export const MatchDashboard: React.FC<MatchDashboardProps> = ({ matches, onInitiateChat, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Potential Matches</h2>
          <p className="text-slate-500 font-medium">Our AI has identified {matches.length} possible items that match your report.</p>
        </div>
        <button 
          onClick={onBack}
          className="text-slate-500 font-bold hover:text-indigo-600 transition-all flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-search text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-800">No matches yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">
            Don't worry! We'll keep scanning new reports 24/7 and notify you immediately if something surfaces.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match) => {
            const matchedItem = getReportById(match.matchId);
            if (!matchedItem) return null;

            return (
              <div key={match.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {match.score}% Similarity
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      <i className="fas fa-calendar mr-1"></i> {matchedItem.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{matchedItem.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4 italic">
                    "{matchedItem.description}"
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 bg-slate-50 p-2 rounded-lg">
                    <i className="fas fa-brain text-indigo-400"></i>
                    <span>Matched by: {match.reason}</span>
                  </div>
                  <button 
                    onClick={() => onInitiateChat(match)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                  >
                    Connect with Finder <i className="fas fa-comments ml-2"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
