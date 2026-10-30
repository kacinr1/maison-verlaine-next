'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import FrameScrubber from './FrameScrubber';
import TextReveal from './TextReveal';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    id: 'hero',
    subtitle: 'MAISON VERLAINE · GENÈVE',
    title: 'Taillé pour un seul.',
    text: 'Chaque costume naît d\'un corps, pas d\'une taille.',
  },
  {
    id: 'k1',
    subtitle: 'I · LA MESURE',
    title: 'Tout commence par vous.',
    text: 'Vingt-deux mesures. Une posture. Une manière de se tenir.',
  },
  {
    id: 'k2',
    subtitle: 'II · LA FONDATION',
    title: 'Une chemise de coton pur.',
    text: 'Popeline blanche, double poignet, col qui tient sans forcer.',
  },
  {
    id: 'k3',
    subtitle: 'III · LE GILET',
    title: 'La structure, au plus près.',
    text: 'Cinq boutons, une ligne nette. La pièce qu\'on ne retire jamais.',
  },
  {
    id: 'k4',
    subtitle: 'IV · LA CONSTRUCTION',
    title: 'Montée sur toile entière.',
    text: 'Crin de cheval, piqué main. Une veste qui épouse avec le temps.',
  },
  {
    id: 'k5',
    subtitle: 'V · LA COUPE',
    title: 'La silhouette complète.',
    text: 'Trois pièces. Une seule intention.',
  },
  {
    id: 'k6',
    subtitle: 'VI · L\'HOMME',
    title: 'Fait pour être porté.',
    text: 'Pas pour être regardé sur un cintre.',
  },
  {
    id: 'k7',
    subtitle: 'VII · LA PALETTE',
    title: 'Un langage de couleurs.',
    text: 'Ivoire, granit, marine, anthracite, bordeaux. Le vôtre reste à écrire.',
  },
  {
    id: 'k8',
    subtitle: 'VIII · LE DÉTAIL',
    title: 'Le dernier quart de pouce.',
    text: 'Boutonnières fonctionnelles. La dernière, toujours ouverte.',
  },
  {
    id: 'final',
    subtitle: 'MAISON VERLAINE',
    title: 'Composez le vôtre.',
    text: 'Choisissez tissu, revers et doublure, puis voyez-le sur vous.',
  },
];

export default function ScrollFilmPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    // Create a real scrollable distance by using window as trigger
    const scrubber = gsap.to(
      {},
      {
        scrollTrigger: {
          trigger: scrollerRef.current, // Tall scroller element
          start: 'top top',
          end: 'bottom center',
          onUpdate: (self) => {
            const progress = Math.min(self.progress, 1);
            setScrollProgress(progress);
            // Map scroll progress to frame index (0-239)
            const newFrameIndex = Math.floor(progress * 239);
            setFrameIndex(newFrameIndex);
          },
        },
      }
    );

    return () => {
      scrubber.kill();
    };
  }, []);

  return (
    <>
      {/* Main viewport - sticky so it stays in place during scroll */}
      <div
        ref={containerRef}
        className="sticky top-0 w-full h-screen bg-[#070707] overflow-hidden"
      >
        {/* Canvas Scrubber */}
        <div className="absolute inset-0">
          <FrameScrubber frameIndex={frameIndex} />
        </div>

        {/* Progress Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-[#B8A27A]"
          style={{ width: `${scrollProgress * 100}%` }}
        />

        {/* Logo */}
        <div className="absolute top-8 left-8 pointer-events-none z-20">
          <h1 className="font-serif text-sm tracking-widest text-[#EDEAE4] font-light">
            MAISON VERLAINE
          </h1>
        </div>

        {/* CTA Button */}
        {frameIndex > 220 && (
          <div className="absolute bottom-16 left-8 z-20">
            <button className="px-6 py-3 border border-[#B8A27A] text-[#EDEAE4] text-sm tracking-widest hover:bg-[#B8A27A]/10 transition">
              Ouvrir le configurateur
            </button>
          </div>
        )}
      </div>

      {/* Scrollable spacer - creates scroll distance */}
      <div ref={scrollerRef} className="h-[500vh] bg-[#070707]" />
    </>
  );
}
