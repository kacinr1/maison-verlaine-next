'use client';

import { useState, useRef, useEffect } from 'react';
import { type ConfigState, CATALOG } from '@/types/config';

interface FaceData {
  imageBase64: string;
  croppedImage: string;
  scale: number;
  offsetX: number;
  offsetY: number;
}

interface AdviceData {
  teint: string;
  sous_ton: string;
  cheveux: string;
  tenue: {
    veste: string;
    gilet: string;
    pantalon: string;
    motif: string;
    cravate: string;
    souliers: string;
  };
  conseil: string;
}

interface VirtualFitProps {
  state: ConfigState;
  onApplyAdvice: (advice: Partial<ConfigState>) => void;
}

export default function VirtualFit({ state, onApplyAdvice }: VirtualFitProps) {
  const [step, setStep] = useState<'idle' | 'upload' | 'crop' | 'advice'>('idle');
  const [faceData, setFaceData] = useState<FaceData | null>(null);
  const [advice, setAdvice] = useState<AdviceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFaceData({
        imageBase64: base64,
        croppedImage: base64,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
      });
      setStep('crop');
    };
    reader.readAsDataURL(file);
  };

  // Draw the crop preview
  useEffect(() => {
    if (step !== 'crop' || !faceData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = 480;
      canvas.height = 600;

      // Draw image
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2 + offsetX;
      const y = (canvas.height - scaledHeight) / 2 + offsetY;

      ctx.fillStyle = '#06080d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      // Draw oval mask
      ctx.fillStyle = 'rgba(6,8,13,.62)';
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, 280, 150, 200, 0, 0, Math.PI * 2);
      ctx.fill();
    };
    img.src = faceData.imageBase64;
  }, [faceData, scale, offsetX, offsetY, step]);

  const validateAndGetAdvice = async () => {
    if (!faceData || !canvasRef.current) return;

    setLoading(true);
    try {
      // Extract the cropped face from canvas
      const canvas = canvasRef.current;
      const croppedBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

      const response = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: croppedBase64,
          faceData: { scale, offsetX, offsetY },
        }),
      });

      if (!response.ok) throw new Error('Advice generation failed');
      const data = await response.json();
      setAdvice(data);
      setStep('advice');
    } catch (error) {
      console.error('Error getting advice:', error);
      alert('Erreur: impossible de générer les conseils');
    } finally {
      setLoading(false);
    }
  };

  const applyAdvice = () => {
    if (!advice) return;

    const colorIndices = {
      veste: CATALOG.laines.findIndex((l) => l.nom === advice.tenue.veste),
      gilet: CATALOG.laines.findIndex((l) => l.nom === advice.tenue.gilet),
      pantalon: CATALOG.laines.findIndex((l) => l.nom === advice.tenue.pantalon),
      cravate: CATALOG.cravates.findIndex((c) => c.nom === advice.tenue.cravate),
      souliers: CATALOG.souliers.findIndex((s) => s.nom === advice.tenue.souliers),
      motif: CATALOG.motifs.indexOf(advice.tenue.motif as any),
    };

    const newState: Partial<ConfigState> = {
      veste: {
        couleur: colorIndices.veste >= 0 ? colorIndices.veste : state.veste.couleur,
        motif: colorIndices.motif >= 0 ? colorIndices.motif : state.veste.motif,
      },
      gilet: {
        couleur: colorIndices.gilet >= 0 ? colorIndices.gilet : state.gilet.couleur,
        motif: state.gilet.motif,
      },
      pantalon: {
        couleur: colorIndices.pantalon >= 0 ? colorIndices.pantalon : state.pantalon.couleur,
        motif: state.pantalon.motif,
      },
      cravate: {
        couleur: colorIndices.cravate >= 0 ? colorIndices.cravate : state.cravate.couleur,
        motif: state.cravate.motif,
      },
      souliers: {
        couleur: colorIndices.souliers >= 0 ? colorIndices.souliers : state.souliers.couleur,
        motif: state.souliers.motif,
      },
    };

    onApplyAdvice(newState);
    setStep('idle');
  };

  const reset = () => {
    setStep('idle');
    setFaceData(null);
    setAdvice(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mt-6 pt-4 border-t border-[var(--line)]">
      <h2 className="font-serif font-500 text-lg mb-3">Essayage virtuel</h2>

      {step === 'idle' && (
        <>
          <p className="text-xs text-[var(--mute)] mb-3">
            Importez une photo de face bien éclairée. Votre visage s'affichera sur le mannequin et le styliste IA vous proposera les teintes qui vous flattent.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-3 rounded text-xs font-500 tracking-wider uppercase bg-[var(--brass)] text-[var(--ink)] hover:opacity-90 transition"
          >
            Importer ma photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            hidden
          />
        </>
      )}

      {step === 'crop' && faceData && (
        <>
          <div className="mb-4">
            <canvas
              ref={canvasRef}
              className="w-full rounded border border-[var(--line)]"
            />
            <svg
              viewBox="0 0 480 600"
              className="absolute inset-0 pointer-events-none w-full"
              style={{ position: 'absolute', top: '0', left: '0' }}
            >
              <defs>
                <mask id="m">
                  <rect width="480" height="600" fill="#fff" />
                  <ellipse cx="240" cy="280" rx="150" ry="200" fill="#000" />
                </mask>
              </defs>
              <ellipse
                cx="240"
                cy="280"
                rx="150"
                ry="200"
                fill="none"
                stroke="var(--brass)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
          </div>

          <div className="mb-3">
            <label className="text-xs text-[var(--mute)] block mb-2">
              Zoom
            </label>
            <input
              type="range"
              min="0.2"
              max="4"
              step="0.01"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <p className="text-xs text-[var(--mute)] mb-3">
            Placez le visage dans l'ovale, du haut des cheveux au menton.
          </p>

          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex-1 py-2 px-2 rounded text-xs border border-[var(--line)] text-[var(--chalk)] hover:border-[var(--brass)] transition"
            >
              Annuler
            </button>
            <button
              onClick={validateAndGetAdvice}
              disabled={loading}
              className="flex-1 py-2 px-2 rounded text-xs font-500 uppercase bg-[var(--brass)] text-[var(--ink)] hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? 'Analyse...' : 'Valider'}
            </button>
          </div>
        </>
      )}

      {step === 'advice' && advice && (
        <>
          <div className="space-y-3 text-xs">
            <div>
              <h3 className="text-[var(--mute)] tracking-widest uppercase mb-1">
                Analyse du styliste
              </h3>
              <p className="text-[var(--chalk)] italic">{advice.conseil}</p>
            </div>

            <div>
              <h3 className="text-[var(--mute)] tracking-widest uppercase mb-1">
                Teint & cheveux
              </h3>
              <dl className="space-y-0.5 text-[var(--chalk)]">
                <div className="flex justify-between">
                  <dt className="text-[var(--mute)]">Teint:</dt>
                  <dd>{advice.teint}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--mute)]">Sous-ton:</dt>
                  <dd>{advice.sous_ton}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--mute)]">Cheveux:</dt>
                  <dd>{advice.cheveux}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-[var(--mute)] tracking-widest uppercase mb-1">
                Tenue proposée
              </h3>
              <dl className="space-y-0.5 text-[var(--chalk)]">
                <div className="flex justify-between">
                  <dt className="text-[var(--mute)]">Veste:</dt>
                  <dd>{advice.tenue.veste}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--mute)]">Gilet:</dt>
                  <dd>{advice.tenue.gilet}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--mute)]">Pantalon:</dt>
                  <dd>{advice.tenue.pantalon}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--mute)]">Motif:</dt>
                  <dd>{advice.tenue.motif}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--mute)]">Cravate:</dt>
                  <dd>{advice.tenue.cravate}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--mute)]">Souliers:</dt>
                  <dd>{advice.tenue.souliers}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={reset}
              className="flex-1 py-2 px-2 rounded text-xs border border-[var(--line)] text-[var(--chalk)] hover:border-[var(--brass)] transition"
            >
              Autre photo
            </button>
            <button
              onClick={applyAdvice}
              className="flex-1 py-2 px-2 rounded text-xs font-500 uppercase bg-[var(--brass)] text-[var(--ink)] hover:opacity-90 transition"
            >
              Appliquer
            </button>
          </div>
        </>
      )}
    </div>
  );
}
