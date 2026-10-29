'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ConfigPanel from '@/components/ConfigPanel';
import { initialState, type ConfigState } from '@/types/config';

const ConfigScene = dynamic(() => import('@/components/ConfigScene'), {
  ssr: false,
  loading: () => <div className="bg-gradient-to-br from-[#1a2232] via-[#0e131d] to-[#0b0f17] flex items-center justify-center">
    <p className="text-[var(--mute)] font-serif italic">Préparation du mannequin…</p>
  </div>,
});

export default function Home() {
  const [state, setState] = useState<ConfigState>(initialState);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Scene 3D */}
      <div className="flex-1 relative">
        <ConfigScene state={state} />

        {/* Brand & Views */}
        <div className="absolute top-6 left-6 pointer-events-none">
          <small className="block text-xs tracking-widest uppercase text-[var(--brass)]">
            Grande mesure
          </small>
          <h1 className="font-serif font-500 text-3xl text-[var(--chalk)] mt-1">
            Trois-pièces
          </h1>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 p-1 border border-[var(--line)] rounded-full bg-black/40 backdrop-blur">
          {['Face', '¾', 'Dos', 'Buste'].map((label) => (
            <button
              key={label}
              className="text-xs tracking-widest uppercase px-3 py-2 rounded-full text-[var(--mute)] hover:text-[var(--chalk)] transition"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="absolute top-6 right-6 text-right text-xs text-[var(--mute)] leading-relaxed max-w-[200px]">
          <p>Glisser pour tourner</p>
          <p>Molette pour zoomer</p>
          <p>Cliquer une pièce pour la modifier</p>
        </div>
      </div>

      {/* Panel */}
      <ConfigPanel state={state} onChange={setState} />
    </div>
  );
}
