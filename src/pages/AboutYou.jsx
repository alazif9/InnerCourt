import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/ui/GlassCard';
import HUDCorners from '@/components/hud/HUDCorners';
import NatalChart2D from '@/components/astral/NatalChart2D';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";

const zodiacSigns = {
  aries: { symbol: '♈', name: 'Aries', color: '#FF5733' },
  taurus: { symbol: '♉', name: 'Taurus', color: '#7CB342' },
  gemini: { symbol: '♊', name: 'Gemini', color: '#FFD700' },
  cancer: { symbol: '♋', name: 'Cancer', color: '#4FC3F7' },
  leo: { symbol: '♌', name: 'Leo', color: '#FF9800' },
  virgo: { symbol: '♍', name: 'Virgo', color: '#8D6E63' },
  libra: { symbol: '♎', name: 'Libra', color: '#EC407A' },
  scorpio: { symbol: '♏', name: 'Scorpio', color: '#9C27B0' },
  sagittarius: { symbol: '♐', name: 'Sagittarius', color: '#7C4DFF' },
  capricorn: { symbol: '♑', name: 'Capricorn', color: '#455A64' },
  aquarius: { symbol: '♒', name: 'Aquarius', color: '#00BCD4' },
  pisces: { symbol: '♓', name: 'Pisces', color: '#3F51B5' },
};

const planets = [
  { key: 'sun', name: 'Sun', symbol: '☉' },
  { key: 'moon', name: 'Moon', symbol: '☽' },
  { key: 'mercury', name: 'Mercury', symbol: '☿' },
  { key: 'venus', name: 'Venus', symbol: '♀' },
  { key: 'mars', name: 'Mars', symbol: '♂' },
  { key: 'jupiter', name: 'Jupiter', symbol: '♃' },
  { key: 'saturn', name: 'Saturn', symbol: '♄' },
  { key: 'uranus', name: 'Uranus', symbol: '♅' },
  { key: 'neptune', name: 'Neptune', symbol: '♆' },
  { key: 'pluto', name: 'Pluto', symbol: '♇' },
];

const angles = [
  { key: 'ascendant', name: 'Ascendant' },
  { key: 'midheaven', name: 'Midheaven' },
  { key: 'descendant', name: 'Descendant' },
  { key: 'imumCoeli', name: 'Imum Coeli' },
];

export default function AboutYou() {
  const [chartData, setChartData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

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

  const generateChart = async () => {
    if (!userProfile?.birth_date) return;

    setLoading(true);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate an astrological natal chart analysis for someone born on ${userProfile.birth_date}${userProfile.birth_location ? ` in ${userProfile.birth_location}` : ''}.

Create a detailed intelligence report with planetary positions and interpretations. Return the data in JSON format.

For each planet, provide:
- The zodiac sign it's in (use lowercase: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces)
- The house number (1-12)
- The degree (format: "X°Y'" like "3°13'")

Also provide:
- Ascendant sign and degree
- Midheaven sign and degree
- A brief personality analysis based on the chart
- Key strengths based on planetary positions
- Shadow aspects to work on
- Life path insights`,
      response_json_schema: {
        type: "object",
        properties: {
          planets: {
            type: "object",
            properties: {
              sun: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degree: { type: "string" } } },
              moon: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degree: { type: "string" } } },
              mercury: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degree: { type: "string" } } },
              venus: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degree: { type: "string" } } },
              mars: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degree: { type: "string" } } },
              jupiter: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degree: { type: "string" } } },
              saturn: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degree: { type: "string" } } },
              uranus: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degree: { type: "string" } } },
              neptune: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degree: { type: "string" } } },
              pluto: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degree: { type: "string" } } },
            }
          },
          angles: {
            type: "object",
            properties: {
              ascendant: { type: "object", properties: { sign: { type: "string" }, degree: { type: "string" } } },
              midheaven: { type: "object", properties: { sign: { type: "string" }, degree: { type: "string" } } },
              descendant: { type: "object", properties: { sign: { type: "string" }, degree: { type: "string" } } },
              imumCoeli: { type: "object", properties: { sign: { type: "string" }, degree: { type: "string" } } },
            }
          },
          analysis: {
            type: "object",
            properties: {
              personality: { type: "string" },
              strengths: { type: "array", items: { type: "string" } },
              shadows: { type: "array", items: { type: "string" } },
              lifePath: { type: "string" },
            }
          }
        }
      }
    });

    setChartData(response.planets);
    setAnalysis(response);
    setLoading(false);
    setGenerated(true);
  };

  const getZodiacInfo = (signName) => {
    const key = signName?.toLowerCase();
    return zodiacSigns[key] || { symbol: '?', name: signName, color: '#ffffff' };
  };

  return (
    <div className="space-y-4 relative">
      <HUDCorners />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <Link 
          to={createPageUrl('Profile')} 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-data text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO PROFILE
        </Link>
        
        <h1 className="font-occult text-3xl font-semibold text-gradient-gold tracking-wide text-center">
          About You
        </h1>
        <div className="font-data text-xs text-white/70 tracking-[0.2em] uppercase text-center">
          Astral Intelligence Report
        </div>
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
          ⟨ ☉ ☽ ☿ ♀ ♂ ⟩
        </div>
      </motion.div>

      {!userProfile?.birth_date ? (
        <GlassCard className="p-6 text-center">
          <p className="font-data text-xs text-white/60">
            Birth date required for astral analysis.
          </p>
          <p className="font-data text-[10px] text-white/40 mt-2">
            Update your profile with birth information.
          </p>
        </GlassCard>
      ) : !generated && !loading ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Natal Chart - Static Preview */}
          <GlassCard className="p-4">
            <NatalChart2D chartData={{}} />
          </GlassCard>
          
          <Button
            onClick={generateChart}
            className="w-full border border-white/30 bg-black/40 text-white hover:bg-white/10 font-data text-xs uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Astral Intelligence Report
          </Button>
        </motion.div>
      ) : loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-white/50" />
          </motion.div>
          <p className="font-data text-xs text-white/40 uppercase tracking-wider">
            Calculating celestial positions...
          </p>
        </motion.div>
      ) : (
        <>
          {/* 2D Natal Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <GlassCard className="p-4">
              <NatalChart2D chartData={chartData} />
            </GlassCard>
          </motion.div>

          {/* Planetary Positions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-4">
              <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-4">
                ┌─ PLANETARY MATRIX ─┐
              </div>
              
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-2 pb-2 border-b border-white/10 mb-2">
                <span className="font-data text-[9px] text-white/40 uppercase">Planet</span>
                <span className="font-data text-[9px] text-white/40 uppercase">Sign</span>
                <span className="font-data text-[9px] text-white/40 uppercase text-center">House</span>
                <span className="font-data text-[9px] text-white/40 uppercase text-right">Degree</span>
              </div>
              
              {/* Planet Rows */}
              <div className="space-y-1">
                {planets.map((planet, idx) => {
                  const data = chartData?.[planet.key];
                  const zodiac = getZodiacInfo(data?.sign);
                  
                  return (
                    <motion.div
                      key={planet.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.03 }}
                      className="grid grid-cols-4 gap-2 py-1.5 border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white/60">{planet.symbol}</span>
                        <span className="font-data text-[10px] text-white/80">{planet.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: zodiac.color }}>{zodiac.symbol}</span>
                        <span className="font-data text-[10px] text-white/70">{zodiac.name}</span>
                      </div>
                      <div className="text-center font-data text-[10px] text-white/70">
                        {data?.house || '-'}
                      </div>
                      <div className="text-right font-data text-[10px] text-white/50">
                        {data?.degree || '-'}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* Angles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-4">
              <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
                ┌─ CARDINAL POINTS ─┐
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {angles.map((angle) => {
                  const data = analysis?.angles?.[angle.key];
                  const zodiac = getZodiacInfo(data?.sign);
                  
                  return (
                    <div key={angle.key} className="flex items-center justify-between p-2 border border-white/10 bg-black/30">
                      <span className="font-data text-[9px] text-white/50 uppercase">{angle.name}</span>
                      <div className="flex items-center gap-1">
                        <span style={{ color: zodiac.color }}>{zodiac.symbol}</span>
                        <span className="font-data text-[10px] text-white/70">{zodiac.name}</span>
                        <span className="font-data text-[9px] text-white/40 ml-1">{data?.degree}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* Analysis Section */}
          {analysis?.analysis && (
            <>
              {/* Personality */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="p-4">
                  <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
                    ┌─ CORE IDENTITY ANALYSIS ─┐
                  </div>
                  <p className="font-data text-[11px] text-white/80 leading-relaxed">
                    {analysis.analysis.personality}
                  </p>
                </GlassCard>
              </motion.div>

              {/* Strengths */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <GlassCard className="p-4">
                  <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
                    ┌─ CELESTIAL STRENGTHS ─┐
                  </div>
                  <div className="space-y-2">
                    {analysis.analysis.strengths?.map((strength, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-white/40">◇</span>
                        <span className="font-data text-[10px] text-white/70">{strength}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Shadows */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard className="p-4">
                  <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
                    ┌─ SHADOW ASPECTS ─┐
                  </div>
                  <div className="space-y-2">
                    {analysis.analysis.shadows?.map((shadow, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-white/30">△</span>
                        <span className="font-data text-[10px] text-white/60">{shadow}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Life Path */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <GlassCard className="p-4">
                  <div className="font-data text-[8px] text-white/40 uppercase tracking-widest mb-3">
                    ┌─ DESTINY PATHWAY ─┐
                  </div>
                  <p className="font-data text-[11px] text-white/80 leading-relaxed">
                    {analysis.analysis.lifePath}
                  </p>
                </GlassCard>
              </motion.div>
            </>
          )}

          {/* Footer */}
          <div className="text-center font-data text-[8px] text-white/20 tracking-widest pt-2">
            ASTRAL_ID: {user?.id?.slice(0,8) || '00000000'} • CHART: NATAL • CIPHER: HERMETIC
          </div>
        </>
      )}
    </div>
  );
}