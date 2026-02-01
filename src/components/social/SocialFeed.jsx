import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import { Calendar, Share2, BookOpen, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

const archetypeSymbols = {
  SOL: '☉', SAGE: '☿', HERO: '♂', MOTHER: '☽',
  SHADOW: '♄', ANIMA: '♀', CHILD: '☆', TRICKSTER: '☌'
};

const moods = {
  transcendent: { symbol: '△', color: '#ffffff' },
  peaceful: { symbol: '◯', color: '#cccccc' },
  curious: { symbol: '◈', color: '#aaaaaa' },
  challenged: { symbol: '⬡', color: '#888888' },
  struggling: { symbol: '◐', color: '#666666' },
  transforming: { symbol: '∞', color: '#dddddd' },
};

export default function SocialFeed({ friendEmails = [] }) {
  const { data: sharedEntries = [], isLoading } = useQuery({
    queryKey: ['sharedEntries', friendEmails],
    queryFn: async () => {
      if (friendEmails.length === 0) return [];
      
      // Fetch shared journal entries from friends
      const journalEntries = await Promise.all(
        friendEmails.map(email =>
          base44.entities.JournalEntry.filter({ 
            created_by: email, 
            shared_with_friends: true 
          }, '-shared_date', 5)
        )
      );
      
      // Fetch shared insights from friends
      const insightEntries = await Promise.all(
        friendEmails.map(email =>
          base44.entities.Insight.filter({ 
            created_by: email, 
            shared_with_friends: true 
          }, '-shared_date', 5)
        )
      );
      
      // Mark entry types and flatten
      const journals = journalEntries.flat().map(e => ({ ...e, _type: 'journal' }));
      const insights = insightEntries.flat().map(e => ({ ...e, _type: 'insight' }));
      
      // Combine and sort by shared_date
      return [...journals, ...insights]
        .sort((a, b) => new Date(b.shared_date) - new Date(a.shared_date))
        .slice(0, 10);
    },
    enabled: friendEmails.length > 0,
  });

  if (isLoading) {
    return (
      <GlassCard className="p-4">
        <div className="flex justify-center py-6">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 bg-white rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  if (sharedEntries.length === 0) {
    return (
      <GlassCard className="p-4">
        <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
          ┌─ RESONANCE_FEED ─┐
        </div>
        <div className="text-center py-6">
          <Share2 className="w-6 h-6 text-white/20 mx-auto mb-2" />
          <div className="font-data text-xs text-white/40">NO SHARED TRANSMISSIONS</div>
          <div className="font-data text-[10px] text-white/30 mt-1">
            Connections haven't shared yet
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
        ┌─ RESONANCE_FEED ─┐
      </div>
      
      <div className="space-y-3">
        {sharedEntries.map((entry, i) => {
          const moodData = moods[entry.mood];
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 border border-white/10 bg-black/40 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Archetype Symbol */}
                <div className="w-8 h-8 rounded-full border border-white/20 bg-black/60 flex items-center justify-center flex-shrink-0">
                  <span className="text-white/80 text-sm">
                    {entry.archetype ? archetypeSymbols[entry.archetype] : '◇'}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Author info */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-data text-[10px] text-white/60">
                      @{entry.created_by?.split('@')[0]}
                    </span>
                    {entry._type === 'insight' ? (
                      <Sparkles className="w-3 h-3 text-white/30" />
                    ) : (
                      <BookOpen className="w-3 h-3 text-white/30" />
                    )}
                    <span className="font-data text-[9px] text-white/30">
                      shared {entry._type === 'insight' ? 'insight' : 'journal'}
                    </span>
                    {moodData && (
                      <span style={{ color: moodData.color }} className="text-xs">
                        {moodData.symbol}
                      </span>
                    )}
                  </div>
                  
                  {/* Title */}
                  {entry.title && (
                    <h4 className="text-white/80 font-occult text-sm mb-1">{entry.title}</h4>
                  )}
                  
                  {/* Content preview */}
                  <p className="text-white/40 font-data text-[10px] line-clamp-3 leading-relaxed">
                    {entry._type === 'insight' ? entry.summary : entry.content}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center gap-2 mt-2 font-data text-[8px] text-white/30">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(entry.shared_date || entry.created_date), 'yyyy.MM.dd HH:mm')}</span>
                    {entry.archetype && (
                      <>
                        <span className="text-white/20">•</span>
                        <span>{entry.archetype}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}