'use client';

import { useState } from 'react';
import { CATALOG, pieceLabels, type ConfigState, type PieceType } from '@/types/config';
import VirtualFit from './VirtualFit';

interface ConfigPanelProps {
  state: ConfigState;
  onChange: (state: ConfigState) => void;
}

export default function ConfigPanel({ state, onChange }: ConfigPanelProps) {
  const [match, setMatch] = useState(false);

  const updatePiece = (piece: PieceType, couleur?: number, motif?: number) => {
    const newState = { ...state };
    newState[piece] = {
      couleur: couleur ?? newState[piece]?.couleur ?? 0,
      motif: motif ?? newState[piece]?.motif ?? 0,
    };

    if (match && piece !== 'cravate' && piece !== 'souliers') {
      ['veste', 'gilet', 'pantalon'].forEach((p) => {
        newState[p as PieceType] = { ...newState[piece] };
      });
    }

    onChange(newState);
  };

  const pieces: PieceType[] = ['veste', 'gilet', 'pantalon', 'cravate', 'souliers'];

  return (
    <aside
      style={{
        background: 'var(--ink-2)',
        borderLeft: '1px solid var(--line)',
      }}
      className="h-full w-96 overflow-y-auto flex flex-col gap-2 px-6 py-6 text-sm"
    >
      <div className="flex justify-between items-baseline pb-3 border-b border-[var(--line)] mb-1">
        <span className="text-xs tracking-widest uppercase text-[var(--mute)]">
          Configuration
        </span>
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={match}
            onChange={(e) => setMatch(e.target.checked)}
            className="w-4 h-2 rounded-full cursor-pointer"
          />
          <span className="text-[var(--mute)]">Assortir les trois pièces</span>
        </label>
      </div>

      {pieces.map((piece) => (
        <section
          key={piece}
          className="py-4 border-b border-[var(--line)]"
        >
          <h2 className="font-serif font-500 text-lg mb-3 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[var(--brass)]" />
            {pieceLabels[piece]}
          </h2>

          {/* Couleurs */}
          <div className="flex flex-wrap gap-2 mb-3">
            {CATALOG.laines.map((laine, idx) => (
              <button
                key={laine.nom}
                onClick={() => updatePiece(piece, idx)}
                className="w-8 h-8 rounded-full border transition-transform hover:scale-110"
                style={{
                  backgroundColor: laine.hex,
                  borderColor:
                    state[piece]?.couleur === idx
                      ? 'var(--brass)'
                      : 'rgba(255,255,255,.14)',
                  borderWidth:
                    state[piece]?.couleur === idx ? '3px' : '1px',
                }}
                title={laine.nom}
              />
            ))}
          </div>

          {/* Motifs si applicable */}
          {(piece === 'veste' || piece === 'gilet' || piece === 'pantalon') && (
            <div className="flex gap-2">
              {CATALOG.motifs.map((motif, idx) => (
                <button
                  key={motif}
                  onClick={() => updatePiece(piece, undefined, idx)}
                  className={`flex-1 text-xs py-1.5 px-2 rounded border transition ${
                    state[piece]?.motif === idx
                      ? 'border-[var(--brass)] text-[var(--chalk)]'
                      : 'border-[var(--line)] text-[var(--mute)] hover:text-[var(--chalk)]'
                  }`}
                >
                  {motif}
                </button>
              ))}
            </div>
          )}
        </section>
      ))}

      {/* Essayage virtuel */}
      <VirtualFit state={state} onApplyAdvice={(newState) => onChange({ ...state, ...newState })} />

      {/* Récapitulatif */}
      <section className="mt-6 pt-4">
        <h3 className="text-xs tracking-widest uppercase text-[var(--mute)] mb-3">
          Votre tenue
        </h3>
        <dl className="text-xs space-y-1">
          {pieces.map((piece) => {
            const colorName = CATALOG.laines[state[piece]?.couleur ?? 0]?.nom;
            const motifName =
              piece === 'cravate'
                ? CATALOG.cravates[state[piece]?.couleur ?? 0]?.nom
                : CATALOG.motifs[state[piece]?.motif ?? 0];
            return (
              <div key={piece} className="flex justify-between">
                <dt className="text-[var(--mute)]">{pieceLabels[piece]}</dt>
                <dd className="text-[var(--chalk)]">
                  {piece === 'cravate'
                    ? colorName
                    : `${colorName}${motifName ? ` – ${motifName}` : ''}`}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>
    </aside>
  );
}
