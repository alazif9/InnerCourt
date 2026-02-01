import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GlassCard from '@/components/ui/GlassCard';
import HUDCorners from '@/components/hud/HUDCorners';
import { Calendar, ArrowRight, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const insightCategories = [
  { id: 'shadow', name: 'Shadow', symbol: '♄' },
  { id: 'dreams', name: 'Dreams', symbol: '☽' },
  { id: 'patterns', name: 'Patterns', symbol: '◎' },
  { id: 'growth', name: 'Growth', symbol: '△' },
];

const archetypeSymbols = {
  SHADOW: '♄', HERO: '♂', ANIMA: '♀', SAGE: '☿',
  MOTHER: '☽', CHILD: '☆', TRICKSTER: '☌', SOL: '☉'
};

const sampleInsights = [
  {
    id: 1,
    category: 'shadow',
    title: 'Recurring Avoidance Pattern',
    summary: 'Your journal entries reveal a pattern of avoiding conflict, particularly in professional settings.',
    archetype: 'SHADOW',
    date: new Date(Date.now() - 86400000),
    priority: 'HIGH',
  },
  {
    id: 2,
    category: 'dreams',
    title: 'Water Symbolism Analysis',
    summary: 'Water has appeared in your recent reflections as a symbol of emotional depth.',
    archetype: 'ANIMA',
    date: new Date(Date.now() - 172800000),
    priority: 'MEDIUM',
  },
  {
    id: 3,
    category: 'growth',
    title: 'Hero Activation Rising',
    summary: 'Your courage has been increasing. The challenges you\'ve faced recently have strengthened your inner Hero.',
    archetype: 'HERO',
    date: new Date(Date.now() - 259200000),
    priority: 'LOW',
  },
];

export default function Insights() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const activeCategory = urlParams.get('category');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  // Filter insights based on selected category
  const filteredInsights = activeCategory 
    ? sampleInsights.filter(i => i.category === activeCategory)
    : sampleInsights;

  const activeInsights = filteredInsights.length;
  const highPriority = filteredInsights.filter(i => i.priority === 'HIGH').length;

  const handleCategoryClick = (categoryId) => {
    if (activeCategory === categoryId) {
      // If clicking the same category, clear filter
      navigate(createPageUrl('Insights'));
    } else {
      navigate(createPageUrl('Insights') + `?category=${categoryId}`);
    }
  };

  return (
    <div className="space-y-4 relative">
      <HUDCorners />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-2 space-y-2"
      >
        <h1 className="font-occult text-3xl font-semibold text-gradient-gold tracking-wide">
          Oracle Insights
        </h1>
        <div className="font-data text-xs text-white/70 tracking-[0.2em] uppercase">
          Pattern Recognition Matrix
        </div>
        <div className="flex items-center justify-center gap-2 font-data text-[10px] text-white/40">
          <span>ACTIVE SIGNALS:</span>
          <span className="text-white">{activeInsights}</span>
          <span className="text-white/20">•</span>
          <span>PRIORITY:</span>
          <span className="text-white">{highPriority} HIGH</span>
          <span className="text-white/20">•</span>
          <span>STATUS:</span>
          <span className="text-white">SCANNING</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
          ⟨ ◈ ✦ ◈ ⟩
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 justify-center"
      >
        {insightCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all font-data text-[10px] uppercase tracking-wider ${
                isActive 
                  ? 'border-white/60 bg-white/10 text-white' 
                  : 'border-white/20 bg-black/40 hover:bg-white/5 hover:border-white/40'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-white/70'}>{cat.symbol}</span>
              <span className={isActive ? 'text-white' : 'text-white/60'}>{cat.name}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Featured Insight - Primary Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-4 relative overflow-hidden">
          {/* Scan line effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent h-1"
            animate={{ y: [0, 150, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
            ┌─ PRIMARY REVELATION ─┐
          </div>
          
          <div className="flex items-start gap-3 mb-3">
            <div 
              className="w-12 h-12 rounded border border-white/30 bg-black/60 flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: '0 0 15px rgba(255,255,255,0.1)' }}
            >
              <span className="text-white text-xl font-occult">◈</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-data text-[9px] text-white/50 uppercase">Today's Oracle</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
              <h3 className="font-occult text-white text-lg">
                The Integration Point
              </h3>
            </div>
          </div>
          
          <p className="text-white/60 font-data text-xs leading-relaxed mb-4 pl-15">
            "Your Shadow and Hero archetypes are approaching a critical integration point. 
            The courage you've been developing is now ready to face the aspects of yourself 
            you've been avoiding."
          </p>
          
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-3 font-data text-[9px] text-white/30">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> 
                {format(new Date(), 'yyyy.MM.dd')}
              </span>
              <span className="text-white/20">•</span>
              <span>CONFIDENCE: 94%</span>
            </div>
            <button 
              onClick={() => navigate(createPageUrl('InsightDetail'))}
              className="flex items-center gap-1 text-white font-data text-[10px] uppercase tracking-wider hover:text-white/70 transition-colors"
            >
              Explore <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Insights List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-data text-[9px] text-white/40 uppercase tracking-widest">
            Recent Discoveries
          </span>
          <span className="font-data text-[9px] text-white/30">
            {filteredInsights.length} RECORDS
          </span>
        </div>
        
        {filteredInsights.map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <GlassCard className="p-3 hover:border-white/40 transition-all cursor-pointer group">
              <div className="flex items-start gap-3">
                {/* Archetype Symbol */}
                <div 
                  className="w-10 h-10 rounded border border-white/20 bg-black/40 flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: '0 0 8px rgba(255,255,255,0.05)' }}
                >
                  <span className="text-white/80 text-base font-occult">
                    {archetypeSymbols[insight.archetype]}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white/90 font-occult text-sm truncate">
                      {insight.title}
                    </h3>
                    <span className={`px-1.5 py-0.5 border font-data text-[8px] uppercase ${
                      insight.priority === 'HIGH' 
                        ? 'border-white/50 text-white' 
                        : insight.priority === 'MEDIUM'
                        ? 'border-white/30 text-white/60'
                        : 'border-white/20 text-white/40'
                    }`}>
                      {insight.priority}
                    </span>
                  </div>
                  
                  <p className="text-white/40 font-data text-[10px] line-clamp-2 mb-2 leading-relaxed">
                    {insight.summary}
                  </p>
                  
                  <div className="flex items-center gap-3 font-data text-[9px] text-white/30">
                    <span>{format(insight.date, 'yyyy.MM.dd')}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/50">{insight.archetype}</span>
                    <span className="text-white/20">•</span>
                    <span>{insightCategories.find(c => c.id === insight.category)?.name}</span>
                  </div>
                </div>
                
                <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0 group-hover:text-white/50 transition-colors" />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Action Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassCard className="p-4">
          <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
            ┌─ RECOMMENDED ACTION ─┐
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="text-white text-lg">✦</span>
            <h3 className="font-occult text-white">
              Shadow Dialogue Protocol
            </h3>
          </div>
          
          <p className="text-white/50 font-data text-xs mb-4">
            Based on pattern analysis, initiate conversation with your Shadow archetype
            regarding the avoidance sequence detected.
          </p>
          
          <button 
            className="w-full py-2.5 border border-white/30 bg-black/40 text-white font-data text-xs uppercase tracking-wider hover:bg-white/5 hover:border-white/50 transition-all"
            style={{ boxShadow: '0 0 15px rgba(255,255,255,0.05)' }}
          >
            Initialize Dialogue →
          </button>
        </GlassCard>
      </motion.div>

      {/* Bottom micro-text */}
      <div className="text-center font-data text-[8px] text-white/20 tracking-widest pt-2">
        ORACLE_ID: INS-{user?.id?.slice(0,8) || '00000000'} • PATTERN_LOCK: ACTIVE
      </div>
    </div>
  );
}