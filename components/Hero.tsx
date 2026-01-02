
import React from 'react';
import { MANIFESTO } from '../constants';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-radial-at-t from-[#121214] to-[#0a0a0b]">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="space-y-4">
          <div className="w-16 h-px bg-[#D4AF37]/40 mx-auto mb-6"></div>
          <h2 className="roman text-[#D4AF37] text-xs md:text-sm uppercase tracking-[0.4em] font-medium opacity-80">
            {MANIFESTO.subheadline}
          </h2>
        </div>
        
        <h1 className="serif text-5xl md:text-8xl text-zinc-100 leading-[1.1] font-normal tracking-tight max-w-4xl mx-auto">
          {MANIFESTO.headline}
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto italic font-light opacity-90 px-4">
          &ldquo;{MANIFESTO.body}&rdquo;
        </p>
        
        <div className="pt-12">
          <button 
            onClick={() => document.getElementById('archive-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-10 py-5 bg-transparent border border-[#D4AF37]/30 text-[#D4AF37] overflow-hidden transition-all duration-500 hover:border-[#D4AF37]"
          >
            <span className="relative z-10 font-medium tracking-[0.3em] uppercase text-xs roman">Enter the Archives</span>
            <div className="absolute inset-0 bg-[#D4AF37]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-zinc-700">
        <ChevronDown className="w-6 h-6 stroke-1" />
      </div>
    </section>
  );
};

export default Hero;
