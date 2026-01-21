'use client';

import { useEffect, useRef } from 'react';

interface SoundWaveProps {
  isDarkMode: boolean;
  isPlaying: boolean;
}

interface WaveBar {
  height: number;
  targetHeight: number;
  speed: number;
  phase: number;
}

export default function SoundWave({ isDarkMode, isPlaying }: SoundWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barsRef = useRef<WaveBar[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize wave bars
    const initBars = () => {
      barsRef.current = [];
      const barCount = 80; // Number of bars in the wave
      const barSpacing = canvas.width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        barsRef.current.push({
          height: 20,
          targetHeight: 20,
          speed: 0.02 + Math.random() * 0.08, // Random animation speed
          phase: i * 0.5, // Phase offset for wave effect
        });
      }
    };

    initBars();

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isPlaying) {
        timeRef.current += 0.1;
        
        const barCount = barsRef.current.length;
        const barWidth = canvas.width / barCount;
        const centerY = canvas.height / 2;
        const maxBarHeight = 200;
        
        barsRef.current.forEach((bar, index) => {
          const x = index * barWidth + barWidth / 2;
          
          // Create wave motion with multiple sine waves for complexity
          const wave1 = Math.sin(timeRef.current + bar.phase) * 0.7;
          const wave2 = Math.sin(timeRef.current * 1.5 + bar.phase * 0.8) * 0.3;
          const wave3 = Math.sin(timeRef.current * 0.7 + bar.phase * 1.2) * 0.4;
          const combinedWave = wave1 + wave2 + wave3;
          
          // Calculate target height based on wave
          bar.targetHeight = Math.abs(combinedWave) * maxBarHeight + 20;
          
          // Animate height towards target
          const diff = bar.targetHeight - bar.height;
          bar.height += diff * bar.speed;
          
          // Draw the bar
          const gradient = ctx.createLinearGradient(0, centerY - bar.height/2, 0, centerY + bar.height/2);
          
          if (isDarkMode) {
            gradient.addColorStop(0, `rgba(34, 197, 94, ${0.8 + Math.abs(combinedWave) * 0.2})`); // Bright green
            gradient.addColorStop(0.5, `rgba(16, 185, 129, ${0.6 + Math.abs(combinedWave) * 0.3})`); // Teal
            gradient.addColorStop(1, `rgba(6, 182, 212, ${0.4 + Math.abs(combinedWave) * 0.2})`); // Cyan
          } else {
            gradient.addColorStop(0, `rgba(34, 197, 94, ${0.6 + Math.abs(combinedWave) * 0.2})`); // Darker green for light mode
            gradient.addColorStop(0.5, `rgba(16, 185, 129, ${0.4 + Math.abs(combinedWave) * 0.3})`); // Darker teal
            gradient.addColorStop(1, `rgba(6, 182, 212, ${0.3 + Math.abs(combinedWave) * 0.2})`); // Darker cyan
          }
          
          ctx.fillStyle = gradient;
          ctx.fillRect(
            x - barWidth * 0.15,
            centerY - bar.height / 2,
            barWidth * 0.3,
            bar.height
          );
          
          // Add glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = isDarkMode ? 'rgba(34, 197, 94, 0.5)' : 'rgba(34, 197, 94, 0.3)';
          ctx.fillRect(
            x - barWidth * 0.15,
            centerY - bar.height / 2,
            barWidth * 0.3,
            bar.height
          );
          ctx.shadowBlur = 0;
        });
      } else {
        // When not playing, animate bars to minimum height
        const barCount = barsRef.current.length;
        const barWidth = canvas.width / barCount;
        const centerY = canvas.height / 2;
        
        barsRef.current.forEach((bar, index) => {
          const x = index * barWidth + barWidth / 2;
          
          // Animate to minimum height
          bar.targetHeight = 20;
          const diff = bar.targetHeight - bar.height;
          bar.height += diff * 0.05;
          
          // Draw static bar
          ctx.fillStyle = isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)';
          ctx.fillRect(
            x - barWidth * 0.15,
            centerY - bar.height / 2,
            barWidth * 0.3,
            bar.height
          );
        });
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDarkMode, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -1, // Behind everything
        opacity: isPlaying ? 0.8 : 0,
        transition: 'opacity 0.5s ease-in-out',
        display: isPlaying ? 'block' : 'none',
      }}
    />
  );
}