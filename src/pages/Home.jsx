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
        <div className="font-mono text-sm text-green-400 terminal-glow mb-2">
          {'>'} SYSTEM INITIALIZED
        </div>
        <h1 className="font-mono text-xl text-green-500 terminal-glow mb-1">
          Welcome, [SEEKER_001].
        </h1>
        <div className="font-mono text-xs text-green-700">
          ARCHETYPE_MATRIX: ACTIVE
        </div>
      </motion.div>

      {/* Tree of Life Navigation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <TreeOfLife archetypeScores={archetypeScores} />
      </motion.div>


    </div>
  );
}