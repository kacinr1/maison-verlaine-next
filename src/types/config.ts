export type PieceType = 'veste' | 'gilet' | 'pantalon' | 'cravate' | 'souliers';

export interface PieceState {
  couleur: number;
  motif: number;
}

export type ConfigState = Record<PieceType, PieceState>;

export const CATALOG = {
  laines: [
    { nom: 'Marine', hex: '#1a3a52' },
    { nom: 'Camel', hex: '#c4a05e' },
    { nom: 'Gris', hex: '#5d6b7f' },
    { nom: 'Noir', hex: '#1a1a1a' },
    { nom: 'Bordeaux', hex: '#5a2e3d' },
    { nom: 'Cognac', hex: '#8b5e3c' },
    { nom: 'Vert olive', hex: '#5a6e4f' },
    { nom: 'Charbon', hex: '#3d4654' },
  ],
  motifs: ['Uni', 'Fines rayures', 'Carreaux'] as const,
  cravates: [
    { nom: 'Unie', hex: '#2a3d5a' },
    { nom: 'Club', hex: '#3a4d6a' },
  ],
  souliers: [
    { nom: 'Oxford noir', hex: '#0d0d0d' },
    { nom: 'Cognac', hex: '#8b5e3c' },
    { nom: 'Marron clair', hex: '#a0826d' },
    { nom: 'Noir brillant', hex: '#1a1a1a' },
  ],
};

export const pieceLabels: Record<PieceType, string> = {
  veste: 'Veste',
  gilet: 'Gilet',
  pantalon: 'Pantalon',
  cravate: 'Cravate',
  souliers: 'Souliers',
};

export const initialState: ConfigState = {
  veste: { couleur: 0, motif: 0 },
  gilet: { couleur: 1, motif: 0 },
  pantalon: { couleur: 0, motif: 0 },
  cravate: { couleur: 0, motif: 0 },
  souliers: { couleur: 0, motif: 0 },
};
