export interface EnergiEksplorasi {
  id: string;
  name: string;
  energyType: string;
  icon: string;
  description: string;
  bgGradient: string;
}

export const energiEksplorasiData: EnergiEksplorasi[] = [
  {
    id: 'gitar',
    name: 'Gitar',
    energyType: 'Energi Bunyi',
    icon: 'Music',
    description: 'Petikan senar gitar menghasilkan getaran yang merambat di udara menjadi bunyi yang merdu.',
    bgGradient: 'from-orange-400 to-red-500',
  },
  {
    id: 'senter',
    name: 'Senter',
    energyType: 'Energi Cahaya',
    icon: 'Flashlight',
    description: 'Baterai di dalam senter mengubah energi kimia menjadi cahaya terang untuk menerangi kegelapan.',
    bgGradient: 'from-yellow-300 to-amber-500',
  },
  {
    id: 'kincir',
    name: 'Kincir Angin',
    energyType: 'Energi Gerak',
    icon: 'Wind',
    description: 'Angin yang berhembus mendorong baling-baling kincir sehingga berputar menghasilkan energi gerak (kinetik).',
    bgGradient: 'from-teal-300 to-emerald-500',
  },
  {
    id: 'setrika',
    name: 'Setrika',
    energyType: 'Energi Panas',
    icon: 'Flame',
    description: 'Elemen pemanas di dalam setrika mengubah listrik menjadi panas untuk merapikan pakaianmu.',
    bgGradient: 'from-rose-400 to-pink-600',
  }
];

export interface EnergiTransformasi {
  id: string;
  label: string;
  icon: string;
  machineId: string;
}

export interface EnergiMesin {
  id: string;
  name: string;
  icon: string;
}

export const energiMesinData: EnergiMesin[] = [
  { id: 'panel-surya', name: 'Panel Surya', icon: 'Sun' },
  { id: 'kipas-angin', name: 'Kipas Angin', icon: 'Fan' },
  { id: 'lampu-belajar', name: 'Lampu Belajar', icon: 'Lightbulb' },
];

export const energiTransformasiData: EnergiTransformasi[] = [
  { id: 'output-listrik', label: 'Energi Listrik', icon: 'Zap', machineId: 'panel-surya' },
  { id: 'output-gerak', label: 'Energi Gerak', icon: 'Wind', machineId: 'kipas-angin' },
  { id: 'output-cahaya', label: 'Energi Cahaya', icon: 'Sparkles', machineId: 'lampu-belajar' },
];
