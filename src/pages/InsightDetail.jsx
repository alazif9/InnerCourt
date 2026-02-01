import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import { ArrowLeft, Calendar, MessageCircle, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

const archetypeSymbols = {
  SHADOW: '♄', HERO: '♂', ANIMA: '♀', SAGE: '☿',
  MOTHER: '☽', CHILD: '☆', TRICKSTER: '☌', SOL: '☉'
};

const insightCategories = [
  { id: 'shadow', name: 'Shadow', symbol: '♄' },
  { id: 'dreams', name: 'Dreams', symbol: '☽' },
  { id: 'patterns', name: 'Patterns', symbol: '◎' },
  { id: 'growth', name: 'Growth', symbol: '△' },
];

// Sample insights data (same as Insights page)
const sampleInsights = [
  {
    id: 1,
    category: 'shadow',
    title: 'Recurring Avoidance Pattern',
    summary: 'Your journal entries reveal a pattern of avoiding conflict, particularly in professional settings.',
    fullContent: `Your recent journal entries and behavioral patterns reveal a consistent tendency to avoid confrontation, especially in professional environments. This avoidance manifests as:

• Postponing difficult conversations with colleagues
• Accepting additional work rather than setting boundaries
• Withdrawing from situations where your opinion differs from the group

This pattern is connected to your Shadow archetype, which holds the parts of yourself you've learned to suppress. The fear of conflict often stems from early experiences where expressing disagreement led to negative consequences.

**Integration Opportunity:**
The Shadow asks you to recognize that healthy conflict can lead to growth and deeper connections. Your voice matters, and expressing it doesn't make you "difficult" — it makes you authentic.`,
    archetype: 'SHADOW',
    date: new Date(Date.now() - 86400000),
    priority: 'HIGH',
    confidence: 94,
    relatedArchetypes: ['HERO', 'CHILD'],
    suggestedActions: [
      'Journal about a recent situation where you held back your opinion',
      'Practice expressing a small disagreement in a safe environment',
      'Dialogue with your Shadow archetype about the roots of this pattern'
    ]
  },
  {
    id: 2,
    category: 'dreams',
    title: 'Water Symbolism Analysis',
    summary: 'Water has appeared in your recent reflections as a symbol of emotional depth.',
    fullContent: `Water imagery has been a recurring theme in your recent journal entries and dream reflections. This powerful symbol represents:

• The depths of your unconscious mind
• Emotional fluidity and the need to "go with the flow"
• Purification and emotional cleansing

The Anima archetype, which bridges your conscious and unconscious, often speaks through water symbolism. When water appears calm, it suggests emotional equilibrium. Turbulent water may indicate unexpressed emotions seeking release.

**Pattern Analysis:**
In the past two weeks, water has appeared 7 times in your reflections — 4 times as calm (lakes, still ponds) and 3 times as moving (rivers, rain). This suggests you're navigating between states of emotional peace and necessary transformation.`,
    archetype: 'ANIMA',
    date: new Date(Date.now() - 172800000),
    priority: 'MEDIUM',
    confidence: 87,
    relatedArchetypes: ['MOTHER', 'SAGE'],
    suggestedActions: [
      'Pay attention to water in your dreams tonight',
      'Try a water meditation to connect with your emotions',
      'Dialogue with your Anima about what the water represents'
    ]
  },
  {
    id: 3,
    category: 'growth',
    title: 'Hero Activation Rising',
    summary: 'Your courage has been increasing. The challenges you\'ve faced recently have strengthened your inner Hero.',
    fullContent: `Your Hero archetype has shown significant activation over the past month. This manifests as:

• Increased willingness to face challenges head-on
• Growing confidence in your abilities
• Taking initiative in situations you previously avoided

The Hero's journey is about facing fears and discovering your true strength. Recent data shows your Hero activation has increased from 45% to 67% — a remarkable growth of 22 points.

**What This Means:**
You're entering a phase where you're ready to take on bigger challenges. The Hero doesn't seek conflict, but doesn't shy away from necessary battles. Your growing courage is preparing you for the next level of your personal evolution.

**Integration with Shadow:**
Interestingly, as your Hero strengthens, your Shadow work becomes more accessible. The Hero provides the courage needed to face the darker aspects of self that the Shadow holds.`,
    archetype: 'HERO',
    date: new Date(Date.now() - 259200000),
    priority: 'LOW',
    confidence: 91,
    relatedArchetypes: ['SHADOW', 'SOL'],
    suggestedActions: [
      'Identify one challenge you\'ve been postponing and commit to it',
      'Celebrate a recent victory, no matter how small',
      'Dialogue with your Hero about your next quest'
    ]
  },
];

export default function InsightDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const insightId = urlParams.get('id');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  // Find the insight by ID, or show the primary (most recent HIGH priority)
  const insight = insightId 
    ? sampleInsights.find(i => i.id === parseInt(insightId))
    : sampleInsights.filter(i => i.priority === 'HIGH').sort((a, b) => b.date - a.date)[0];

  if (!insight) {
    return (
      <div className="space-y-4 text-center pt-20">
        <p className="text-white/60 font-data">Insight not found</p>
        <button 
          onClick={() => navigate(createPageUrl('Insights'))}
          className="text-white/40 font-data text-sm underline"
        >
          Return to Insights
        </button>
      </div>
    );
  }

  const category = insightCategories.find(c => c.id === insight.category);

  return (
    <div className="space-y-4 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button 
          onClick={() => navigate(createPageUrl('Insights'))}
          className="p-2 border border-white/20 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>
        <div>
          <div className="font-data text-[9px] text-white/40 uppercase tracking-widest">
            Insight Analysis
          </div>
          <h1 className="font-occult text-xl text-white">
            {insight.title}
          </h1>
        </div>
      </motion.div>

      {/* Meta Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 font-data text-[10px] text-white/50"
      >
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {format(insight.date, 'yyyy.MM.dd')}
        </span>
        <span className="text-white/20">•</span>
        <span className={`px-1.5 py-0.5 border ${
          insight.priority === 'HIGH' 
            ? 'border-white/50 text-white' 
            : insight.priority === 'MEDIUM'
            ? 'border-white/30 text-white/60'
            : 'border-white/20 text-white/40'
        }`}>
          {insight.priority}
        </span>
        <span className="text-white/20">•</span>
        <span>{category?.symbol} {category?.name}</span>
        <span className="text-white/20">•</span>
        <span>CONFIDENCE: {insight.confidence}%</span>
      </motion.div>

      {/* Archetype Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded border border-white/30 bg-black/60 flex items-center justify-center"
              style={{ boxShadow: '0 0 20px rgba(255,255,255,0.1)' }}
            >
              <span className="text-white text-2xl font-occult">
                {archetypeSymbols[insight.archetype]}
              </span>
            </div>
            <div>
              <div className="font-data text-[9px] text-white/40 uppercase tracking-widest mb-1">
                Primary Archetype
              </div>
              <h2 className="font-occult text-white text-lg">{insight.archetype}</h2>
              <div className="font-data text-[10px] text-white/50 mt-1">
                Related: {insight.relatedArchetypes?.join(', ')}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Full Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-4">
          <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
            ┌─ Full Analysis ─┐
          </div>
          <div className="text-white/70 font-data text-xs leading-relaxed whitespace-pre-line">
            {insight.fullContent}
          </div>
        </GlassCard>
      </motion.div>

      {/* Suggested Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <GlassCard className="p-4">
          <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
            ┌─ Suggested Actions ─┐
          </div>
          <div className="space-y-2">
            {insight.suggestedActions?.map((action, i) => (
              <div key={i} className="flex items-start gap-2">
                <Sparkles className="w-3 h-3 text-white/50 mt-0.5 flex-shrink-0" />
                <span className="text-white/60 font-data text-xs">{action}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button 
          onClick={() => navigate(createPageUrl('ArchetypeChat') + `?archetype=${insight.archetype}`)}
          className="w-full py-3 border border-white/30 bg-black/40 text-white font-data text-xs uppercase tracking-wider hover:bg-white/5 hover:border-white/50 transition-all flex items-center justify-center gap-2"
          style={{ boxShadow: '0 0 15px rgba(255,255,255,0.05)' }}
        >
          <MessageCircle className="w-4 h-4" />
          Dialogue with {insight.archetype} →
        </button>
      </motion.div>

      {/* Bottom micro-text */}
      <div className="text-center font-data text-[8px] text-white/20 tracking-widest pt-2">
        INSIGHT_ID: INS-{insight.id.toString().padStart(4, '0')} • ORACLE_VERIFIED
      </div>
    </div>
  );
}