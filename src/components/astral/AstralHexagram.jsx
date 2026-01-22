import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 320;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create hexagram geometry
    const hexagramGroup = new THREE.Group();

    // Outer hexagram (two triangles)
    const createTriangle = (radius, rotationZ) => {
      const shape = new THREE.Shape();
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3 + rotationZ;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      shape.closePath();
      return shape;
    };

    // Triangle 1 (pointing up)
    const triangle1Points = [];
    for (let i = 0; i <= 3; i++) {
      const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
      triangle1Points.push(new THREE.Vector3(Math.cos(angle) * 2, Math.sin(angle) * 2, 0));
    }
    const triangle1Geo = new THREE.BufferGeometry().setFromPoints(triangle1Points);
    const triangle1 = new THREE.Line(triangle1Geo, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true }));
    hexagramGroup.add(triangle1);

    // Triangle 2 (pointing down)
    const triangle2Points = [];
    for (let i = 0; i <= 3; i++) {
      const angle = (i * Math.PI * 2) / 3 + Math.PI / 2;
      triangle2Points.push(new THREE.Vector3(Math.cos(angle) * 2, Math.sin(angle) * 2, 0));
    }
    const triangle2Geo = new THREE.BufferGeometry().setFromPoints(triangle2Points);
    const triangle2 = new THREE.Line(triangle2Geo, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true }));
    hexagramGroup.add(triangle2);

    // Inner circle
    const circleGeo = new THREE.BufferGeometry();
    const circlePoints = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      circlePoints.push(new THREE.Vector3(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 0));
    }
    circleGeo.setFromPoints(circlePoints);
    const innerCircle = new THREE.Line(circleGeo, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent: true }));
    hexagramGroup.add(innerCircle);

    // Outer circle (zodiac wheel)
    const outerCirclePoints = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      outerCirclePoints.push(new THREE.Vector3(Math.cos(angle) * 2.3, Math.sin(angle) * 2.3, 0));
    }
    const outerCircleGeo = new THREE.BufferGeometry().setFromPoints(outerCirclePoints);
    const outerCircle = new THREE.Line(outerCircleGeo, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.15, transparent: true }));
    hexagramGroup.add(outerCircle);

    // Zodiac dividers (12 sections)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const innerR = 1.2;
      const outerR = 2.3;
      const points = [
        new THREE.Vector3(Math.cos(angle) * innerR, Math.sin(angle) * innerR, 0),
        new THREE.Vector3(Math.cos(angle) * outerR, Math.sin(angle) * outerR, 0)
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.1, transparent: true }));
      hexagramGroup.add(line);
    }

    // Planet nodes
    const planetKeys = Object.keys(chartData);
    const planetMeshes = [];
    
    planetKeys.forEach((planetKey, idx) => {
      const planetData = chartData[planetKey];
      if (!planetData) return;
      
      const signKey = planetData.sign?.toLowerCase();
      const zodiac = zodiacSigns[signKey] || { color: '#ffffff' };
      
      // Position based on house (1-12) converted to angle
      const house = planetData.house || (idx + 1);
      const angle = ((house - 1) / 12) * Math.PI * 2 - Math.PI / 2;
      const radius = 1.6 + (idx % 3) * 0.2;
      
      // Planet sphere
      const sphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(zodiac.color),
        transparent: true,
        opacity: 0.9
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0.1
      );
      hexagramGroup.add(sphere);
      planetMeshes.push({ mesh: sphere, baseAngle: angle, radius, idx });

      // Connection line to center
      const linePoints = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.1)
      ];
      const connGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const connLine = new THREE.Line(connGeo, new THREE.LineBasicMaterial({ 
        color: new THREE.Color(zodiac.color), 
        opacity: 0.3, 
        transparent: true 
      }));
      hexagramGroup.add(connLine);
    });

    // Center glow
    const centerGeo = new THREE.SphereGeometry(0.15, 32, 32);
    const centerMat = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.6 
    });
    const centerSphere = new THREE.Mesh(centerGeo, centerMat);
    hexagramGroup.add(centerSphere);

    scene.add(hexagramGroup);

    // Mouse interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      rotationVelocityY = deltaX * 0.005;
      rotationVelocityX = deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mouseleave', handleMouseUp);

    // Touch events
    renderer.domElement.addEventListener('touchstart', (e) => {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    });
    renderer.domElement.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      rotationVelocityY = deltaX * 0.005;
      rotationVelocityX = deltaY * 0.005;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    });
    renderer.domElement.addEventListener('touchend', handleMouseUp);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Auto rotation when not dragging
      if (!isDragging) {
        rotationVelocityY += (0.003 - rotationVelocityY) * 0.02;
        rotationVelocityX *= 0.95;
      }

      hexagramGroup.rotation.y += rotationVelocityY;
      hexagramGroup.rotation.x += rotationVelocityX;

      // Damping
      rotationVelocityY *= 0.98;
      rotationVelocityX *= 0.98;

      // Pulse center
      const time = Date.now() * 0.001;
      centerSphere.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('mouseleave', handleMouseUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [chartData]);

  // Planet labels overlay
  const planets = Object.entries(chartData);

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-80 cursor-grab active:cursor-grabbing" />
      
      {/* HUD overlay */}
      <div className="absolute top-2 left-2 font-data text-[8px] text-white/30">
        ┌─ ASTRAL_HEXAGRAM ─┐
      </div>
      <div className="absolute top-2 right-2 font-data text-[8px] text-white/30">
        DRAG TO ROTATE
      </div>
      <div className="absolute bottom-2 left-2 font-data text-[8px] text-white/40">
        PLANETS: {planets.length}
      </div>
      <div className="absolute bottom-2 right-2 font-data text-[8px] text-white/40">
        3D_VIEW
      </div>
    </div>
  );
}