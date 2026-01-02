
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import BookCard from './components/BookCard';
import AdminPanel from './components/AdminPanel';
import Logo from './components/Logo';
import { Book, Discipline } from './types';
import { storageService } from './services/storageService';
import { librarian } from './services/geminiService';
import { X, MessageSquare, Send, Sparkles, Filter, Loader2 } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Home: React.FC<{ books: Book[] }> = ({ books }) => {
  const [filter, setFilter] = useState<Discipline | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchesFilter = filter === 'All' || b.discipline === filter;
      const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                           b.author.toLowerCase().includes(search.toLowerCase()) ||
                           b.discipline.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [books, filter, search]);

  return (
    <main>
      <Hero />
      
      <section id="archive-section" className="container mx-auto px-4 py-32 border-t border-zinc-900/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="space-y-6">
            <h2 className="serif text-4xl md:text-6xl text-zinc-100 font-normal">The Great Archive</h2>
            <p className="text-zinc-500 max-w-xl text-lg font-light leading-relaxed">
              Navigate the silence through a collection of reclaimed voices. Filtered by discipline for the discerning seeker.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search the silence..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-[#0d0d0e] border border-zinc-800 rounded-none px-12 py-4 text-sm focus:border-[#D4AF37]/50 outline-none w-full md:w-72 transition-all"
              />
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#D4AF37] transition-colors" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-16 border-b border-zinc-900 pb-10">
          <button 
            onClick={() => setFilter('All')}
            className={`px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-all roman ${filter === 'All' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-zinc-500 hover:text-[#D4AF37] border border-transparent hover:border-zinc-800'}`}
          >
            All Archives
          </button>
          {Object.values(Discipline).map(d => (
            <button 
              key={d}
              onClick={() => setFilter(d)}
              className={`px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-all roman ${filter === d ? 'bg-[#D4AF37] text-black font-semibold' : 'text-zinc-500 hover:text-[#D4AF37] border border-transparent hover:border-zinc-800'}`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
          {filteredBooks.length === 0 && (
            <div className="col-span-full py-32 text-center text-zinc-700">
              <p className="serif text-3xl mb-6 italic opacity-50">The archive remains silent for this inquiry.</p>
              <button onClick={() => {setFilter('All'); setSearch('')}} className="roman text-[#D4AF37] hover:underline uppercase tracking-[0.3em] text-[10px]">Reset Search Parameters</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const LibrarianChat: React.FC<{ books: Book[] }> = ({ books }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'librarian', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const response = await librarian.recommendBooks(userMsg, books);
    setMessages(prev => [...prev, { role: 'librarian', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[550px] bg-[#0d0d0e] border border-zinc-800 rounded-none flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="p-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="roman text-xs tracking-[0.2em] text-[#D4AF37] uppercase">The AI Librarian</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            <div className="bg-zinc-900/40 p-4 border-l-2 border-[#D4AF37]/40 text-sm text-zinc-400 font-light italic leading-relaxed">
              "Seeker, what truths do you search for today in the Athenaeum? I can guide you through these silent halls."
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-none text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]' : 'bg-zinc-900/50 text-zinc-300 border border-zinc-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900/30 p-4 border border-zinc-800 flex items-center gap-3 text-zinc-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[10px] uppercase tracking-widest italic">Consulting the elders...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-zinc-900 bg-zinc-900/10">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Inquire within..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-none px-5 py-3 pr-14 text-sm focus:border-[#D4AF37]/40 outline-none text-zinc-100 placeholder:text-zinc-700"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#D4AF37] text-black rounded-none hover:bg-[#FFD700] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-4 bg-[#0d0d0e] border border-zinc-800 p-4 rounded-none shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-500"
        >
          <div className="roman text-[10px] uppercase tracking-[0.3em] font-medium text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2">
            Consult Librarian
          </div>
          <div className="bg-[#D4AF37] p-3 text-black transition-transform duration-500 group-hover:rotate-[360deg]">
            <MessageSquare className="w-6 h-6 stroke-1.5" />
          </div>
        </button>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(storageService.getBooks());
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBooks(storageService.getBooks());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0a0a0b] selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
        <Header 
          isAdmin={isAdmin} 
          onLogout={toggleAdmin} 
          onOpenSearch={() => setSearchOpen(true)} 
        />
        
        <Routes>
          <Route path="/" element={<Home books={books} />} />
          <Route path="/archive" element={<Home books={books} />} />
          <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/login" />} />
          <Route path="/login" element={
            <div className="min-h-[85vh] flex items-center justify-center p-6 bg-radial-at-b from-[#121214] to-[#0a0a0b]">
              <div className="bg-[#0d0d0e] border border-zinc-800 p-12 rounded-none w-full max-w-md space-y-10 shadow-2xl">
                <div className="text-center space-y-3">
                  <h2 className="roman text-2xl text-[#D4AF37] uppercase tracking-[0.3em] font-normal">Curator Access</h2>
                  <div className="w-12 h-px bg-zinc-800 mx-auto"></div>
                  <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-medium">Verify credentials for archive entry</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Email Identifier</label>
                    <input type="email" placeholder="curator@athenaeum.com" className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-none px-4 py-4 focus:border-[#D4AF37]/50 outline-none text-sm transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Arcane Passkey</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-none px-4 py-4 focus:border-[#D4AF37]/50 outline-none text-sm transition-all" />
                  </div>
                  <button 
                    onClick={toggleAdmin}
                    className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.3em] text-[10px] roman hover:bg-[#FFD700] transition-all shadow-lg shadow-[#D4AF37]/10"
                  >
                    Enter Vault
                  </button>
                </div>
              </div>
            </div>
          } />
        </Routes>

        <footer className="border-t border-zinc-900 py-32 bg-[#080809]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-10 mb-20">
              {/* Primary Lockup: Centered under the symbol */}
              <div className="flex flex-col items-center space-y-8">
                 <Logo className="w-20 h-20" />
                 <div className="space-y-4">
                   <span className="wordmark text-3xl md:text-5xl text-[#D4AF37] leading-none block">Athenaeum Arcanum</span>
                   <p className="text-zinc-500 max-w-2xl mx-auto text-lg font-light leading-relaxed italic opacity-70">
                     "A legacy project dedicated to the preservation of voices reclaimed from the silence."
                   </p>
                 </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-16 py-16 border-y border-zinc-900/50">
              <div className="space-y-8">
                <h4 className="roman text-xs text-[#D4AF37] uppercase tracking-[0.3em]">The Disciplines</h4>
                <ul className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-medium">
                  {Object.values(Discipline).map(d => (
                    <li key={d} className="hover:text-[#D4AF37] cursor-pointer transition-colors border-l border-zinc-800 pl-3">{d}</li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-8 flex flex-col items-center">
                <h4 className="roman text-xs text-[#D4AF37] uppercase tracking-[0.3em]">The Sanctuary</h4>
                <div className="flex gap-8 grayscale opacity-20 hover:opacity-50 transition-opacity">
                  <div className="w-10 h-10 border border-zinc-800 flex items-center justify-center text-[10px] roman">I</div>
                  <div className="w-10 h-10 border border-zinc-800 flex items-center justify-center text-[10px] roman">II</div>
                  <div className="w-10 h-10 border border-zinc-800 flex items-center justify-center text-[10px] roman">III</div>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="roman text-xs text-[#D4AF37] uppercase tracking-[0.3em]">Current Ethos</h4>
                <p className="text-xs text-zinc-600 leading-[1.8] font-light italic border-r border-zinc-800 pr-6 text-right">
                  "Truth is not found in the light of the crowd,<br/>but in the shadows of the seeker."
                </p>
              </div>
            </div>

            <div className="mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] uppercase tracking-[0.3em] text-zinc-700 font-medium">
              <p className="roman">&copy; {new Date().getFullYear()} ATHENAEUM ARCANUM Archive. MMXXV.</p>
              <div className="flex gap-10">
                <span className="hover:text-zinc-400 cursor-pointer transition-colors">Manifesto</span>
                <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy of Thought</span>
                <span className="hover:text-zinc-400 cursor-pointer transition-colors">Open Source Wisdom</span>
              </div>
            </div>
          </div>
        </footer>

        <LibrarianChat books={books} />
      </div>
    </Router>
  );
};

export default App;
