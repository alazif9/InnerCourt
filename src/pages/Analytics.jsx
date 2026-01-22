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
  SHADOW: '#DC2626',
  HERO: '#C0C0C0',
  SAGE: '#8B7355',
  CHILD: '#FBBF24',
  MOTHER: '#EC4899',
  TRICKSTER: '#00FFFF',
  ANIMA: '#7C3AED',
  SOL: '#d4af37',
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
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <h1 className="font-occult text-2xl font-semibold text-gradient-gold">
            Intelligence Report
          </h1>
          <div className="font-data text-xs text-[#00cccc]/60 uppercase tracking-widest">
            Real-Time
          </div>
        </div>
        <p className="font-data text-xs text-white/40 uppercase tracking-wide">
          Archetypal Matrix Analysis • Hermetic Metrics
        </p>
      </motion.div>

      {/* Wheel of Life */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard glowColor="gold" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-occult text-[#d4af37] font-medium text-sm mb-0.5">
                Wheel of Life Matrix
              </h2>
              <div className="font-data text-[10px] text-white/30 uppercase tracking-wider">
                8-Dimensional Balance Scan
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded border border-[#d4af37]/40 bg-[#d4af37]/5">
              <span className="font-data text-xs text-[#d4af37]">☉</span>
              <span className="font-data text-[#d4af37] font-bold text-lg">{overallScore}</span>
            </div>
          </div>
          
          <div className="relative h-64">
            {/* Pentagram overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 100 100">
              <polygon points="50,10 61,35 88,35 67,52 76,78 50,60 24,78 33,52 12,35 39,35" fill="none" stroke="#d4af37" strokeWidth="0.5" />
            </svg>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={wheelData}>
                <PolarGrid 
                  stroke="rgba(212,175,55,0.2)" 
                  strokeDasharray="2 2"
                />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'rgba(212,175,55,0.7)', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: 'rgba(212,175,55,0.4)', fontSize: 8, fontFamily: 'IBM Plex Mono' }}
                />
                <Radar
                  name="Balance"
                  dataKey="value"
                  stroke="#d4af37"
                  fill="#d4af37"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
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
        <GlassCard glowColor="cyan" className="p-4">
          <div className="mb-3">
            <h2 className="font-occult text-[#00cccc] font-medium text-sm mb-0.5">
              Archetypal Distribution
            </h2>
            <div className="font-data text-[10px] text-white/30 uppercase tracking-wider">
              Hermetic Power Levels • Alchemical Balance
            </div>
          </div>
          
          <div className="relative h-52">
            {/* Hexagram grid overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {[...Array(7)].map((_, i) => (
                  <line key={i} x1="0" y1={i * 14.3} x2="100" y2={i * 14.3} stroke="#00cccc" strokeWidth="0.3" />
                ))}
              </svg>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={archetypeData} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fill: 'rgba(0,204,204,0.7)', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
                  width={80}
                />
                <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                  {archetypeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      fillOpacity={0.6}
                      stroke={entry.color}
                      strokeWidth={1}
                    />
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
        <GlassCard glowColor="silver" className="p-3">
          <div className="font-data text-[10px] text-[#c0c0c0]/60 uppercase tracking-wider mb-1">
            Journal Ops
          </div>
          <p className="text-gradient-silver font-bold text-2xl font-data">23</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1 h-1 rounded-full bg-[#00cccc]" />
            <span className="font-data text-[9px] text-white/30">RECORDED</span>
          </div>
        </GlassCard>
        
        <GlassCard glowColor="silver" className="p-3">
          <div className="font-data text-[10px] text-[#c0c0c0]/60 uppercase tracking-wider mb-1">
            Chat Sessions
          </div>
          <p className="text-gradient-silver font-bold text-2xl font-data">47</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1 h-1 rounded-full bg-[#00cccc]" />
            <span className="font-data text-[9px] text-white/30">ACTIVE</span>
          </div>
        </GlassCard>
        
        <GlassCard glowColor="gold" className="p-3">
          <div className="font-data text-[10px] text-[#d4af37]/60 uppercase tracking-wider mb-1">
            Streak Counter
          </div>
          <p className="text-gradient-gold font-bold text-2xl font-data">12</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1 h-1 rounded-full bg-[#d4af37]" />
            <span className="font-data text-[9px] text-white/30">DAYS</span>
          </div>
        </GlassCard>
        
        <GlassCard glowColor="purple" className="p-3">
          <div className="font-data text-[10px] text-purple-400/60 uppercase tracking-wider mb-1">
            Dominant Node
          </div>
          <p className="text-purple-400 font-bold text-xl font-occult">Hero</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1 h-1 rounded-full bg-purple-500" />
            <span className="font-data text-[9px] text-white/30">ARCHETYPE</span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}