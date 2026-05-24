// ============================================================
// src/data/siklusAir.ts
// Data module for Misi 2: Misteri Siklus Air
// ============================================================

export type DropZoneId = 'zone-evaporasi' | 'zone-kondensasi' | 'zone-presipitasi' | 'zone-infiltrasi';

export interface SiklusAirStage {
  id: string;
  name: string;
  emoji: string;
  /** Short kid-friendly description shown on card back */
  description: string;
  /** Full scientific explanation shown after drag-drop success */
  detail: string;
  dropZoneId: DropZoneId;
  /** Tailwind gradient for card header banner */
  bgGradient: string;
  /** Tailwind text colour for accents */
  accentColor: string;
}

export const siklusAirData: SiklusAirStage[] = [
  {
    id: 'evaporasi',
    name: 'Evaporasi',
    emoji: '☀️',
    description:
      'Panas matahari mengubah air di sungai, danau, dan lautan menjadi uap air yang ringan dan naik ke langit.',
    detail:
      'Evaporasi adalah proses penguapan air akibat energi panas dari matahari. Air dari permukaan bumi berubah wujud dari cair menjadi gas (uap air) dan terbawa naik ke atmosfer.',
    dropZoneId: 'zone-evaporasi',
    bgGradient: 'from-amber-300 to-orange-500',
    accentColor: 'text-amber-700',
  },
  {
    id: 'kondensasi',
    name: 'Kondensasi',
    emoji: '☁️',
    description:
      'Uap air yang naik tinggi menjadi dingin dan berubah menjadi tetesan air kecil yang membentuk awan dan kabut.',
    detail:
      'Kondensasi adalah proses berubahnya uap air menjadi tetesan air cair ketika bertemu udara dingin di ketinggian. Tetesan-tetesan kecil ini berkumpul membentuk awan tebal.',
    dropZoneId: 'zone-kondensasi',
    bgGradient: 'from-sky-300 to-blue-500',
    accentColor: 'text-sky-700',
  },
  {
    id: 'presipitasi',
    name: 'Presipitasi',
    emoji: '🌧️',
    description:
      'Ketika tetesan air di awan sudah terlalu berat, air jatuh kembali ke bumi dalam bentuk hujan, salju, atau es.',
    detail:
      'Presipitasi adalah jatuhnya air dari atmosfer ke permukaan bumi. Di Indonesia, presipitasi umumnya berbentuk hujan. Di daerah dingin, air bisa jatuh sebagai salju atau hujan es.',
    dropZoneId: 'zone-presipitasi',
    bgGradient: 'from-indigo-400 to-violet-600',
    accentColor: 'text-indigo-700',
  },
  {
    id: 'infiltrasi',
    name: 'Infiltrasi',
    emoji: '🌱',
    description:
      'Air hujan meresap ke dalam tanah dan menjadi air tanah yang tersimpan, memberi minum pada akar pohon dan tumbuhan.',
    detail:
      'Infiltrasi adalah proses meresapnya air hujan ke dalam lapisan tanah. Air ini disimpan sebagai air tanah yang menjadi sumber mata air, sumur, dan kebutuhan air bersih kita sehari-hari.',
    dropZoneId: 'zone-infiltrasi',
    bgGradient: 'from-emerald-400 to-green-600',
    accentColor: 'text-emerald-700',
  },
];

/** Drag-and-drop zone metadata used to render the diagram */
export interface DropZoneMeta {
  id: DropZoneId;
  label: string;
  hint: string;
  positionClasses: string; // absolute positioning within the diagram container
  bgColor: string;
}

export const dropZones: DropZoneMeta[] = [
  {
    id: 'zone-evaporasi',
    label: 'Evaporasi',
    hint: 'Di atas permukaan laut / danau',
    positionClasses: 'bottom-4 left-4',
    bgColor: 'bg-amber-100 border-amber-400',
  },
  {
    id: 'zone-kondensasi',
    label: 'Kondensasi',
    hint: 'Di langit, tempat awan terbentuk',
    positionClasses: 'top-4 left-1/2 -translate-x-1/2',
    bgColor: 'bg-sky-100 border-sky-400',
  },
  {
    id: 'zone-presipitasi',
    label: 'Presipitasi',
    hint: 'Air jatuh dari langit ke bumi',
    positionClasses: 'top-4 right-4',
    bgColor: 'bg-indigo-100 border-indigo-400',
  },
  {
    id: 'zone-infiltrasi',
    label: 'Infiltrasi',
    hint: 'Air meresap ke dalam tanah',
    positionClasses: 'bottom-4 right-4',
    bgColor: 'bg-emerald-100 border-emerald-400',
  },
];
