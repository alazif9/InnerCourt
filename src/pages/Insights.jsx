import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import { Eye, Calendar, ArrowRight, Lightbulb, Stars, Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';

const insightCategories = [
  { id: 'shadow', name: 'Shadow Work', icon: '🌑', color: '#374151' },
  { id: 'dreams', name: 'Dream Analysis', icon: '🌙', color: '#7C3AED' },
  { id: 'patterns', name: 'Life Patterns', icon: '🔮', color: '#EC4899' },
  { id: 'growth', name: 'Growth Areas', icon: '🌱', color: '#10B981' },
];

const sampleInsights = [
  {
    id: 1,
    category: 'shadow',
    title: 'Recurring Avoidance Pattern',
    summary: 'Your journal entries reveal a pattern of avoiding conflict, particularly in professional settings. This shadow aspect may stem from early experiences of criticism.',
    archetype: 'SHADOW',
    date: new Date(Date.now() - 86400000),
    actionable: 'Practice one small act of assertive communication this week.',
  },
  {
    id: 2,
    category: 'dreams',
    title: 'Water Symbolism Analysis',
    summary: 'Water has appeared in your recent reflections as a symbol of emotional depth. Your psyche is calling for deeper emotional processing.',
    archetype: 'ANIMA',
    date: new Date(Date.now() - 172800000),
    actionable: 'Spend time near water this week for contemplation.',
  },
  {
    id: 3,
    category: 'growth',
    title: 'Hero Activation Rising',
    summary: 'Your courage has been increasing. The challenges you\'ve faced recently have strengthened your inner Hero archetype significantly.',
    archetype: 'HERO',
    date: new Date(Date.now() - 259200000),
    actionable: 'Take on a slightly larger challenge you\'ve been postponing.',
  },
];

const archetypeIcons = {
  SHADOW: '🌑',
  HERO: '⚔️',
  ANIMA: '🔮',
  SAGE: '🦉',
  MOTHER: '🌸',
  CHILD: '✨',
  TRICKSTER: '🃏',
  SOL: '☀️',
};

export default function Insights() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-['Cinzel',serif] text-2xl font-semibold text-white">
          Soul Insights
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Patterns revealed from your inner work
        </p>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {insightCategories.map((cat) => (
          <button
            key={cat.id}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            <span>{cat.icon}</span>
            <span className="text-white/80 text-sm">{cat.name}</span>
          </button>
        ))}
      </motion.div>

      {/* Featured Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard glowColor="purple" className="p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
          
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                Today's Revelation
              </p>
              <h3 className="font-['Cinzel',serif] text-white font-medium mt-1">
                The Integration Point
              </h3>
            </div>
          </div>
          
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            "Your Shadow and Hero archetypes are approaching a critical integration point. 
            The courage you've been developing is now ready to face the aspects of yourself 
            you've been avoiding. This is a profound opportunity for wholeness."
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Generated today
            </span>
            <button className="flex items-center gap-1 text-white text-sm hover:text-white/80">
              Explore <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Insights List */}
      <div className="space-y-3">
        <h2 className="font-['Cinzel',serif] text-white/80 text-sm uppercase tracking-wider px-1">
          Recent Discoveries
        </h2>
        
        {sampleInsights.map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <GlassCard className="p-4 hover:bg-white/[0.08] transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{archetypeIcons[insight.archetype]}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium text-sm">
                      {insight.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs">
                      {insight.archetype}
                    </span>
                  </div>
                  
                  <p className="text-white/50 text-xs line-clamp-2 mb-2">
                    {insight.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/30 text-xs">
                      {format(insight.date, 'MMM d')}
                    </span>
                    <span className="text-white/80 text-xs">
                      {insightCategories.find(c => c.id === insight.category)?.name}
                    </span>
                  </div>
                </div>
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
        <GlassCard className="p-5 border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <Stars className="w-5 h-5 text-white" />
            <h3 className="font-['Cinzel',serif] text-white font-medium">
              Recommended Action
            </h3>
          </div>
          <p className="text-white/70 text-sm mb-3">
            Based on your insights, consider having a conversation with your Shadow archetype
            about the avoidance pattern that has emerged.
          </p>
          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-white/10 to-white/5 text-white text-sm font-medium hover:from-white/20 hover:to-white/10 transition-colors">
            Start Shadow Dialogue →
          </button>
        </GlassCard>
      </motion.div>
    </div>
  );
}