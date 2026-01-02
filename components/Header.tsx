
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Menu, Search, User, LogOut } from 'lucide-react';

interface HeaderProps {
  isAdmin: boolean;
  onLogout: () => void;
  onOpenSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onLogout, onOpenSearch }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#0a0a0b]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-6 group">
          <Logo className="w-12 h-12 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="wordmark text-[16px] md:text-[18px] text-[#D4AF37] leading-none">Athenaeum Arcanum</span>
            <span className="text-[7px] tracking-[0.6em] uppercase text-zinc-600 mt-2 font-bold">Digital Sanctuary</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] font-medium text-zinc-500">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">Manifesto</Link>
          <Link to="/archive" className="hover:text-[#D4AF37] transition-colors">The Archives</Link>
          <button onClick={onOpenSearch} className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
            <Search className="w-3.5 h-3.5" />
            Search
          </button>
        </nav>

        <div className="flex items-center gap-4">
          {isAdmin ? (
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1.5 rounded-sm hover:bg-[#D4AF37]/10 transition-all font-bold">
                Curator
              </Link>
              <button onClick={onLogout} className="text-zinc-600 hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-zinc-600 hover:text-[#D4AF37] transition-colors">
              <User className="w-5 h-5" />
            </Link>
          )}
          <button className="md:hidden text-zinc-500">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
