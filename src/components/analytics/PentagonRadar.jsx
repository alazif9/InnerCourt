import React from 'react';
import { motion } from 'framer-motion';

const dimensions = [
  { key: 'social', label: 'SOCIAL', symbol: '◎' },
  { key: 'physical', label: 'PHYSICAL', symbol: '△' },
  { key: 'spiritual', label: 'SPIRITUAL', symbol: '✦' },
  { key: 'economic', label: 'ECONOMIC', symbol: '◇' },
  { key: 'technical', label: 'TECHNICAL', symbol: '⬡' },
];

export default function PentagonRadar({ data = {}, overallScore = 0 }) {
  const size = 280;
  const center = size / 2;
  const maxRadius = 100;
  const levels = [20, 40, 60, 80, 100];

  // Get values for each dimension
  const values = dimensions.map(d => data[d.key] || Math.floor(Math.random() * 40 + 40));
  
  // Calculate points for pentagon
  const getPoint = (index, value) => {
    const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Get label position (outside the chart)
  const getLabelPoint = (index) => {
    const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2;
    const radius = maxRadius + 30;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Create path for data polygon
  const dataPath = values
    .map((v, i) => {
      const point = getPoint(i, v);
      return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ') + ' Z';

  // Create grid lines
  const gridLevels = levels.map(level => {
    return dimensions
      .map((_, i) => {
        const point = getPoint(i, level);
        return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
      })
      .join(' ') + ' Z';
  });

  return (
    <div className="relative">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-4 font-data text-[9px]">
        <div className="flex items-center gap-2">
          <span className="text-white/40">BALANCE SCAN</span>
          <span className="text-white/20">┌───────────┐</span>
        </div>
        <div className="flex items-center gap-4 text-white/50">
          <span>SYNC: <span className="text-white">{overallScore}/100</span></span>
          <span>VARIANCE: <span className="text-white">±{Math.round(Math.abs(Math.max(...values) - Math.min(...values)) / 2)}</span></span>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="flex justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Grid levels */}
          {gridLevels.map((path, i) => (
            <path
              key={i}
              d={path}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          {dimensions.map((_, i) => {
            const point = getPoint(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon - animated */}
          <motion.path
            d={dataPath}
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          />

          {/* Data points */}
          {values.map((v, i) => {
            const point = getPoint(i, v);
            return (
              <motion.g key={i}>
                {/* Glow effect */}
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  fill="rgba(255,255,255,0.1)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
                {/* Point */}
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="white"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                />
              </motion.g>
            );
          })}

          {/* Center point */}
          <circle cx={center} cy={center} r="3" fill="rgba(255,255,255,0.3)" />

          {/* Labels */}
          {dimensions.map((dim, i) => {
            const labelPoint = getLabelPoint(i);
            const value = values[i];
            return (
              <g key={dim.key}>
                <text
                  x={labelPoint.x}
                  y={labelPoint.y - 8}
                  textAnchor="middle"
                  className="fill-white/40 font-data text-[8px] uppercase tracking-wider"
                >
                  {dim.symbol} {dim.label}
                </text>
                <text
                  x={labelPoint.x}
                  y={labelPoint.y + 8}
                  textAnchor="middle"
                  className="fill-white font-data text-[11px]"
                >
                  {value}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Balance indicator */}
      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center gap-3 px-4 py-2 border border-white/20 bg-black/40">
          <span className="font-data text-[9px] text-white/40 uppercase">Balance Index</span>
          <div className="w-20 h-1.5 bg-white/10 relative">
            <motion.div 
              className="h-full bg-white/70"
              initial={{ width: 0 }}
              animate={{ width: `${overallScore}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <span className="font-data text-sm text-white">{overallScore}</span>
        </div>
      </div>

      {/* Bottom status */}
      <div className="flex items-center justify-between mt-3 font-data text-[8px] text-white/30">
        <span>● TOPOLOGY REFRESH: LIVE</span>
        <span>DIMENSIONAL HARMONICS: {overallScore >= 60 ? 'BALANCED' : 'CALIBRATING'}</span>
      </div>
    </div>
  );
}