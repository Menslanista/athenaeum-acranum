
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { librarian } from '../services/geminiService';
import { Epiphany } from '../types';
import { Feather, Flame, Sparkles, Send, Loader2, Quote } from 'lucide-react';

const Council: React.FC = () => {
  const [epiphanies, setEpiphanies] = useState<Epiphany[]>([]);
  const [newEpiphany, setNewEpiphany] = useState('');
  const [seekerName, setSeekerName] = useState('');
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEpiphanies(storageService.getEpiphanies());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEpiphany.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      // Fix: Changed addEpiphanies to addEpiphany to match storageService implementation
      storageService.addEpiphany(newEpiphany, seekerName);
      setEpiphanies(storageService.getEpiphanies());
      setNewEpiphany('');
      setSeekerName('');
      setIsSubmitting(false);
    }, 800);
  };

  const handleResonate = (id: string) => {
    storageService.resonate(id);
    setEpiphanies(storageService.getEpiphanies());
  };

  const handleSynthesize = async () => {
    setIsSynthesizing(true);
    // Fix: Corrected typo 'epippanies' to 'epiphanies'
    const result = await librarian.synthesizeEpiphanies(epiphanies);
    setSynthesis(result);
    setIsSynthesizing(false);
  };

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen max-w-4xl">
      <div className="text-center space-y-6 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="serif text-5xl md:text-7xl text-zinc-100">The Council of Seekers</h1>
        <div className="w-24 h-px bg-[#D4AF37]/50 mx-auto"></div>
        <p className="text-zinc-500 text-lg md:text-xl italic font-light max-w-2xl mx-auto">
          "From the silence of the dark night, we emerge to serve the light of others. Share the wisdom born of your struggle."
        </p>
      </div>

      {/* Synthesis Section */}
      <div className="mb-20 bg-[#0d0d0e] border border-zinc-800 p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-20 h-20 text-[#D4AF37]" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="roman text-xs tracking-[0.3em] text-[#D4AF37] uppercase">Archival Synthesis</span>
          </div>
          
          {synthesis ? (
            <div className="space-y-4">
              <p className="serif text-2xl text-zinc-200 leading-relaxed italic">"{synthesis}"</p>
              <button 
                onClick={() => setSynthesis(null)}
                className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-[#D4AF37] transition-colors"
              >
                Clear Synthesis
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-zinc-500 text-sm font-light">
                Ask the Sage to weave the collective wisdom of current epiphanies into a single profound observation.
              </p>
              <button 
                onClick={handleSynthesize}
                disabled={isSynthesizing || epiphanies.length === 0}
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]/40 transition-all disabled:opacity-50"
              >
                {isSynthesizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                Seek Collective Wisdom
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="mb-20 space-y-6 bg-[#121214] border border-zinc-900 p-8">
        <div className="flex items-center gap-4 mb-4">
          <Feather className="w-5 h-5 text-zinc-500" />
          <h2 className="roman text-sm tracking-[0.2em] text-zinc-400 uppercase">Seal an Epiphany</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <textarea 
              required
              placeholder="What have you unlearned in the shadows?"
              value={newEpiphany}
              onChange={(e) => setNewEpiphany(e.target.value)}
              className="w-full bg-[#0a0a0b] border border-zinc-800 p-5 text-zinc-200 focus:border-[#D4AF37]/40 outline-none resize-none min-h-[120px] transition-all"
            />
          </div>
          <div className="flex flex-col gap-4">
            <input 
              placeholder="Your Name (or Seeker)"
              value={seekerName}
              onChange={(e) => setSeekerName(e.target.value)}
              className="w-full bg-[#0a0a0b] border border-zinc-800 px-4 py-3 text-xs text-zinc-300 focus:border-[#D4AF37]/40 outline-none"
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-grow bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] text-[10px] roman hover:bg-[#FFD700] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post to Ledger
            </button>
          </div>
        </div>
      </form>

      {/* Ledger List */}
      <div className="space-y-12">
        {epiphanies.map((e, idx) => (
          <div 
            key={e.id} 
            className="relative pl-12 border-l border-zinc-900 group animate-in fade-in duration-500"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-[#D4AF37]/20 group-hover:bg-[#D4AF37] transition-all duration-500"></div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="roman text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase">{e.seeker}</span>
                <span className="text-[9px] text-zinc-700 font-mono">{new Date(e.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="serif text-xl text-zinc-300 leading-relaxed font-light italic">
                "{e.content}"
              </p>
              <button 
                onClick={() => handleResonate(e.id)}
                className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-zinc-600 hover:text-[#D4AF37] transition-colors"
              >
                <Flame className={`w-3.5 h-3.5 ${e.resonance > 0 ? 'text-[#D4AF37] fill-[#D4AF37]/20' : ''}`} />
                Resonance: {e.resonance}
              </button>
            </div>
          </div>
        ))}
        {epiphanies.length === 0 && (
          <div className="py-20 text-center border border-dashed border-zinc-900 opacity-30">
             <Quote className="w-10 h-10 mx-auto mb-4 text-zinc-700" />
             <p className="roman text-xs uppercase tracking-widest text-zinc-500">The Ledger is currently blank.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Council;
