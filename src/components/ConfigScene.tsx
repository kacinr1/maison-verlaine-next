'use client';

import dynamic from 'next/dynamic';
import { type ConfigState } from '@/types/config';

const Costume3D = dynamic(() => import('./Costume3D'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        background: 'radial-gradient(120% 90% at 40% 35%, #1a2232 0%, #0e131d 55%, #0b0f17 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        color: '#8d93a0',
      }}
    >
      <p style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
        Chargement du mannequin 3D…
      </p>
    </div>
  ),
});

export default function ConfigScene({ state }: { state: ConfigState }) {
  return <Costume3D state={state} />;
}
