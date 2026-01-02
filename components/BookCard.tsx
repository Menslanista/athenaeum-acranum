
import React from 'react';
import { Book } from '../types';
import { ExternalLink, BookOpen, Download } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="group relative bg-[#0d0d0e] border border-zinc-800/40 p-5 rounded-sm hover:border-[#D4AF37]/40 transition-all duration-700 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#D4AF37]/5">
      <div className="relative aspect-[2/3] overflow-hidden rounded-sm mb-5 bg-zinc-900">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
          <button className="p-3 bg-zinc-100 text-black rounded-full hover:bg-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75">
            <BookOpen className="w-5 h-5" />
          </button>
          <button className="p-3 bg-[#D4AF37] text-black rounded-full hover:bg-[#FFD700] transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-150">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 flex-grow">
        <div className="flex justify-between items-start">
          <span className="roman text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold opacity-90">
            {book.discipline}
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-medium">
            {book.category}
          </span>
        </div>
        
        <h3 className="serif text-xl text-zinc-100 leading-tight font-medium group-hover:text-[#D4AF37] transition-colors duration-300">
          {book.title}
        </h3>
        <p className="text-xs tracking-wider text-zinc-500 font-medium uppercase opacity-80">By {book.author}</p>
        
        <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed pt-2 font-light italic">
          {book.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between">
         <span className="text-[9px] text-zinc-700 uppercase tracking-widest font-mono">Archive ID: {book.id}</span>
         <button className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors font-medium">
           Dossier <ExternalLink className="w-3 h-3" />
         </button>
      </div>
    </div>
  );
};

export default BookCard;
