import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const dimensions = [
  { key: 'career', label: 'Career', angle: 0 },
  { key: 'finance', label: 'Finance', angle: 45 },
  { key: 'health', label: 'Health', angle: 90 },
  { key: 'relationships', label: 'Relations', angle: 135 },
  { key: 'personal', label: 'Personal', angle: 180 },
  { key: 'spiritual', label: 'Spiritual', angle: 225 },
  { key: 'recreation', label: 'Recreation', angle: 270 },
  { key: 'environment', label: 'Environ', angle: 315 },
];

export default function TopographicSphere({ data = {}, overallScore = 63 }) {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 15, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const autoRotateRef = useRef(0);

  // Get scores for each dimension
  const scores = dimensions.map(d => ({
    ...d,
    value: data[d.key] || Math.floor(Math.random() * 40 + 40)
  }));

  const avgScore = Math.round(scores.reduce((a, b) => a + b.value, 0) / scores.length);
  const variance = Math.round(Math.sqrt(scores.reduce((a, b) => a + Math.pow(b.value - avgScore, 2), 0) / scores.length));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const rotX = (rotation.x * Math.PI) / 180;
      const rotY = ((rotation.y + autoRotateRef.current) * Math.PI) / 180;

      // Helper: 3D to 2D projection
      const project = (lat, lon, r = radius) => {
        const x3d = r * Math.cos(lat) * Math.sin(lon);
        const y3d = r * Math.sin(lat);
        const z3d = r * Math.cos(lat) * Math.cos(lon);
        
        // Rotate around X
        const y1 = y3d * Math.cos(rotX) - z3d * Math.sin(rotX);
        const z1 = y3d * Math.sin(rotX) + z3d * Math.cos(rotX);
        
        // Rotate around Y
        const x2 = x3d * Math.cos(rotY) + z1 * Math.sin(rotY);
        const z2 = -x3d * Math.sin(rotY) + z1 * Math.cos(rotY);
        
        return {
          x: centerX + x2,
          y: centerY - y1,
          z: z2,
          visible: z2 > -radius * 0.3
        };
      };

      // Draw inner glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
      gradient.addColorStop(0.7, 'rgba(212, 175, 55, 0.02)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw latitude lines
      for (let lat = -75; lat <= 75; lat += 15) {
        const latRad = (lat * Math.PI) / 180;
        ctx.beginPath();
        let started = false;
        
        for (let lon = 0; lon <= 360; lon += 5) {
          const lonRad = (lon * Math.PI) / 180;
          const p = project(latRad, lonRad);
          
          if (p.visible) {
            const opacity = 0.1 + (p.z / radius) * 0.15;
            ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
            
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            if (started) {
              ctx.stroke();
              ctx.beginPath();
              started = false;
            }
          }
        }
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw longitude lines
      for (let lon = 0; lon < 360; lon += 22.5) {
        const lonRad = (lon * Math.PI) / 180;
        ctx.beginPath();
        let started = false;
        
        for (let lat = -90; lat <= 90; lat += 5) {
          const latRad = (lat * Math.PI) / 180;
          const p = project(latRad, lonRad);
          
          if (p.visible) {
            const opacity = 0.1 + (p.z / radius) * 0.15;
            ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
            
            if (!started) {
              ctx.moveTo(p.x, p.y);
              started = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            if (started) {
              ctx.stroke();
              ctx.beginPath();
              started = false;
            }
          }
        }
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw topographic data points and connections
      const dataPoints = scores.map((dim, i) => {
        const angle = (dim.angle * Math.PI) / 180;
        const elevation = dim.value / 100;
        const r = radius * (0.85 + elevation * 0.3);
        return project(0, angle, r);
      });

      // Draw data polygon
      ctx.beginPath();
      dataPoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      
      const dataGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.2);
      dataGradient.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
      dataGradient.addColorStop(1, 'rgba(212, 175, 55, 0.05)');
      ctx.fillStyle = dataGradient;
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw data points with elevation glow
      dataPoints.forEach((p, i) => {
        const score = scores[i].value;
        const intensity = score / 100;
        
        // Outer glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 15);
        glow.addColorStop(0, `rgba(212, 175, 55, ${0.4 * intensity})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Point
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + intensity * 2, 0, Math.PI * 2);
        ctx.fillStyle = score > 70 ? '#fffacd' : score > 50 ? '#d4af37' : '#8a7f3b';
        ctx.fill();
      });

      // Draw fresnel rim glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Auto-rotate
      if (!isDragging) {
        autoRotateRef.current += 0.15;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotation, isDragging, scores]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotation(prev => ({
      x: Math.max(-60, Math.min(60, prev.x - dy * 0.3)),
      y: prev.y + dx * 0.3
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setRotation(prev => ({
      x: Math.max(-60, Math.min(60, prev.x - dy * 0.3)),
      y: prev.y + dx * 0.3
    }));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  return (
    <div className="relative">
      {/* Corner HUD */}
      <div className="absolute top-2 left-2 font-data text-[8px] leading-tight text-[#00cccc]/70">
        <div className="text-white/30">┌─ BALANCE SCAN ─┐</div>
        <div>│ SYNC: <span className="text-[#d4af37]">{avgScore}/100</span></div>
        <div>│ VARIANCE: <span className="text-white/50">±{variance}</span></div>
        <div>│ HARMONICS: <span className="text-[#00ff41]">▓▓</span><span className="text-white/20">░</span></div>
        <div className="text-white/30">└────────────────┘</div>
      </div>

      {/* Score Display */}
      <div className="absolute top-2 right-2 flex items-center gap-2 px-2 py-1 rounded border border-[#d4af37]/40 bg-black/60">
        <span className="font-data text-[8px] text-white/40">BALANCE</span>
        <span className="font-occult text-xl text-[#d4af37]">{avgScore}</span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={320}
        height={320}
        className="w-full max-w-[320px] mx-auto cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      />

      {/* Dimension Labels */}
      <div className="grid grid-cols-4 gap-2 mt-4 px-2">
        {scores.map((dim) => (
          <motion.div
            key={dim.key}
            className="text-center p-1.5 rounded bg-black/40 border border-[#d4af37]/20"
            whileHover={{ borderColor: 'rgba(212,175,55,0.5)' }}
          >
            <div className="font-data text-[7px] text-white/40 uppercase tracking-wider">
              {dim.label}
            </div>
            <div 
              className="font-data text-xs font-medium"
              style={{ color: dim.value > 70 ? '#00ff41' : dim.value > 50 ? '#d4af37' : '#cc0000' }}
            >
              {dim.value}%
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="mt-3 text-center font-data text-[8px] text-white/30">
        <span>8-DIMENSIONAL BALANCE SCAN</span>
        <span className="mx-2">•</span>
        <span>TOPOLOGY REFRESH: 2m ago</span>
      </div>
    </div>
  );
}