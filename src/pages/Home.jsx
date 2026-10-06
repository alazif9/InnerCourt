import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import HUDCorners from '@/components/hud/HUDCorners';
import GlassCard from '@/components/ui/GlassCard';
import { ChevronRight } from 'lucide-react';

const features = [
  {
    page: 'Journal',
    symbol: '◐',
    title: 'Journal',
    tag: 'RECORD',
    description: 'Write down your dreams, thoughts and feelings as they arrive.',
  },
  {
    page: 'Insights',
    symbol: '◉',
    title: 'Insights',
    tag: 'REVEAL',
    description: 'Let the oracle read your journal and surface the patterns within.',
  },
  {
    page: 'Library',
    symbol: '☿',
    title: 'Library',
    tag: 'STUDY',
    description: 'Free classic books on the psyche, philosophy and the spirit.',
  },
];

export default function Home() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: entries = [] } = useQuery({
    queryKey: ['journalEntries', user?.email],
    queryFn: () => base44.entities.JournalEntry.filter({ created_by: user?.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const { data: insights = [] } = useQuery({
    queryKey: ['insights', user?.email],
    queryFn: () => base44.entities.Insight.filter({ created_by: user?.email }, '-created_date'),
    enabled: !!user?.email,
  });

  const counts = {
    Journal: `${entries.length} ENTRIES`,
    Insights: `${insights.length} SIGNALS`,
    Library: '13 VOLUMES',
  };

  return (
    <div className="space-y-4 relative">
      <HUDCorners />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-2 space-y-2"
      >
        <h1 className="font-occult text-3xl font-semibold text-gradient-gold tracking-wide">
          The Great Work
        </h1>
        <div className="font-data text-xs text-white/70 tracking-[0.2em] uppercase">
          Write • Reflect • Read
        </div>
        <div className="flex items-center justify-center gap-2 font-data text-[10px] text-white/40">
          <span>ENTRIES:</span>
          <span className="text-white">{entries.length}</span>
          <span className="text-white/20">•</span>
          <span>INSIGHTS:</span>
          <span className="text-white">{insights.length}</span>
          <span className="text-white/20">•</span>
          <span>STATUS:</span>
          <span className="text-white">OPERATIONAL</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs">⟨ ◈ ✦ ◈ ⟩</div>
      </motion.div>

      <div className="space-y-3">
        {features.map((f, i) => (
          <motion.div
            key={f.page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
          >
            <Link to={createPageUrl(f.page)} className="block group">
              <GlassCard className="p-4 hover:border-white/50 transition-all">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded border border-white/30 bg-black/60 flex items-center justify-center flex-shrink-0"
                    style={{ boxShadow: '0 0 15px rgba(255,255,255,0.08)' }}
                  >
                    <span className="text-white text-2xl font-occult">{f.symbol}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-data text-[9px] text-white/50 uppercase tracking-widest">{f.tag}</span>
                      <span className="text-white/20 text-[9px]">•</span>
                      <span className="font-data text-[9px] text-white/50">{counts[f.page]}</span>
                    </div>
                    <h2 className="font-occult text-xl text-white">{f.title}</h2>
                    <p className="font-data text-[10px] text-white/60 leading-relaxed">{f.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <Link
        to={createPageUrl('Profile')}
        className="block text-center font-data text-[8px] text-white/30 tracking-widest hover:text-white/50 transition-colors"
      >
        OPERATOR: {user?.full_name?.toUpperCase() || 'UNKNOWN'} • MATRIX_ID: SOL-{user?.id?.slice(0, 8) || '00000000'}
      </Link>
    </div>
  );
}
