'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TextRevealProps {
  subtitle: string;
  title: string;
  text: string;
  isVisible: boolean;
  position: 'left' | 'right';
}

export default function TextReveal({
  subtitle,
  title,
  text,
  isVisible,
  position,
}: TextRevealProps) {
  const subtitleRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    // Stagger word reveal animation
    const tl = gsap.timeline();

    if (subtitleRef.current) {
      tl.to(subtitleRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    if (titleRef.current) {
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.3'
      );
    }

    if (textRef.current) {
      tl.to(
        textRef.current,
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.4'
      );
    }
  }, [isVisible]);

  const positionClass =
    position === 'left'
      ? 'left-8 sm:left-16 text-left'
      : 'right-8 sm:right-16 text-right';

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 ${positionClass} max-w-sm`}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <small
        ref={subtitleRef}
        className="block text-xs tracking-widest uppercase text-[#B8A27A] opacity-0"
      >
        {subtitle}
      </small>

      <h2
        ref={titleRef}
        className="font-serif text-4xl sm:text-5xl text-[#EDEAE4] mt-4 opacity-0 leading-tight"
      >
        {title}
      </h2>

      <p
        ref={textRef}
        className="text-sm sm:text-base text-[#EDEAE4] mt-6 opacity-0 leading-relaxed"
      >
        {text}
      </p>
    </div>
  );
}
