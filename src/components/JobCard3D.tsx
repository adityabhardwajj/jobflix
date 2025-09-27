'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Job } from '@/lib/schemas';
import { CompatibilityBadge } from './CompatibilityBadge';
import { VideoPreview } from './VideoPreview';

interface JobCard3DProps {
  job: Job;
  isActive: boolean;
  isAnimating: boolean;
  dragConstraints?: React.RefObject<HTMLDivElement>;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: (x: number, y: number) => void;
  style?: React.CSSProperties;
  className?: string;
}

function Card3D({ job, isActive }: { job: Job; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      // Subtle rotation based on mouse position
      const mouseX = state.mouse.x;
      const mouseY = state.mouse.y;
      
      meshRef.current.rotation.y = mouseX * 0.1;
      meshRef.current.rotation.x = mouseY * 0.1;
      
      // Hover effect
      if (hovered) {
        meshRef.current.scale.setScalar(1.05);
      } else {
        meshRef.current.scale.lerp({ x: 1, y: 1, z: 1 }, 0.1);
      }
    }
  });

  return (
    <group>
      {/* Main card */}
      <Box
        ref={meshRef}
        args={[4, 6, 0.1]}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#3b82f6' : '#1e293b'}
          metalness={0.1}
          roughness={0.2}
        />
      </Box>
      
      {/* Company logo placeholder */}
      <Sphere
        args={[0.3, 16, 16]}
        position={[-1.2, 2, 0.1]}
      >
        <meshStandardMaterial color="#64748b" />
      </Sphere>
      
      {/* Job title */}
      <Text
        position={[0, 1, 0.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
        textAlign="center"
      >
        {job.title}
      </Text>
      
      {/* Company name */}
      <Text
        position={[0, 0.5, 0.1]}
        fontSize={0.2}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
        textAlign="center"
      >
        {job.company}
      </Text>
      
      {/* Salary */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.25}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
        textAlign="center"
      >
        ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}
      </Text>
      
      {/* Location */}
      <Text
        position={[0, -0.5, 0.1]}
        fontSize={0.18}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
        textAlign="center"
      >
        📍 {job.location}
      </Text>
      
      {/* Tags */}
      <Text
        position={[0, -1.2, 0.1]}
        fontSize={0.15}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.5}
        textAlign="center"
      >
        {job.tags.slice(0, 3).join(' • ')}
      </Text>
    </group>
  );
}

export function JobCard3D({
  job,
  isActive,
  isAnimating,
  onDrag,
  onDragEnd,
  style,
  className
}: JobCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (onDrag && isActive) {
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        onDrag(x, y);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (onDragEnd && isActive) {
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        onDragEnd(x, y);
      }
    }
  };

  const handleLongPress = () => {
    setIsFlipped(true);
    if (job.videoUrl) {
      setShowVideo(true);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative w-80 h-96 cursor-grab active:cursor-grabbing ${className}`}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onLongPress={handleLongPress}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ 
        scale: isAnimating ? 0.96 : 1,
        opacity: isAnimating ? 0 : 1,
        rotateY: isFlipped ? 180 : 0
      }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Card3D job={job} isActive={isActive} />
        </Canvas>
      </div>

      {/* 2D Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Compatibility Badge */}
        <div className="absolute top-4 right-4">
          <CompatibilityBadge score={job.compatibility} />
        </div>

        {/* Video Preview */}
        {showVideo && job.videoUrl && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <VideoPreview videoUrl={job.videoUrl} />
          </div>
        )}

        {/* Swipe Indicators */}
        {isActive && (
          <>
            <motion.div
              className="absolute top-1/2 left-4 text-red-500 text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              SKIP
            </motion.div>
            <motion.div
              className="absolute top-1/2 right-4 text-green-500 text-2xl font-bold"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              APPLY
            </motion.div>
            <motion.div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 text-blue-500 text-lg font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              SAVE
            </motion.div>
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-purple-500 text-lg font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              DETAILS
            </motion.div>
          </>
        )}
      </div>

      {/* Back face content */}
      {isFlipped && (
        <motion.div
          className="absolute inset-0 bg-slate-800 rounded-xl p-6 flex flex-col justify-center items-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">{job.title}</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {job.description}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {job.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => setIsFlipped(false)}
            className="mt-4 px-4 py-2 bg-white text-slate-800 rounded-lg text-sm font-medium"
          >
            Flip Back
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
