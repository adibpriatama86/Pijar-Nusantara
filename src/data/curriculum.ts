export interface FloraFaunaItem {
  id: string;
  name: string;
  scientificName: string;
  type: 'animal' | 'plant';
  diet: 'Karnivora' | 'Herbivora' | 'Omnivora' | 'None';
  habitat: 'Hutan Tropis' | 'Sabana' | 'Lautan';
  funFact: string;
  conservationStatus: 'Terancam Punah' | 'Rentan' | 'Sangat Terancam' | 'Aman';
  emoji: string;
}

export const habitats = [
  {
    id: 'hutan-tropis',
    name: 'Hutan Tropis',
    displayName: 'Hutan Hujan Tropis 🌳',
    description: 'Hutan yang lebat, hijau, dan penuh dengan keanekaragaman hayati yang menakjubkan!',
    themeColor: 'from-emerald-400 to-green-600',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-700',
    accentColor: '#A8E6CF',
  },
  {
    id: 'sabana',
    name: 'Sabana',
    displayName: 'Sabana Indonesia 🌾',
    description: 'Padang rumput luas yang diselingi pepohonan jarang, beriklim hangat dan eksotis!',
    themeColor: 'from-amber-400 to-orange-500',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-700',
    accentColor: '#FFD3B6',
  },
  {
    id: 'lautan',
    name: 'Lautan',
    displayName: 'Terumbu Karang & Lautan 🌊',
    description: 'Dunia bawah laut Nusantara yang kaya, jernih, dan menjadi rumah bagi jutaan biota laut!',
    themeColor: 'from-sky-400 to-blue-600',
    borderColor: 'border-sky-400',
    textColor: 'text-sky-700',
    accentColor: '#DCEDC1',
  }
];

export const curriculumData: FloraFaunaItem[] = [
  // Hutan Tropis
  {
    id: 'orangutan',
    name: 'Orangutan Sumatra',
    scientificName: 'Pongo abelii',
    type: 'animal',
    diet: 'Omnivora',
    habitat: 'Hutan Tropis',
    funFact: 'Orangutan memiliki rentang tangan yang sangat panjang, bisa mencapai lebih dari 2 meter untuk bergelantungan di pohon!',
    conservationStatus: 'Sangat Terancam',
    emoji: '🦧'
  },
  {
    id: 'harimau-sumatra',
    name: 'Harimau Sumatra',
    scientificName: 'Panthera tigris sumatrae',
    type: 'animal',
    diet: 'Karnivora',
    habitat: 'Hutan Tropis',
    funFact: 'Harimau Sumatra memiliki selaput di antara jari kakinya yang membuat mereka menjadi perenang yang sangat andal!',
    conservationStatus: 'Sangat Terancam',
    emoji: '🐅'
  },
  {
    id: 'kantong-semar',
    name: 'Kantong Semar',
    scientificName: 'Nepenthes',
    type: 'plant',
    diet: 'Karnivora', // Karnivora plant
    habitat: 'Hutan Tropis',
    funFact: 'Kantong Semar menangkap serangga menggunakan cairan licin di bibir kantongnya untuk kemudian dicerna menjadi makanan!',
    conservationStatus: 'Aman',
    emoji: '🪴'
  },

  // Sabana
  {
    id: 'komodo',
    name: 'Komodo',
    scientificName: 'Varanus komodoensis',
    type: 'animal',
    diet: 'Karnivora',
    habitat: 'Sabana',
    funFact: 'Komodo adalah kadal terbesar di dunia yang masih hidup dan memiliki air liur yang penuh dengan bakteri mematikan untuk melumpuhkan mangsa!',
    conservationStatus: 'Terancam Punah',
    emoji: '🦎'
  },
  {
    id: 'kuda-sandalwood',
    name: 'Kuda Sandalwood',
    scientificName: 'Equus caballus',
    type: 'animal',
    diet: 'Herbivora',
    habitat: 'Sabana',
    funFact: 'Kuda Sandalwood adalah kuda poni asli Pulau Sumba yang terkenal sangat tangguh, cerdas, dan lincah!',
    conservationStatus: 'Aman',
    emoji: '🐎'
  },
  {
    id: 'edelweiss-jawa',
    name: 'Bunga Edelweiss Jawa',
    scientificName: 'Anaphalis javanica',
    type: 'plant',
    diet: 'None',
    habitat: 'Sabana',
    funFact: 'Dijuluki "Bunga Abadi" karena memiliki kandungan hormon etilen yang dapat mencegah kelopak bunganya agar tidak layu atau gugur!',
    conservationStatus: 'Rentan',
    emoji: '🌼'
  },

  // Lautan
  {
    id: 'penyu-hijau',
    name: 'Penyu Hijau',
    scientificName: 'Chelonia mydas',
    type: 'animal',
    diet: 'Herbivora',
    habitat: 'Lautan',
    funFact: 'Penyu Hijau dewasa hanya memakan alga dan rumput laut, yang membuat lemak di tubuh mereka berwarna kehijauan!',
    conservationStatus: 'Terancam Punah',
    emoji: '🐢'
  },
  {
    id: 'dugong',
    name: 'Dugong',
    scientificName: 'Dugong dugon',
    type: 'animal',
    diet: 'Herbivora',
    habitat: 'Lautan',
    funFact: 'Dugong adalah mamalia laut satu-satunya yang murni vegetarian dan menghabiskan sebagian besar waktunya memakan padang lamun!',
    conservationStatus: 'Rentan',
    emoji: '🧜‍♀️'
  },
  {
    id: 'lamun',
    name: 'Padang Lamun',
    scientificName: 'Enhalus acoroides',
    type: 'plant',
    diet: 'None',
    habitat: 'Lautan',
    funFact: 'Berbeda dari rumput laut biasa (alga), lamun adalah tumbuhan sejati yang memiliki akar, batang, daun, bunga, dan biji di bawah laut!',
    conservationStatus: 'Aman',
    emoji: '🌿'
  }
];
