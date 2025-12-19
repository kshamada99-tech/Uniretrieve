
import React, { useState } from 'react';
import { Requirement } from '../types';

const REQUIREMENTS: Requirement[] = [
  { id: '1', category: 'Authentication', title: 'User Identity Verification', description: 'Supports OAuth and multi-factor authentication for secure item claiming.', priority: 'High', portal: 'Both' },
  { id: '2', category: 'Reporting', title: 'Smart Image Recognition', description: 'Automatically categorize items and suggest attributes based on uploaded photos.', priority: 'Medium', portal: 'Both' },
  { id: '3', category: 'Reporting', title: 'Geolocation Tagging', description: 'Pin precise locations on a map where the item was last seen or found.', priority: 'High', portal: 'Both' },
  { id: '4', category: 'Lost Portal', title: 'Reward Management', description: 'Secure escrow system for setting and paying out rewards for returned items.', priority: 'Medium', portal: 'Lost' },
  { id: '5', category: 'Found Portal', title: 'Verification Quiz', description: 'Customizable security questions that claimers must answer to prove ownership.', priority: 'High', portal: 'Found' },
  { id: '6', category: 'Matching', title: 'AI Recommendation Engine', description: 'Real-time cross-referencing between new lost and found reports with similarity scoring.', priority: 'High', portal: 'Both' },
  { id: '7', category: 'Communication', title: 'Anonymized Messaging', description: 'In-app chat system that protects user privacy until a hand-off is agreed upon.', priority: 'High', portal: 'Both' },
  { id: '8', category: 'Administration', title: 'Evidence Log', description: 'Maintain a tamper-proof audit trail of all interactions and status changes.', priority: 'Low', portal: 'Both' },
];

export const RequirementsList: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Lost' | 'Found'>('All');

  const filtered = REQUIREMENTS.filter(req => 
    filter === 'All' ? true : req.portal === filter || req.portal === 'Both'
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {['All', 'Lost', 'Found'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            {f} Portal
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((req) => (
          <div key={req.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                {req.category}
              </span>
              <span className={`text-xs px-2 py-1 rounded font-semibold ${
                req.priority === 'High' ? 'bg-rose-50 text-rose-600' : 
                req.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {req.priority} Priority
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
              {req.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {req.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
