
import React, { useState, useEffect } from 'react';
import { searchLocations } from '../services/geminiService';

interface LocationPickerProps {
  onLocationSelect: (loc: { name: string; lat?: number; lng?: number }) => void;
  label: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, label }) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<{ text: string, links: { title: string, url: string }[] } | null>(null);
  const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    setSearching(true);
    const res = await searchLocations(query, userLoc?.lat, userLoc?.lng);
    setResults(res);
    setSearching(false);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search neighborhood, landmark, or street..."
            className="w-full p-3 pl-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <i className="fas fa-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="px-6 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 disabled:opacity-50 transition-all"
        >
          {searching ? <i className="fas fa-spinner fa-spin"></i> : 'Verify'}
        </button>
      </div>

      {/* Simulated Map Display */}
      <div className="relative w-full h-48 bg-slate-200 rounded-2xl overflow-hidden border border-slate-300">
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-122.4194,37.7749,12/800x400?access_token=pk.eyJ1Ijoic29tZW9uZSIsImEiOiJjbDFhZ2...')] bg-center bg-cover opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4 bg-white/90 backdrop-blur rounded-lg shadow-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-800">Map Interface Simulated</p>
            <p className="text-[10px] text-slate-500">Interactive markers would appear here</p>
          </div>
        </div>
        {userLoc && (
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-[10px] font-mono text-slate-500 border border-slate-200">
            Near: {userLoc.lat.toFixed(4)}, {userLoc.lng.toFixed(4)}
          </div>
        )}
      </div>

      {results && (
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
          <p className="text-sm text-slate-700 mb-3 leading-tight">{results.text}</p>
          {results.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {results.links.map((link, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(link.title);
                    onLocationSelect({ name: link.title });
                  }}
                  className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                  <i className="fas fa-map-pin mr-1 text-[10px]"></i> {link.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
