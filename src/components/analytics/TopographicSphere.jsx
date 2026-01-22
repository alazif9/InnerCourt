import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const dimensions = [
  { key: 'career', label: 'Career', phi: 0.3, theta: 0 },           // North
  { key: 'finance', label: 'Finance', phi: 0.6, theta: Math.PI/4 }, // NE
  { key: 'health', label: 'Health', phi: Math.PI/2, theta: Math.PI/2 }, // E
  { key: 'relationships', label: 'Relations', phi: 0.6, theta: 3*Math.PI/4 }, // SE
  { key: 'personal', label: 'Personal', phi: 0.3, theta: Math.PI }, // S
  { key: 'spiritual', label: 'Spiritual', phi: 0.6, theta: 5*Math.PI/4 }, // SW
  { key: 'recreation', label: 'Recreation', phi: Math.PI/2, theta: 3*Math.PI/2 }, // W
  { key: 'environment', label: 'Environ', phi: 0.6, theta: 7*Math.PI/4 }, // NW
];

export default function TopographicSphere({ data = {}, overallScore = 63 }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const sphereRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.4, y: 0 });
  const autoRotateRef = useRef(true);

  const scores = useMemo(() => dimensions.map(d => ({
    ...d,
    value: data[d.key] || Math.floor(Math.random() * 40 + 40)
  })), [data]);

  const avgScore = Math.round(scores.reduce((a, b) => a + b.value, 0) / scores.length);
  const variance = Math.round(Math.sqrt(scores.reduce((a, b) => a + Math.pow(b.value - avgScore, 2), 0) / scores.length));

  useEffect(() => {
    if (!containerRef.current) return;

    const width = 320;
    const height = 320;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4;
    cameraRef.current = camera;

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
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    sphereRef.current = globeGroup;

    // Gold color
    const goldColor = new THREE.Color(0xd4af37);
    const brightGold = new THREE.Color(0xffd700);

    // Create wireframe sphere (latitude lines)
    const latitudeCount = 12;
    for (let i = 0; i <= latitudeCount; i++) {
      const phi = (i / latitudeCount) * Math.PI;
      const radius = 1;
      const y = Math.cos(phi) * radius;
      const ringRadius = Math.sin(phi) * radius;
      
      if (ringRadius > 0.01) {
        const curve = new THREE.EllipseCurve(0, 0, ringRadius, ringRadius, 0, 2 * Math.PI, false, 0);
        const points = curve.getPoints(64);
        const geometry = new THREE.BufferGeometry().setFromPoints(
          points.map(p => new THREE.Vector3(p.x, y, p.y))
        );
        const material = new THREE.LineBasicMaterial({ 
          color: goldColor, 
          transparent: true, 
          opacity: 0.2,
          linewidth: 1
        });
        const line = new THREE.Line(geometry, material);
        globeGroup.add(line);
      }
    }

    // Longitude lines (meridians)
    const longitudeCount = 24;
    for (let i = 0; i < longitudeCount; i++) {
      const theta = (i / longitudeCount) * Math.PI * 2;
      const points = [];
      for (let j = 0; j <= 64; j++) {
        const phi = (j / 64) * Math.PI;
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: goldColor, 
        transparent: true, 
        opacity: 0.15
      });
      const line = new THREE.Line(geometry, material);
      globeGroup.add(line);
    }

    // Grid intersection points (luminous dots)
    const dotGeometry = new THREE.BufferGeometry();
    const dotPositions = [];
    for (let lat = 1; lat < latitudeCount; lat++) {
      const phi = (lat / latitudeCount) * Math.PI;
      const y = Math.cos(phi);
      const ringRadius = Math.sin(phi);
      for (let lon = 0; lon < longitudeCount; lon++) {
        const theta = (lon / longitudeCount) * Math.PI * 2;
        const x = ringRadius * Math.cos(theta);
        const z = ringRadius * Math.sin(theta);
        dotPositions.push(x, y, z);
      }
    }
    dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
    const dotMaterial = new THREE.PointsMaterial({ 
      color: brightGold, 
      size: 0.02, 
      transparent: true, 
      opacity: 0.6,
      sizeAttenuation: true
    });
    const dots = new THREE.Points(dotGeometry, dotMaterial);
    globeGroup.add(dots);

    // Create data points (dimension markers) with elevation
    const dataPointsGroup = new THREE.Group();
    scores.forEach((dim, i) => {
      const elevation = dim.value > 80 ? 0.25 : dim.value > 60 ? 0.15 : dim.value > 30 ? 0.05 : -0.05;
      const baseRadius = 1 + elevation;
      
      // Position on sphere
      const phi = Math.PI / 2 - (dim.phi - Math.PI/2) * 0.5;
      const theta = dim.theta;
      const x = baseRadius * Math.sin(phi) * Math.cos(theta);
      const y = baseRadius * Math.cos(phi);
      const z = baseRadius * Math.sin(phi) * Math.sin(theta);

      // Main orb
      const orbSize = 0.04 + (dim.value / 100) * 0.04;
      const orbGeometry = new THREE.SphereGeometry(orbSize, 16, 16);
      const orbColor = dim.value > 70 ? 0xfffde7 : dim.value > 50 ? 0xffd700 : 0x8a7f3b;
      const orbMaterial = new THREE.MeshBasicMaterial({ 
        color: orbColor,
        transparent: true,
        opacity: 0.9
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(x, y, z);
      dataPointsGroup.add(orb);

      // Glow effect
      const glowGeometry = new THREE.SphereGeometry(orbSize * 2.5, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xd4af37,
        transparent: true,
        opacity: 0.15
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(x, y, z);
      dataPointsGroup.add(glow);

      // Connecting line to sphere surface
      const surfaceX = Math.sin(phi) * Math.cos(theta);
      const surfaceY = Math.cos(phi);
      const surfaceZ = Math.sin(phi) * Math.sin(theta);
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(surfaceX, surfaceY, surfaceZ),
        new THREE.Vector3(x, y, z)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: goldColor, 
        transparent: true, 
        opacity: 0.4 
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      dataPointsGroup.add(line);
    });
    globeGroup.add(dataPointsGroup);

    // Data polygon connecting all dimension points
    const polygonPoints = [];
    scores.forEach((dim) => {
      const elevation = dim.value > 80 ? 0.25 : dim.value > 60 ? 0.15 : dim.value > 30 ? 0.05 : -0.05;
      const baseRadius = 1 + elevation;
      const phi = Math.PI / 2 - (dim.phi - Math.PI/2) * 0.5;
      const theta = dim.theta;
      const x = baseRadius * Math.sin(phi) * Math.cos(theta);
      const y = baseRadius * Math.cos(phi);
      const z = baseRadius * Math.sin(phi) * Math.sin(theta);
      polygonPoints.push(new THREE.Vector3(x, y, z));
    });
    polygonPoints.push(polygonPoints[0].clone()); // Close the loop
    
    const polygonGeometry = new THREE.BufferGeometry().setFromPoints(polygonPoints);
    const polygonMaterial = new THREE.LineBasicMaterial({ 
      color: brightGold, 
      transparent: true, 
      opacity: 0.6,
      linewidth: 2
    });
    const polygon = new THREE.Line(polygonGeometry, polygonMaterial);
    globeGroup.add(polygon);

    // Rim glow (fresnel-like effect using a slightly larger sphere)
    const rimGeometry = new THREE.SphereGeometry(1.02, 64, 64);
    const rimMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        glowColor: { value: new THREE.Color(0xd4af37) },
        viewVector: { value: camera.position }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(1.0 - abs(dot(vNormal, vNormel)), 2.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          gl_FragColor = vec4(glowColor, intensity * 0.4);
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending
    });
    const rimMesh = new THREE.Mesh(rimGeometry, rimMaterial);
    globeGroup.add(rimMesh);

    // Inner glow
    const innerGeometry = new THREE.SphereGeometry(0.95, 32, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    globeGroup.add(innerMesh);

    // Initial tilt
    globeGroup.rotation.x = 0.4;

    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (autoRotateRef.current && !isDragging) {
        globeGroup.rotation.y += 0.002; // ~40s per rotation
      }

      // Pulse dots
      const time = Date.now() * 0.001;
      dotMaterial.opacity = 0.4 + Math.sin(time * 0.5) * 0.2;

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
  }, [scores]);

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
    
    sphereRef.current.rotation.y += dx * 0.01;
    sphereRef.current.rotation.x = Math.max(-1, Math.min(1, sphereRef.current.rotation.x + dy * 0.005));
    
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setTimeout(() => { autoRotateRef.current = true; }, 2000);
  };

  return (
    <div className="relative">
      {/* HUD - Left Corner */}
      <div className="absolute top-2 left-2 font-data text-[8px] leading-tight z-10">
        <div className="text-white/30">┌─ BALANCE SCAN ────┐</div>
        <div className="text-[#00cccc]/70">│ SYNC: <span className="text-[#d4af37]">{avgScore}/100</span></div>
        <div className="text-[#00cccc]/70">│ VARIANCE: <span className="text-white/50">±{variance}</span></div>
        <div className="text-[#00cccc]/70">│ HARMONICS: <span className="text-[#00ff41]">████</span><span className="text-white/20">░</span></div>
        <div className="text-[#00cccc]/70">│ REFRESH: <span className="text-white/40">2m ago</span></div>
        <div className="text-white/30">└───────────────────┘</div>
      </div>

      {/* Score Display - Right Corner */}
      <div className="absolute top-2 right-2 flex items-center gap-2 px-2 py-1 rounded border border-[#d4af37]/40 bg-black/60 z-10">
        <span className="font-data text-[8px] text-white/40">BALANCE</span>
        <span className="font-occult text-xl text-[#d4af37]">{avgScore}</span>
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

      {/* Dimension Labels Grid */}
      <div className="grid grid-cols-4 gap-2 mt-4 px-2">
        {scores.map((dim) => (
          <motion.div
            key={dim.key}
            className="text-center p-1.5 rounded bg-black/40 border border-[#d4af37]/20"
            whileHover={{ borderColor: 'rgba(212,175,55,0.5)', scale: 1.02 }}
          >
            <div className="font-data text-[7px] text-white/40 uppercase tracking-wider">
              {dim.label}
            </div>
            <div 
              className="font-data text-xs font-medium"
              style={{ color: dim.value > 70 ? '#00ff41' : dim.value > 50 ? '#d4af37' : '#cc4444' }}
            >
              {dim.value}%
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-3 flex items-center justify-center gap-4 font-data text-[8px] text-white/30">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
          TOPOLOGY REFRESH: LIVE
        </span>
        <span>•</span>
        <span>DIMENSIONAL HARMONICS: BALANCED</span>
      </div>
    </div>
  );
}