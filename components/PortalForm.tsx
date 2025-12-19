
import React, { useState } from 'react';
import { ItemType, ItemReport, ReportStatus } from '../types';
import { LocationPicker } from './LocationPicker';
import { enhanceDescription } from '../services/geminiService';

interface PortalFormProps {
  type: ItemType;
  onCancel: () => void;
  onSubmit: (report: ItemReport) => void;
}

export const PortalForm: React.FC<PortalFormProps> = ({ type, onCancel, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ItemReport>>({
    type,
    category: 'Electronics',
    date: new Date().toISOString().split('T')[0],
    // Fixed: Using ReportStatus.ACTIVE instead of 'active' string literal
    status: ReportStatus.ACTIVE
  });

  const isLost = type === ItemType.LOST;

  const handleEnhance = async () => {
    if (!formData.description) return;
    setLoading(true);
    const enhanced = await enhanceDescription(formData.description, type);
    setFormData(prev => ({ ...prev, description: enhanced }));
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReport: ItemReport = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    } as ItemReport;
    onSubmit(finalReport);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className={`p-8 text-white flex justify-between items-center ${isLost ? 'bg-rose-600' : 'bg-emerald-600'}`}>
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase">Report {isLost ? 'Lost' : 'Found'} Item</h2>
          <p className="text-white/80 font-medium">Step {step} of 2: {step === 1 ? 'Details' : 'Location'}</p>
        </div>
        <button onClick={onCancel} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {step === 1 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">Item Category</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.category}
                  onChange={e => setFormData(p => ({...p, category: e.target.value}))}
                >
                  <option>Electronics</option>
                  <option>Wallets & Bags</option>
                  <option>Jewelry & Watches</option>
                  <option>Keys</option>
                  <option>Documents</option>
                  <option>Pets</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">Date {isLost ? 'Lost' : 'Found'}</label>
                <input 
                  type="date"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.date}
                  onChange={e => setFormData(p => ({...p, date: e.target.value}))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">Short Title</label>
              <input 
                type="text"
                placeholder="e.g. Blue iPhone 13, Golden Retriever..."
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.title}
                onChange={e => setFormData(p => ({...p, title: e.target.value}))}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Description</label>
                <button 
                  type="button" 
                  onClick={handleEnhance}
                  disabled={loading || !formData.description}
                  className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 disabled:opacity-50"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-wand-magic-sparkles mr-1"></i> Smart Refine</>}
                </button>
              </div>
              <textarea 
                className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Describe unique marks, color, brand..."
                value={formData.description}
                onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                required
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Next: Location & Contact <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <LocationPicker 
              label={`Where was it ${isLost ? 'last seen' : 'located'}?`}
              onLocationSelect={(loc) => setFormData(p => ({...p, locationName: loc.name}))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">Your Name</label>
                <input 
                  type="text"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.contactName}
                  onChange={e => setFormData(p => ({...p, contactName: e.target.value}))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">Email Address</label>
                <input 
                  type="email"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.contactEmail}
                  onChange={e => setFormData(p => ({...p, contactEmail: e.target.value}))}
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-500 font-bold hover:text-slate-800 transition-all"
              >
                <i className="fas fa-arrow-left mr-2"></i> Back
              </button>
              <button 
                type="submit"
                className={`px-10 py-4 text-white rounded-2xl font-black uppercase tracking-wider shadow-2xl hover:scale-[1.03] active:scale-[0.97] transition-all ${isLost ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'}`}
              >
                Submit {isLost ? 'Loss' : 'Recovery'} Report
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
