'use client';

import { useEffect, useRef, useState } from 'react';

interface FrameScrubberProps {
  frameIndex: number;
}

export default function FrameScrubber({ frameIndex }: FrameScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const [preloadedFrames, setPreloadedFrames] = useState<Set<number>>(new Set());

  // Preload frames (first 30, then rest in background)
  useEffect(() => {
    const preloadFrames = async () => {
      const frames = new Set<number>();
      const totalFrames = 240; // Optimized from 960

      // Preload first 30 frames immediately
      for (let i = 0; i < Math.min(30, totalFrames); i++) {
        const padded = String(i).padStart(6, '0');
        const img = new Image();
        img.src = `/scroll-film/frame-${padded}.webp`;
        imagesRef.current.set(i, img);
        frames.add(i);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      setPreloadedFrames(frames);

      // Preload rest in background
      for (let i = 30; i < totalFrames; i++) {
        const padded = String(i).padStart(6, '0');
        const img = new Image();
        img.src = `/scroll-film/frame-${padded}.webp`;
        imagesRef.current.set(i, img);
        frames.add(i);
        setPreloadedFrames(new Set(frames));
      }
    };

    preloadFrames();
  }, []);

  // Draw current frame on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current.get(frameIndex);
    if (!img || !img.complete) {
      // Frame not loaded yet, draw previous frame or placeholder
      ctx.fillStyle = '#070707';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Draw image to canvas (DPR-aware)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, [frameIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{
        width: '100vw',
        height: '100vh',
        display: 'block',
      }}
    />
  );
}
