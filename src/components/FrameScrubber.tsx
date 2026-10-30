'use client';

import { useEffect, useRef } from 'react';

interface FrameScrubberProps {
  frameIndex: number;
}

export default function FrameScrubber({ frameIndex }: FrameScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Draw current frame on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create and load image
    const padded = String(frameIndex).padStart(6, '0');
    const src = `/scroll-film/frames-desktop/frame-${padded}.webp`;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.onerror = () => {
      console.error(`Failed to load frame: ${src}`);
      ctx.fillStyle = '#070707';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    img.src = src;
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
