import React, { useState, useEffect } from 'react';

export default function StatusOverlay() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Top-Left Corner Stats */}
      <div className="absolute top-0 left-0 p-3 font-data text-[9px] leading-tight">
        <div className="text-[#00cccc]/60 mb-1">┌─────────────</div>
        <div className="text-white/40">│ RESONANCE</div>
        <div className="text-[#00cccc]/80 flex items-center gap-1">
          │ <span className="text-[#00ff41]">████████</span><span className="text-white/20">░░</span> 87%
        </div>
        <div className="text-white/40">│ COHERENCE</div>
        <div className="text-[#00cccc]/80 flex items-center gap-1">
          │ <span className="text-[#d4af37]">██████</span><span className="text-white/20">░░░░</span> 63%
        </div>
        <div className="text-white/20">│</div>
        <div className="text-white/20">│ NODE_ID: 0x4a7f2c</div>
      </div>

      {/* Top-Right Corner Stats */}
      <div className="absolute top-0 right-0 p-3 font-data text-[9px] text-right leading-tight">
        <div className="text-white/30">
          {time.toLocaleTimeString('en-US', { hour12: false })} GMT-3
        </div>
        <div className="text-white/40 mt-1">LAST SYNC: 2m ago</div>
        <div className="text-white/40">SESSIONS: <span className="text-[#00ff41]">3</span> active</div>
        <div className="text-white/40 flex items-center justify-end gap-1">
          BANDWIDTH: <span className="text-[#00cccc]">████</span><span className="text-white/20">░</span>
        </div>
        <div className="text-white/20 mt-1">─────────────┐</div>
      </div>

      {/* Scattered Hermetic Symbols */}
      <div className="absolute top-1/4 left-4 text-[#d4af37]/[0.03] text-2xl font-occult">☿</div>
      <div className="absolute top-1/3 right-6 text-[#d4af37]/[0.03] text-xl font-occult">♄</div>
      <div className="absolute bottom-1/3 left-8 text-[#d4af37]/[0.03] text-lg font-occult">♃</div>
      <div className="absolute top-1/2 right-4 text-[#00cccc]/[0.03] text-xl font-occult">☉</div>
      <div className="absolute bottom-1/4 right-12 text-[#d4af37]/[0.03] text-lg font-occult">☽</div>
      
      {/* Corner Decorations */}
      <div className="absolute bottom-0 left-0 p-3 font-data text-[8px] text-white/20">
        <div>◈ PROTO v2.7.1</div>
        <div>REF: KETHER-0x01</div>
      </div>
      
      <div className="absolute bottom-0 right-0 p-3 font-data text-[8px] text-white/20 text-right">
        <div>MALKUTH ACTIVE</div>
        <div>SYNC: 98.7% ◈</div>
      </div>
    </>
  );
}