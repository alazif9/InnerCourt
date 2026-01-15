import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip
} from 'recharts';

const wheelOfLifeDimensions = [
  { key: 'career', label: 'Career', fullMark: 100 },
  { key: 'finance', label: 'Finance', fullMark: 100 },
  { key: 'health', label: 'Health', fullMark: 100 },
  { key: 'relationships', label: 'Relationships', fullMark: 100 },
  { key: 'personal', label: 'Personal', fullMark: 100 },
  { key: 'spiritual', label: 'Spiritual', fullMark: 100 },
  { key: 'recreation', label: 'Recreation', fullMark: 100 },
  { key: 'environment', label: 'Environment', fullMark: 100 },
];

const archetypeColors = {
  SHADOW: '#374151',
  HERO: '#DC2626',
  SAGE: '#8B4513',
  CHILD: '#FBBF24',
  MOTHER: '#EC4899',
  TRICKSTER: '#10B981',
  ANIMA: '#7C3AED',
};

export default function Analytics() {
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

  // Sample data - in real app would come from userProfile
  const wheelData = wheelOfLifeDimensions.map(dim => ({
    subject: dim.label,
    value: userProfile?.wheel_of_life?.[dim.key] || Math.floor(Math.random() * 40 + 40),
    fullMark: 100,
  }));

  const archetypeData = Object.keys(archetypeColors).map(arch => ({
    name: arch,
    value: userProfile?.archetype_scores?.[arch] || Math.floor(Math.random() * 60 + 20),
    color: archetypeColors[arch],
  }));

  const overallScore = Math.round(wheelData.reduce((sum, d) => sum + d.value, 0) / wheelData.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-['Cinzel',serif] text-2xl font-semibold text-white">
          Soul Analytics
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Mapping your inner landscape
        </p>
      </motion.div>

      {/* Wheel of Life */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard glowColor="gold" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Cinzel',serif] text-amber-400 font-medium">
              Wheel of Life
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl">☀️</span>
              <span className="text-white font-bold text-xl">{overallScore}</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={wheelData}>
                <PolarGrid 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeDasharray="3 3"
                />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8 }}
                />
                <Radar
                  name="Life Balance"
                  dataKey="value"
                  stroke="#D4AF37"
                  fill="#D4AF37"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* Archetype Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-5">
          <h2 className="font-['Cinzel',serif] text-purple-400 font-medium mb-4">
            Archetype Activation
          </h2>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={archetypeData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                  width={70}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(26,26,46,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {archetypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        <GlassCard className="p-4 text-center">
          <span className="text-3xl">📝</span>
          <p className="text-white font-bold text-xl mt-2">23</p>
          <p className="text-white/50 text-xs">Journal Entries</p>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <span className="text-3xl">💬</span>
          <p className="text-white font-bold text-xl mt-2">47</p>
          <p className="text-white/50 text-xs">Conversations</p>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <span className="text-3xl">🔥</span>
          <p className="text-white font-bold text-xl mt-2">12</p>
          <p className="text-white/50 text-xs">Day Streak</p>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <span className="text-3xl">🌟</span>
          <p className="text-white font-bold text-xl mt-2">HERO</p>
          <p className="text-white/50 text-xs">Dominant Archetype</p>
        </GlassCard>
      </motion.div>
    </div>
  );
}