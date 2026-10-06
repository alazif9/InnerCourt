import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import HUDCorners from '@/components/hud/HUDCorners';
import { Search, BookOpen, Bookmark, BookmarkCheck, ExternalLink, X } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All', symbol: '◈' },
  { id: 'psyche', name: 'Psyche', symbol: '☽' },
  { id: 'philosophy', name: 'Philosophy', symbol: '☿' },
  { id: 'spirit', name: 'Spirit', symbol: '☉' },
  { id: 'saved', name: 'Saved', symbol: '✦' },
];

const books = [
  { id: 15489, title: 'Dream Psychology', author: 'Sigmund Freud', year: 1920, category: 'psyche', minutes: 240, summary: 'A concise introduction to how dreams disguise and reveal our hidden wishes.' },
  { id: 621, title: 'The Varieties of Religious Experience', author: 'William James', year: 1902, category: 'psyche', minutes: 900, summary: 'A landmark study of mystical states, conversion and the inner life.' },
  { id: 4507, title: 'As a Man Thinketh', author: 'James Allen', year: 1903, category: 'psyche', minutes: 60, summary: 'A short meditation on how thought shapes character and circumstance.' },
  { id: 2680, title: 'Meditations', author: 'Marcus Aurelius', year: 180, category: 'philosophy', minutes: 330, summary: 'The private journal of a Roman emperor, written to steady his own mind.' },
  { id: 45109, title: 'The Enchiridion', author: 'Epictetus', year: 125, category: 'philosophy', minutes: 50, summary: 'A Stoic handbook on what is within our control and what is not.' },
  { id: 1998, title: 'Thus Spake Zarathustra', author: 'Friedrich Nietzsche', year: 1883, category: 'philosophy', minutes: 600, summary: 'A poetic, prophetic work on self-overcoming and becoming who you are.' },
  { id: 205, title: 'Walden', author: 'Henry David Thoreau', year: 1854, category: 'philosophy', minutes: 660, summary: 'Two years of deliberate, simple living in a cabin by a pond.' },
  { id: 16643, title: 'Essays: First Series', author: 'Ralph Waldo Emerson', year: 1841, category: 'philosophy', minutes: 480, summary: 'Includes "Self-Reliance" — the classic call to trust your own inner voice.' },
  { id: 216, title: 'Tao Te Ching', author: 'Lao Tzu', year: -400, category: 'spirit', minutes: 90, summary: 'Eighty-one brief verses on the way of balance, softness and flow.' },
  { id: 2388, title: 'The Bhagavad Gita', author: 'Vyasa (trans. Edwin Arnold)', year: -200, category: 'spirit', minutes: 180, summary: 'A dialogue on duty, devotion and the nature of the self.' },
  { id: 2500, title: 'Siddhartha', author: 'Hermann Hesse', year: 1922, category: 'spirit', minutes: 240, summary: 'A novel of one seeker\'s journey from teachings to direct experience.' },
  { id: 58585, title: 'The Prophet', author: 'Kahlil Gibran', year: 1923, category: 'spirit', minutes: 80, summary: 'Twenty-six prose poems on love, work, pain, freedom and death.' },
  { id: 14209, title: 'The Kybalion', author: 'Three Initiates', year: 1908, category: 'spirit', minutes: 200, summary: 'A study of the seven Hermetic principles behind the Great Work.' },
];

const SAVED_KEY = 'innercourt_library_saved';

const formatYear = (y) => (y < 0 ? `${Math.abs(y)} BCE` : `${y}`);
const formatTime = (m) => (m >= 60 ? `${Math.round(m / 60)}h read` : `${m}m read`);

export default function Library() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(SAVED_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    } catch {
      /* ignore */
    }
  }, [saved]);

  const toggleSaved = (id) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (category === 'saved' && !saved.includes(b.id)) return false;
      if (category !== 'all' && category !== 'saved' && b.category !== category) return false;
      if (!q) return true;
      return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    });
  }, [query, category, saved]);

  return (
    <div className="space-y-4 relative">
      <HUDCorners />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-2 space-y-2"
      >
        <h1 className="font-occult text-3xl font-semibold text-gradient-gold tracking-wide">
          The Library
        </h1>
        <div className="font-data text-xs text-white/70 tracking-[0.2em] uppercase">
          Free Texts of the Inner Work
        </div>
        <div className="flex items-center justify-center gap-2 font-data text-[10px] text-white/40">
          <span>VOLUMES:</span>
          <span className="text-white">{books.length}</span>
          <span className="text-white/20">•</span>
          <span>SAVED:</span>
          <span className="text-white">{saved.length}</span>
          <span className="text-white/20">•</span>
          <span>ACCESS:</span>
          <span className="text-white">FREE</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs">⟨ ◈ ✦ ◈ ⟩</div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title or author..."
          className="w-full bg-black/60 border border-white/20 focus:border-white/50 outline-none pl-9 pr-9 py-2.5 font-data text-xs text-white placeholder:text-white/40 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 justify-center flex-wrap">
        {categories.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 border transition-all font-data text-[10px] uppercase tracking-wider ${
                active
                  ? 'border-white/60 bg-white/10 text-white'
                  : 'border-white/20 bg-black/40 text-white/60 hover:bg-white/5 hover:border-white/40'
              }`}
            >
              <span>{cat.symbol}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Book list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-data text-[9px] text-white/40 uppercase tracking-widest">Collection</span>
          <span className="font-data text-[9px] text-white/40">{filtered.length} RECORDS</span>
        </div>

        {filtered.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <div className="text-white/50 text-2xl mb-2 font-occult">☽</div>
            <p className="font-occult text-white text-base mb-1">
              {category === 'saved' ? 'No saved volumes yet' : 'No volumes found'}
            </p>
            <p className="font-data text-[10px] text-white/50 mb-4">
              {category === 'saved'
                ? 'Tap the bookmark on any book to keep it here.'
                : 'Try another title, author or category.'}
            </p>
            <button
              onClick={() => { setQuery(''); setCategory('all'); }}
              className="px-4 py-2 border border-white/30 text-white font-data text-[10px] uppercase tracking-wider hover:bg-white/5 transition-all"
            >
              Browse all books
            </button>
          </GlassCard>
        ) : (
          filtered.map((book, i) => {
            const isSaved = saved.includes(book.id);
            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
              >
                <GlassCard className="p-3 hover:border-white/40 transition-all">
                  <div className="flex gap-3">
                    <div className="w-12 h-16 flex-shrink-0 border border-white/25 bg-gradient-to-b from-white/10 to-black flex items-center justify-center">
                      <span className="font-occult text-white/80 text-lg">
                        {categories.find((c) => c.id === book.category)?.symbol}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-occult text-white text-base leading-tight">{book.title}</h3>
                          <p className="font-data text-[10px] text-white/60 mt-0.5">
                            {book.author} • {formatYear(book.year)}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleSaved(book.id)}
                          className={`p-1.5 border transition-all flex-shrink-0 ${
                            isSaved
                              ? 'border-white/50 bg-white/10 text-white'
                              : 'border-white/20 text-white/50 hover:text-white hover:border-white/40'
                          }`}
                          aria-label={isSaved ? 'Remove from saved' : 'Save book'}
                        >
                          {isSaved ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="font-data text-[10px] text-white/50 leading-relaxed mt-1.5 line-clamp-2">
                        {book.summary}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-data text-[9px] text-white/40 uppercase">{formatTime(book.minutes)}</span>
                        <a
                          href={`https://www.gutenberg.org/ebooks/${book.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 border border-white/30 text-white font-data text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all"
                        >
                          <BookOpen className="w-3 h-3" /> Read free <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="text-center font-data text-[8px] text-white/30 tracking-widest pt-2">
        PUBLIC DOMAIN TEXTS VIA PROJECT GUTENBERG
      </div>
    </div>
  );
}
