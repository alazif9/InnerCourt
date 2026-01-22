import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const zodiacSigns = {
  aries: { symbol: '♈', color: '#FF5733' },
  taurus: { symbol: '♉', color: '#7CB342' },
  gemini: { symbol: '♊', color: '#FFD700' },
  cancer: { symbol: '♋', color: '#4FC3F7' },
  leo: { symbol: '♌', color: '#FF9800' },
  virgo: { symbol: '♍', color: '#8D6E63' },
  libra: { symbol: '♎', color: '#EC407A' },
  scorpio: { symbol: '♏', color: '#9C27B0' },
  sagittarius: { symbol: '♐', color: '#7C4DFF' },
  capricorn: { symbol: '♑', color: '#455A64' },
  aquarius: { symbol: '♒', color: '#00BCD4' },
  pisces: { symbol: '♓', color: '#3F51B5' },
};

const planetSymbols = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
};

export default function AstralHexagram({ chartData = {} }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = 320;
    const height = 320;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create main group for rotation
    const hexagramGroup = new THREE.Group();
    scene.add(hexagramGroup);
    sphereRef.current = hexagramGroup;

    const whiteColor = new THREE.Color(0xffffff);

    // Create outer zodiac ring
    const ringRadius = 1.4;
    const ringGeometry = new THREE.RingGeometry(ringRadius - 0.02, ringRadius + 0.02, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: whiteColor, 
      transparent: true, 
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    hexagramGroup.add(ring);

    // Create 12 zodiac divisions
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const nextAngle = ((i + 1) / 12) * Math.PI * 2;
      
      // Division lines
      const linePoints = [
        new THREE.Vector3(Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0),
        new THREE.Vector3(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0)
      ];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: whiteColor, 
        transparent: true, 
        opacity: 0.2 
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      hexagramGroup.add(line);
    }

    // Create inner circle (houses)
    const innerRingGeometry = new THREE.RingGeometry(0.78, 0.82, 64);
    const innerRingMaterial = new THREE.MeshBasicMaterial({ 
      color: whiteColor, 
      transparent: true, 
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
    hexagramGroup.add(innerRing);

    // Create house divisions (12 houses)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const linePoints = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 0.8, Math.sin(angle) * 0.8, 0)
      ];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: whiteColor, 
        transparent: true, 
        opacity: 0.1 
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      hexagramGroup.add(line);
    }

    // Create hexagram (Star of David / Solomon's Seal)
    const createTriangle = (rotation, scale = 0.5) => {
      const points = [];
      for (let i = 0; i < 4; i++) {
        const angle = (i / 3) * Math.PI * 2 + rotation;
        points.push(new THREE.Vector3(
          Math.cos(angle) * scale,
          Math.sin(angle) * scale,
          0
        ));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: whiteColor, 
        transparent: true, 
        opacity: 0.6 
      });
      return new THREE.Line(geometry, material);
    };

    // Upward triangle
    const triangle1 = createTriangle(-Math.PI / 2, 0.55);
    hexagramGroup.add(triangle1);

    // Downward triangle
    const triangle2 = createTriangle(Math.PI / 2, 0.55);
    hexagramGroup.add(triangle2);

    // Central circle
    const centerGeometry = new THREE.RingGeometry(0.08, 0.12, 32);
    const centerMaterial = new THREE.MeshBasicMaterial({ 
      color: whiteColor, 
      transparent: true, 
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const centerRing = new THREE.Mesh(centerGeometry, centerMaterial);
    hexagramGroup.add(centerRing);

    // Planet position markers
    const planetKeys = Object.keys(chartData);
    planetKeys.forEach((planet, idx) => {
      const data = chartData[planet];
      if (!data) return;
      
      // Calculate position based on house (1-12 corresponds to 30 degree segments)
      const houseAngle = ((data.house - 1) / 12) * Math.PI * 2 - Math.PI / 2;
      // Add some offset within the house based on degree
      const degreeOffset = (parseInt(data.degree) || 0) / 30 * (Math.PI * 2 / 12);
      const angle = houseAngle + degreeOffset;
      
      // Position in inner area
      const radius = 0.5 + (idx % 3) * 0.12;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      // Create planet orb
      const orbGeometry = new THREE.SphereGeometry(0.04, 16, 16);
      const signColor = zodiacSigns[data.sign?.toLowerCase()]?.color || '#ffffff';
      const orbMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(signColor),
        transparent: true,
        opacity: 0.9
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(x, y, 0.05);
      hexagramGroup.add(orb);
      
      // Glow
      const glowGeometry = new THREE.SphereGeometry(0.07, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(signColor),
        transparent: true,
        opacity: 0.2
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(x, y, 0.05);
      hexagramGroup.add(glow);
    });

    // Create aspect lines between planets
    const aspectColors = {
      conjunction: 0xffffff,
      trine: 0x4FC3F7,
      square: 0xFF5733,
      opposition: 0xFF9800
    };
    
    // Add some aspect lines for visual effect
    if (planetKeys.length >= 2) {
      for (let i = 0; i < Math.min(5, planetKeys.length - 1); i++) {
        const p1 = chartData[planetKeys[i]];
        const p2 = chartData[planetKeys[i + 1]];
        if (!p1 || !p2) continue;
        
        const angle1 = ((p1.house - 1) / 12) * Math.PI * 2 - Math.PI / 2;
        const angle2 = ((p2.house - 1) / 12) * Math.PI * 2 - Math.PI / 2;
        const r1 = 0.5 + (i % 3) * 0.12;
        const r2 = 0.5 + ((i + 1) % 3) * 0.12;
        
        const aspectPoints = [
          new THREE.Vector3(Math.cos(angle1) * r1, Math.sin(angle1) * r1, 0.02),
          new THREE.Vector3(Math.cos(angle2) * r2, Math.sin(angle2) * r2, 0.02)
        ];
        const aspectGeometry = new THREE.BufferGeometry().setFromPoints(aspectPoints);
        const aspectMaterial = new THREE.LineBasicMaterial({ 
          color: Object.values(aspectColors)[i % 4], 
          transparent: true, 
          opacity: 0.3 
        });
        const aspectLine = new THREE.Line(aspectGeometry, aspectMaterial);
        hexagramGroup.add(aspectLine);
      }
    }

    // Rim glow effect
    const rimGeometry = new THREE.RingGeometry(ringRadius, ringRadius + 0.08, 64);
    const rimMaterial = new THREE.MeshBasicMaterial({
      color: whiteColor,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    hexagramGroup.add(rim);

    // Initial tilt for 3D effect
    hexagramGroup.rotation.x = 0.5;

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (autoRotateRef.current && !isDragging) {
        hexagramGroup.rotation.z += 0.001;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [chartData]);

  // Drag handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    autoRotateRef.current = false;
    dragStartRef.current = { x: e.clientX || e.touches?.[0]?.clientX, y: e.clientY || e.touches?.[0]?.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !sphereRef.current) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    
    sphereRef.current.rotation.z += dx * 0.01;
    sphereRef.current.rotation.x = Math.max(0.2, Math.min(1.2, sphereRef.current.rotation.x + dy * 0.005));
    
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setTimeout(() => { autoRotateRef.current = true; }, 2000);
  };

  const planetCount = Object.keys(chartData).length;

  return (
    <div className="relative">
      {/* HUD - Left Corner */}
      <div className="absolute top-2 left-2 font-data text-[8px] leading-tight z-10">
        <div className="text-white/30">┌─ ASTRAL SCAN ─────┐</div>
        <div className="text-white/70">│ PLANETS: <span className="text-white">{planetCount}</span></div>
        <div className="text-white/70">│ HOUSES: <span className="text-white/50">12</span></div>
        <div className="text-white/70">│ ASPECTS: <span className="text-white">████</span><span className="text-white/20">░</span></div>
        <div className="text-white/70">│ STATUS: <span className="text-white/40">MAPPED</span></div>
        <div className="text-white/30">└───────────────────┘</div>
      </div>

      {/* Type Display - Right Corner */}
      <div className="absolute top-2 right-2 flex items-center gap-2 px-2 py-1 rounded border border-white/40 bg-black/60 z-10">
        <span className="font-data text-[8px] text-white/40">NATAL</span>
        <span className="font-occult text-lg text-white">☿</span>
      </div>

      {/* Three.js Container */}
      <div 
        ref={containerRef}
        className="w-full max-w-[320px] h-[320px] mx-auto cursor-grab active:cursor-grabbing"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />

      {/* Zodiac Ring Labels */}
      <div className="flex justify-center gap-1 mt-2 flex-wrap px-4">
        {Object.entries(zodiacSigns).map(([key, val]) => (
          <span 
            key={key} 
            className="text-sm opacity-60"
            style={{ color: val.color }}
            title={key}
          >
            {val.symbol}
          </span>
        ))}
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-3 flex items-center justify-center gap-4 font-data text-[8px] text-white/30">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          CELESTIAL MATRIX: ACTIVE
        </span>
        <span>•</span>
        <span>CIPHER: HERMETIC</span>
      </div>
    </div>
  );
}