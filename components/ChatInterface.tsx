
import React, { useState, useEffect, useRef } from 'react';
import { Match, ChatMessage, ItemReport } from '../types';
import { getReportById } from '../services/storageService';

interface ChatInterfaceProps {
  match: Match;
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ match, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const matchedItem = getReportById(match.matchId);

  useEffect(() => {
    // Simulated system welcome message
    setMessages([
      {
        id: 'sys-1',
        senderId: 'system',
        text: 'Connection secured. For your safety, do not share sensitive financial information. Meeting in a public place is recommended.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        // Fixed: Added missing required status property
        status: 'sent'
      }
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      // Fixed: Added missing required status property
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'them',
        text: "Thanks for reaching out! I think I have your item. Where would be a good place to meet?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        // Fixed: Added missing required status property
        status: 'sent'
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
            <i className="fas fa-chevron-left"></i>
          </button>
          <div>
            <h3 className="font-bold text-sm">Chat about: {matchedItem?.title}</h3>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest"><i className="fas fa-circle text-[6px] mr-1"></i> Secure Connection</span>
          </div>
        </div>
        <button className="text-rose-400 hover:text-rose-300 text-xs font-bold">Report Abuse</button>
      </div>

      <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.senderId === 'system' ? 'justify-center' : msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.senderId === 'system' ? (
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] px-4 py-2 rounded-full font-bold max-w-xs text-center uppercase tracking-tighter">
                {msg.text}
              </div>
            ) : (
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.senderId === 'me' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                <span className={`text-[8px] block mt-1 font-bold ${msg.senderId === 'me' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message securely..."
          className="flex-grow p-3 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
        />
        <button 
          type="submit"
          className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};
