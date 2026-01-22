import React from 'react';

const zodiacSigns = [
  { key: 'aries', symbol: '♈', color: '#FF5733' },
  { key: 'taurus', symbol: '♉', color: '#7CB342' },
  { key: 'gemini', symbol: '♊', color: '#FFD700' },
  { key: 'cancer', symbol: '♋', color: '#4FC3F7' },
  { key: 'leo', symbol: '♌', color: '#FF9800' },
  { key: 'virgo', symbol: '♍', color: '#8D6E63' },
  { key: 'libra', symbol: '♎', color: '#EC407A' },
  { key: 'scorpio', symbol: '♏', color: '#9C27B0' },
  { key: 'sagittarius', symbol: '♐', color: '#7C4DFF' },
  { key: 'capricorn', symbol: '♑', color: '#607D8B' },
  { key: 'aquarius', symbol: '♒', color: '#00BCD4' },
  { key: 'pisces', symbol: '♓', color: '#3F51B5' },
];

const planetData = [
  { key: 'sun', symbol: '☉', name: 'Sun' },
  { key: 'moon', symbol: '☽', name: 'Moon' },
  { key: 'mercury', symbol: '☿', name: 'Mercury' },
  { key: 'venus', symbol: '♀', name: 'Venus' },
  { key: 'mars', symbol: '♂', name: 'Mars' },
  { key: 'jupiter', symbol: '♃', name: 'Jupiter' },
  { key: 'saturn', symbol: '♄', name: 'Saturn' },
  { key: 'uranus', symbol: '♅', name: 'Uranus' },
  { key: 'neptune', symbol: '♆', name: 'Neptune' },
  { key: 'pluto', symbol: '♇', name: 'Pluto' },
];

const aspectColors = {
  conjunction: '#ffffff',
  sextile: '#4FC3F7',
  square: '#FF5733',
  trine: '#4FC3F7',
  opposition: '#FF5733',
};

export default function NatalChart2D({ chartData = {} }) {
  const cx = 160;
  const cy = 160;
  const outerRadius = 150;
  const zodiacInnerRadius = 125;
  const houseOuterRadius = 120;
  const houseInnerRadius = 45;
  const planetRadius = 85;

  // Helper to convert degrees to radians (0° = top, clockwise)
  const degToRad = (deg) => ((deg - 90) * Math.PI) / 180;

  // Get position on circle
  const getPos = (deg, radius) => ({
    x: cx + Math.cos(degToRad(deg)) * radius,
    y: cy + Math.sin(degToRad(deg)) * radius,
  });

  // Convert sign + degree to absolute degree (0-360)
  const getAbsoluteDegree = (sign, degree) => {
    const signIndex = zodiacSigns.findIndex(z => z.key === sign?.toLowerCase());
    if (signIndex === -1) return 0;
    const degNum = parseInt(degree) || 0;
    return signIndex * 30 + degNum;
  };

  // Get planet positions
  const planets = planetData.map(p => {
    const data = chartData[p.key];
    if (!data) return null;
    const signInfo = zodiacSigns.find(z => z.key === data.sign?.toLowerCase());
    const absDeg = getAbsoluteDegree(data.sign, data.degree);
    return {
      ...p,
      ...data,
      absDeg,
      color: signInfo?.color || '#ffffff',
    };
  }).filter(Boolean);

  // Generate aspect lines between planets
  const aspects = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const diff = Math.abs(planets[i].absDeg - planets[j].absDeg);
      const angle = diff > 180 ? 360 - diff : diff;
      
      let aspectType = null;
      if (angle <= 8) aspectType = 'conjunction';
      else if (angle >= 57 && angle <= 63) aspectType = 'sextile';
      else if (angle >= 87 && angle <= 93) aspectType = 'square';
      else if (angle >= 117 && angle <= 123) aspectType = 'trine';
      else if (angle >= 175 && angle <= 185) aspectType = 'opposition';
      
      if (aspectType) {
        aspects.push({
          from: planets[i],
          to: planets[j],
          type: aspectType,
        });
      }
    }
  }

  return (
    <div className="relative">
      {/* HUD Overlay */}
      <div className="absolute top-2 left-2 font-data text-[8px] leading-tight z-10">
        <div className="text-white/40">ASTRAL SCAN</div>
        <div className="text-white/70">PLANETS: <span className="text-white">{planets.length}</span></div>
        <div className="text-white/70">HOUSES: <span className="text-white">12</span></div>
        <div className="text-white/70">ASPECTS: <span className="text-white">{aspects.length}</span></div>
        <div className="text-white/70">STATUS: <span className="text-white/50">MAPPED</span></div>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-2 px-2 py-1 rounded border border-white/30 bg-black/60 z-10">
        <span className="font-data text-[8px] text-white/40">NATAL</span>
        <span className="text-white text-lg">☿</span>
      </div>

      <svg viewBox="0 0 320 320" className="w-full max-w-[320px] mx-auto">
        {/* Background circles */}
        <circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={zodiacInnerRadius} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={houseOuterRadius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={houseInnerRadius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

        {/* Zodiac segments */}
        {zodiacSigns.map((sign, i) => {
          const startAngle = i * 30;
          const endAngle = (i + 1) * 30;
          const midAngle = startAngle + 15;
          
          // Division line
          const innerPos = getPos(startAngle, zodiacInnerRadius);
          const outerPos = getPos(startAngle, outerRadius);
          
          // Symbol position
          const symbolPos = getPos(midAngle, (zodiacInnerRadius + outerRadius) / 2);
          
          // Degree markers (every 5°)
          const degreeMarkers = [];
          for (let d = 0; d < 30; d += 5) {
            const deg = startAngle + d;
            const inner = getPos(deg, outerRadius - 5);
            const outer = getPos(deg, outerRadius);
            degreeMarkers.push(
              <line
                key={`deg-${i}-${d}`}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
              />
            );
          }

          return (
            <g key={sign.key}>
              {/* Division line */}
              <line
                x1={innerPos.x}
                y1={innerPos.y}
                x2={outerPos.x}
                y2={outerPos.y}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
              {/* Degree markers */}
              {degreeMarkers}
              {/* Zodiac symbol */}
              <text
                x={symbolPos.x}
                y={symbolPos.y}
                fill={sign.color}
                fontSize="14"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontFamily: 'serif' }}
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        {/* House divisions */}
        {[...Array(12)].map((_, i) => {
          const angle = i * 30;
          const innerPos = getPos(angle, houseInnerRadius);
          const outerPos = getPos(angle, houseOuterRadius);
          const labelPos = getPos(angle + 15, (houseInnerRadius + houseOuterRadius) / 2);
          
          return (
            <g key={`house-${i}`}>
              <line
                x1={innerPos.x}
                y1={innerPos.y}
                x2={outerPos.x}
                y2={outerPos.y}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill="rgba(255,255,255,0.3)"
                fontSize="8"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-data"
              >
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Aspect lines */}
        {aspects.map((aspect, i) => {
          const pos1 = getPos(aspect.from.absDeg, planetRadius - 15);
          const pos2 = getPos(aspect.to.absDeg, planetRadius - 15);
          
          return (
            <line
              key={`aspect-${i}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={aspectColors[aspect.type]}
              strokeWidth={aspect.type === 'conjunction' ? 1.5 : 1}
              strokeOpacity={0.4}
              strokeDasharray={aspect.type === 'square' || aspect.type === 'opposition' ? '3,2' : 'none'}
            />
          );
        })}

        {/* Planets */}
        {planets.map((planet, i) => {
          // Offset planets slightly to avoid overlap
          const offset = (i % 3 - 1) * 8;
          const pos = getPos(planet.absDeg, planetRadius + offset);
          
          return (
            <g key={planet.key}>
              {/* Planet glow */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={10}
                fill={planet.color}
                fillOpacity={0.15}
              />
              {/* Planet circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={6}
                fill={planet.color}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="1"
              />
              {/* Planet symbol */}
              <text
                x={pos.x}
                y={pos.y}
                fill="#000"
                fontSize="8"
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight="bold"
              >
                {planet.symbol}
              </text>
              {/* Degree label */}
              <text
                x={pos.x}
                y={pos.y + 14}
                fill="rgba(255,255,255,0.5)"
                fontSize="6"
                textAnchor="middle"
                className="font-data"
              >
                {planet.degree}
              </text>
            </g>
          );
        })}

        {/* Center decoration */}
        <circle cx={cx} cy={cy} r={20} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={8} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.4)" />
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-3 mt-3 flex-wrap px-2">
        {planets.slice(0, 5).map(planet => (
          <div key={planet.key} className="flex items-center gap-1">
            <span style={{ color: planet.color }} className="text-sm">{planet.symbol}</span>
            <span className="font-data text-[8px] text-white/50">{planet.sign?.slice(0,3).toUpperCase()}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-3 mt-1 flex-wrap px-2">
        {planets.slice(5).map(planet => (
          <div key={planet.key} className="flex items-center gap-1">
            <span style={{ color: planet.color }} className="text-sm">{planet.symbol}</span>
            <span className="font-data text-[8px] text-white/50">{planet.sign?.slice(0,3).toUpperCase()}</span>
          </div>
        ))}
      </div>

      {/* Bottom Status */}
      <div className="mt-3 flex items-center justify-center gap-4 font-data text-[8px] text-white/30">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
          CELESTIAL MATRIX
        </span>
        <span>•</span>
        <span>CIPHER: HERMETIC</span>
      </div>
    </div>
  );
}