'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CATALOG, type ConfigState, type PieceType } from '@/types/config';

interface CostumeGLTF {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
  scene: THREE.Group;
}

const pieces: PieceType[] = ['veste', 'gilet', 'pantalon', 'cravate', 'souliers'];
const pieceNamesGLB = ['veste', 'gilet', 'pantalon', 'chemise', 'cravate', 'souliers', 'mannequin'];

function lineColorFor(hex: string): THREE.Color {
  const c = new THREE.Color(hex);
  const l = c.r * 0.3 + c.g * 0.59 + c.b * 0.11;
  return l < 0.35
    ? c.clone().lerp(new THREE.Color('#f1ece2'), 0.42)
    : c.clone().multiplyScalar(0.55);
}

const CostumeModel = ({ state }: { state: ConfigState }) => {
  const gltf = useGLTF('/costume.glb') as unknown as CostumeGLTF;
  const meshRefs = useRef<Record<string, THREE.Mesh>>({});
  const materialRefs = useRef<Record<string, THREE.MeshPhysicalMaterial>>({});

  useEffect(() => {
    if (!gltf.scene) return;

    gltf.scene.traverse((obj: any) => {
      if (!obj.isMesh) return;

      const name = obj.name as string;
      if (!pieceNamesGLB.includes(name)) return;

      meshRefs.current[name] = obj as THREE.Mesh;

      let material: THREE.MeshPhysicalMaterial;

      if (name === 'souliers') {
        material = new THREE.MeshPhysicalMaterial({
          roughness: 0.38,
          clearcoat: 0.7,
          clearcoatRoughness: 0.22,
        });
      } else if (name === 'mannequin') {
        material = new THREE.MeshPhysicalMaterial({
          color: '#e4ddd0',
          roughness: 0.45,
          clearcoat: 0.3,
        });
      } else {
        material = new THREE.MeshPhysicalMaterial({
          roughness: name === 'veste' || name === 'pantalon' ? 0.86 : name === 'gilet' ? 0.82 : 0.72,
          sheen: name === 'cravate' ? 1.0 : 0.7,
          sheenRoughness: 0.7,
        });
      }

      obj.material = material;
      obj.castShadow = true;
      obj.receiveShadow = true;
      materialRefs.current[name] = material;
    });

    updateMaterials();
  }, [gltf.scene]);

  const updateMaterials = () => {
    pieces.forEach((piece) => {
      const material = materialRefs.current[piece];
      if (!material) return;

      const colorIdx = state[piece]?.couleur ?? 0;
      const colorHex = CATALOG.laines[colorIdx]?.hex ?? '#1a1a1a';

      material.color.copy(new THREE.Color(colorHex));

      if (material.sheenColor) {
        const sheenColor = new THREE.Color(colorHex).lerp(
          new THREE.Color('#ffffff'),
          piece === 'cravate' ? 0.55 : 0.25
        );
        material.sheenColor.copy(sheenColor);
      }
    });
  };

  useEffect(() => {
    updateMaterials();
  }, [state]);

  return <primitive object={gltf.scene} position={[0, -0.5, 0]} />;
};

export default function Costume3DCanvas({ state }: { state: ConfigState }) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 4.8], fov: 28 }}
      style={{
        background: 'radial-gradient(120% 90% at 40% 35%, #1a2232 0%, #0e131d 55%, #0b0f17 100%)',
      }}
    >
      <Suspense fallback={null}>
        <CostumeModel state={state} />
        <directionalLight position={[1.6, 3.2, 2.6]} intensity={2.2} castShadow />
        <directionalLight position={[-2.2, 1.8, -2.4]} intensity={1.1} />
        <directionalLight position={[-2, 0.5, 2]} intensity={0.35} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.951, 0]} receiveShadow>
          <planeGeometry args={[6, 6]} />
          <shadowMaterial opacity={0.42} />
        </mesh>
        <OrbitControls
          target={[0, -0.02, 0]}
          enableDamping
          enablePan={false}
          minDistance={0.9}
          maxDistance={6}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Suspense>
    </Canvas>
  );
}
