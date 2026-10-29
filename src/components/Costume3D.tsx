'use client';

import dynamic from 'next/dynamic';
import { type ConfigState } from '@/types/config';

const Canvas3D = dynamic(() => import('./Costume3DCanvas'), {
  ssr: false,
});

export default function Costume3D({ state }: { state: ConfigState }) {
  return <Canvas3D state={state} />;
}
