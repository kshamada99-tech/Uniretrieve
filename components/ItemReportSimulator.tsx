
import React, { useState } from 'react';
import { ItemType } from '../types';
import { enhanceDescription } from '../services/geminiService';

export const ItemReportSimulator: React.FC = () => {
  const [type, setType] = useState<ItemType>(ItemType.LOST);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSimulate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    const enhanced = await enhanceDescription(description, type);
    setResult(enhanced);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 bg-slate-900 text-white">
        <h3 className="text-xl font-bold mb-1">AI Report Optimization</h3>
        <p className="text-slate-400 text-sm">See how Gemini enhances user reports for better matching.</p>
      </div>
      
      <div className="p-6 space-y-4 flex-grow">
        <div className="flex gap-4">
          <button 
            onClick={() => setType(ItemType.LOST)}
            className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${
              type === ItemType.LOST ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-100 text-slate-400'
            }`}
          >
            <i className="fas fa-search-minus mr-2"></i> Lost Item
          </button>
          <button 
            onClick={() => setType(ItemType.FOUND)}
            className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${
              type === ItemType.FOUND ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400'
            }`}
          >
            <i className="fas fa-hand-holding-heart mr-2"></i> Found Item
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Rough Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. lost my keys near central park, they have a blue keychain..."
            className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
          />
        </div>

        <button
          onClick={handleSimulate}
          disabled={loading || !description}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><i className="fas fa-circle-notch fa-spin mr-2"></i> Processing with AI...</>
          ) : (
            <><i className="fas fa-magic mr-2"></i> Enhance Report</>
          )}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h4 className="text-xs font-bold text-indigo-500 uppercase mb-2">Gemini Generated Description:</h4>
            <p className="text-slate-700 italic leading-relaxed">
              "{result}"
            </p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
        Powered by Gemini 3 Flash
      </div>
    </div>
  );
};
