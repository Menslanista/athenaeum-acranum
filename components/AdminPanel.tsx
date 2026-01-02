
import React, { useState, useMemo, useRef } from 'react';
import { Book, Discipline } from '../types';
import { storageService } from '../services/storageService';
import { librarian } from '../services/geminiService';
import { 
  Plus, 
  Trash2, 
  Book as BookIcon, 
  Upload, 
  SortAsc, 
  SortDesc, 
  Calendar, 
  User as UserIcon, 
  Type as TypeIcon,
  Search,
  Image as ImageIcon,
  X,
  Loader2,
  Sparkles,
  FileText,
  CheckCircle2
} from 'lucide-react';

type SortField = 'title' | 'author' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const AdminPanel: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(storageService.getBooks());
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  
  const [pdfName, setPdfName] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    discipline: Discipline.ESOTERIC,
    category: '',
    description: '',
    coverUrl: '',
    fileUrl: '#'
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this text from the archives?')) {
      try {
        storageService.deleteBook(id);
        setBooks(storageService.getBooks());
      } catch (error) {
        console.error("Failed to delete book:", error);
        alert("The archive resisted deletion. Please try again.");
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      let finalCoverUrl = formData.coverUrl;

      // If no cover is provided, generate one with Gemini
      if (!finalCoverUrl) {
        const generatedImage = await librarian.generateCoverImage(formData.title, formData.discipline);
        finalCoverUrl = generatedImage || 'https://picsum.photos/seed/archive/400/600?grayscale';
      }

      storageService.addBook({
        ...formData,
        coverUrl: finalCoverUrl
      });
      
      setBooks(storageService.getBooks());
      setShowAddForm(false);
      setPdfName('');
      setFormData({
        title: '',
        author: '',
        discipline: Discipline.ESOTERIC,
        category: '',
        description: '',
        coverUrl: '',
        fileUrl: '#'
      });
    } catch (error) {
      console.error("Failed to add book:", error);
      alert("The archive refused this entry. Ensure all fields are valid.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("Only PDF documents may be sealed within these archives.");
        return;
      }
      setPdfName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, fileUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, coverUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sortedBooks = useMemo(() => {
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'createdAt') {
        comparison = a.createdAt - b.createdAt;
      } else {
        const valA = a[sortField] || '';
        const valB = b[sortField] || '';
        comparison = valA.localeCompare(valB);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [books, searchTerm, sortField, sortOrder]);

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <BookIcon className="w-8 h-8 text-[#D4AF37]" />
          <h1 className="serif text-4xl">Archive Management</h1>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-[#D4AF37] text-black px-6 py-2 rounded-full font-medium hover:bg-[#FFD700] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-expanded={showAddForm}
        >
          <Plus className={`w-5 h-5 transition-transform duration-300 ${showAddForm ? 'rotate-45' : ''}`} />
          {showAddForm ? 'Cancel Entry' : 'New Archive Text'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-[#121214] border border-[#D4AF37]/30 p-8 rounded-lg mb-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl relative overflow-hidden">
          {isGenerating && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
              <div className="text-center">
                <p className="roman text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-2">Consecrating Archive</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest italic animate-pulse">Consulting Gemini for visual preservation...</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <h2 className="serif text-2xl text-[#D4AF37]">Enter New Knowledge</h2>
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Archival Form V.II</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Column: Metadata */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Text Title</label>
                  <input 
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 focus:border-[#D4AF37] outline-none text-zinc-100 transition-colors"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Author/Source</label>
                  <input 
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 focus:border-[#D4AF37] outline-none text-zinc-100 transition-colors"
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Discipline</label>
                  <select 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 focus:border-[#D4AF37] outline-none text-zinc-100 cursor-pointer transition-colors"
                    value={formData.discipline}
                    onChange={e => setFormData({...formData, discipline: e.target.value as Discipline})}
                  >
                    {Object.values(Discipline).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Category Tag</label>
                  <input 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 focus:border-[#D4AF37] outline-none text-zinc-100 transition-colors"
                    value={formData.category}
                    placeholder="e.g. Alchemy, Geopolitics"
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Description / Abstract</label>
                <textarea 
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 focus:border-[#D4AF37] outline-none text-zinc-100 transition-colors resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* Right Column: Image Upload */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold block">Cover Preservation</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-[2/3] w-full border-2 border-dashed border-zinc-800 rounded-sm flex flex-col items-center justify-center text-zinc-600 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all cursor-pointer group overflow-hidden bg-zinc-900/30`}
              >
                {formData.coverUrl ? (
                  <>
                    <img src={formData.coverUrl} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity" alt="Preview" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <ImageIcon className="w-10 h-10 mx-auto text-zinc-700 group-hover:text-[#D4AF37] transition-colors" />
                    <p className="text-[10px] uppercase tracking-[0.2em] font-medium group-hover:text-zinc-300">Upload Cover</p>
                    <span className="text-[9px] italic text-zinc-700 block">Portrait Aspect Preferred</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              {!formData.coverUrl && (
                <div className="flex items-center gap-2 justify-center text-[#D4AF37] opacity-60">
                   <Sparkles className="w-3 h-3" />
                   <p className="text-[9px] uppercase tracking-widest font-medium">Gemini will manifest a unique cover</p>
                </div>
              )}
            </div>
          </div>
          
          <div 
            onClick={() => pdfInputRef.current?.click()}
            className={`p-10 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer group relative overflow-hidden ${
              pdfName 
                ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5 text-[#D4AF37]' 
                : 'border-zinc-800 text-zinc-500 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5'
            }`}
          >
             <input 
               type="file" 
               ref={pdfInputRef}
               className="hidden" 
               accept="application/pdf"
               onChange={handlePdfUpload}
             />
             
             {pdfName ? (
               <>
                 <CheckCircle2 className="w-12 h-12 mb-4 text-[#D4AF37] animate-in zoom-in duration-300" />
                 <p className="text-xs uppercase tracking-[0.2em] font-bold">Document Sealed</p>
                 <span className="text-[10px] mt-2 italic text-[#D4AF37]/70 font-mono">{pdfName}</span>
                 <button 
                   onClick={(e) => { e.stopPropagation(); setPdfName(''); setFormData({...formData, fileUrl: '#'}); if(pdfInputRef.current) pdfInputRef.current.value = ''; }}
                   className="absolute top-4 right-4 text-zinc-600 hover:text-white"
                 >
                   <X className="w-4 h-4" />
                 </button>
               </>
             ) : (
               <>
                 <FileText className="w-12 h-12 mb-4 group-hover:text-[#D4AF37] transition-colors" />
                 <p className="text-xs uppercase tracking-[0.2em] font-medium group-hover:text-zinc-300">Seal Document Source (PDF)</p>
                 <span className="text-[9px] mt-2 italic text-zinc-700">Click to upload scholarly material</span>
               </>
             )}
          </div>

          <button 
            type="submit" 
            disabled={isGenerating}
            className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.4em] text-[11px] roman rounded-sm hover:bg-[#FFD700] transition-all active:scale-[0.99] shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50"
          >
            {isGenerating ? 'Archiving...' : 'Commit to the Great Archive'}
          </button>
        </form>
      )}

      {/* Sorting & Search Toolbar */}
      <div className="flex flex-wrap items-center gap-6 mb-10 p-5 bg-[#0d0d0e] border border-zinc-800/50 rounded-sm shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold opacity-80">Inventory Control:</span>
          <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>
        </div>

        {/* Search Input */}
        <div className="flex-grow min-w-[200px] relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-[#D4AF37] transition-colors" />
          <input 
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0a0b] border border-zinc-800 rounded-sm px-10 py-2.5 text-xs focus:border-[#D4AF37]/40 outline-none text-zinc-100 transition-colors placeholder:text-zinc-800"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-[10px] uppercase tracking-widest text-zinc-700 font-bold">Sort By</label>
          <div className="flex bg-[#0a0a0b] border border-zinc-800 rounded-sm p-1">
            <button 
              onClick={() => setSortField('title')}
              className={`p-1.5 rounded-sm transition-all ${sortField === 'title' ? 'bg-[#D4AF37] text-black' : 'text-zinc-600 hover:text-zinc-300'}`}
              title="Sort by Title"
            >
              <TypeIcon className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setSortField('author')}
              className={`p-1.5 rounded-sm transition-all ${sortField === 'author' ? 'bg-[#D4AF37] text-black' : 'text-zinc-600 hover:text-zinc-300'}`}
              title="Sort by Author"
            >
              <UserIcon className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setSortField('createdAt')}
              className={`p-1.5 rounded-sm transition-all ${sortField === 'createdAt' ? 'bg-[#D4AF37] text-black' : 'text-zinc-600 hover:text-zinc-300'}`}
              title="Sort by Date"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-[10px] uppercase tracking-widest text-zinc-700 font-bold">Order</label>
          <div className="flex bg-[#0a0a0b] border border-zinc-800 rounded-sm p-1">
            <button 
              onClick={() => setSortOrder('asc')}
              className={`p-1.5 rounded-sm transition-all ${sortOrder === 'asc' ? 'bg-[#D4AF37] text-black' : 'text-zinc-600 hover:text-zinc-300'}`}
              title="Ascending"
            >
              <SortAsc className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setSortOrder('desc')}
              className={`p-1.5 rounded-sm transition-all ${sortOrder === 'desc' ? 'bg-[#D4AF37] text-black' : 'text-zinc-600 hover:text-zinc-300'}`}
              title="Descending"
            >
              <SortDesc className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="ml-auto text-[9px] uppercase tracking-[0.2em] text-zinc-700 italic font-medium">
          {sortedBooks.length} {searchTerm ? 'Matches Found' : 'Total Entries'}
        </div>
      </div>

      <div className="grid gap-6">
        {sortedBooks.map(book => (
          <div key={book.id} className="bg-[#0d0d0e] border border-zinc-800/60 p-6 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-[#D4AF37]/30 transition-all duration-500">
            <div className="flex gap-6 items-center flex-grow">
              <div className="relative shrink-0">
                <img src={book.coverUrl} className="w-14 h-20 object-cover rounded-sm shadow-xl grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100" alt="" />
                <div className="absolute inset-0 border border-white/5 rounded-sm pointer-events-none"></div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="serif text-xl group-hover:text-[#D4AF37] transition-colors duration-300 leading-none">{book.title}</h3>
                  <span className="text-[9px] uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-zinc-600 rounded-sm">{book.category}</span>
                </div>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">{book.author} <span className="text-zinc-800 mx-2">•</span> <span className="text-[#D4AF37]/60 italic roman lowercase small-caps">{book.discipline}</span></p>
                <p className="text-[9px] text-zinc-700 uppercase tracking-widest pt-1">Entry: {new Date(book.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleDelete(book.id)}
                className="p-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all group/del"
                title="Excise from Records"
              >
                <Trash2 className="w-5 h-5 stroke-1.5 transition-transform group-hover/del:scale-110" />
              </button>
            </div>
          </div>
        ))}
        {sortedBooks.length === 0 && (
          <div className="py-32 text-center border border-dashed border-zinc-900 rounded-sm bg-zinc-900/10">
            <p className="serif text-3xl text-zinc-700 italic opacity-50">
              {searchTerm ? 'The inquiry yielded no corresponding records.' : 'The archival ledger is currently blank.'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-6 roman text-[#D4AF37]/60 text-[10px] uppercase tracking-[0.3em] hover:text-[#D4AF37] transition-colors"
              >
                Reset Search Parameters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
