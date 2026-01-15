import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import TreeOfLife from '@/components/tree/TreeOfLife';
import GlassCard from '@/components/ui/GlassCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Home() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ created_by: user?.email });
      return profiles[0];
    },
    enabled: !!user?.email,
  });

  const archetypeScores = userProfile?.archetype_scores || {};
  const dominantArchetype = userProfile?.dominant_archetype || 'SOL';

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-2"
      >
        <h1 className="font-['Cinzel',serif] text-2xl font-semibold text-white mb-1">
          Welcome, Seeker
        </h1>
        <p className="text-white/60 text-sm">
          Your journey through the archetypes awaits
        </p>
      </motion.div>

      {/* Tree of Life Navigation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <TreeOfLife archetypeScores={archetypeScores} />
      </motion.div>

      {/* Daily Insight Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard glowColor="gold" className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-['Cinzel',serif] text-amber-400 font-medium mb-1">
                Daily Wisdom
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                "The privilege of a lifetime is to become who you truly are." 
                <span className="text-white/40 block mt-1">— C.G. Jung</span>
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-3"
      >
        <Link to={createPageUrl('Journal')}>
          <GlassCard className="p-4 hover:bg-white/[0.08] transition-colors cursor-pointer">
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-2xl">📝</span>
              <span className="text-white/80 text-sm font-medium">New Entry</span>
            </div>
          </GlassCard>
        </Link>
        
        <Link to={createPageUrl('ArchetypeChat') + `?archetype=${dominantArchetype}`}>
          <GlassCard className="p-4 hover:bg-white/[0.08] transition-colors cursor-pointer">
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-2xl">💬</span>
              <span className="text-white/80 text-sm font-medium">Chat with {dominantArchetype}</span>
            </div>
          </GlassCard>
        </Link>
      </motion.div>

      {/* Recent Activity Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-['Cinzel',serif] text-white/90 font-medium">
              Continue Your Path
            </h3>
            <Link 
              to={createPageUrl('Insights')}
              className="text-amber-400/80 text-sm flex items-center gap-1 hover:text-amber-400"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-2">
            {['Shadow Work Session', 'Hero Activation', 'Inner Child Healing'].map((item, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-sm">{['🌑', '⚔️', '✨'][i]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white/80 text-sm">{item}</p>
                  <p className="text-white/40 text-xs">{['2 days ago', 'Yesterday', 'Today'][i]}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}