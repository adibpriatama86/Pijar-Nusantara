import React, { useState } from 'react';
import type { FloraFaunaItem } from '../data/curriculum';
import { curriculumData } from '../data/curriculum';
import { useProgressStore } from '../store/useProgressStore';
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { playSound } from '../utils/audio';

interface FlashcardGridProps {
  habitatName: 'Hutan Tropis' | 'Sabana' | 'Lautan';
  onBack: () => void;
}

export const FlashcardGrid: React.FC<FlashcardGridProps> = ({ habitatName, onBack }) => {
  const { completedItems, completeItem } = useProgressStore();
  const items = curriculumData.filter((item) => item.habitat === habitatName);

  // Track flipped state for each card ID
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    playSound('flip');
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleComplete = (e: React.MouseEvent, item: FloraFaunaItem) => {
    e.stopPropagation(); // Stop card from flipping when clicking the button
    const isNew = completeItem(item.id, 10);
    if (isNew) {
      playSound('success');
    } else {
      playSound('click');
    }
  };

  // Helper to color-code conservation statuses
  const getStatusColor = (status: FloraFaunaItem['conservationStatus']) => {
    switch (status) {
      case 'Sangat Terancam':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Terancam Punah':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Rentan':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Aman':
        default:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getHabitatTitleColor = () => {
    if (habitatName === 'Hutan Tropis') return 'text-emerald-700 bg-emerald-100 border-emerald-300';
    if (habitatName === 'Sabana') return 'text-amber-700 bg-amber-100 border-amber-300';
    return 'text-sky-700 bg-sky-100 border-sky-300';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.button
          onClick={() => {
            playSound('click');
            onBack();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="self-start flex items-center gap-2 bg-[#FFF9E6] text-darkslate border-b-4 border-darkslate/20 border-2 px-5 py-2.5 rounded-2xl shadow-md font-bold text-base"
        >
          <ArrowLeft className="w-5 h-5 text-sunset" />
          Kembali ke Peta
        </motion.button>

        <div className={`px-5 py-2.5 rounded-2xl border-2 font-black text-xl flex items-center gap-2 shadow-sm ${getHabitatTitleColor()} select-none`}>
          <span>Habitat: {habitatName === 'Hutan Tropis' ? 'Hutan Tropis 🌳' : habitatName === 'Sabana' ? 'Sabana 🌾' : 'Lautan 🌊'}</span>
        </div>
      </div>

      {/* Grid of Flashcards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item) => {
          const isFlipped = !!flippedCards[item.id];
          const isCompleted = completedItems.includes(item.id);

          return (
            <div 
              key={item.id} 
              className="perspective-1000 w-full h-[400px] cursor-pointer"
              onClick={() => toggleFlip(item.id)}
            >
              <motion.div
                className="relative w-full h-full preserve-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              >
                {/* CARD FRONT */}
                <div 
                  className={`absolute inset-0 backface-hidden flex flex-col justify-between p-6 rounded-3xl border-4 bg-[#FFF9E6] shadow-xl hover:shadow-2xl transition-shadow ${
                    isCompleted ? 'border-mint' : 'border-darkslate/10'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-center select-none">
                    <span className={`px-3 py-1 text-xs font-extrabold rounded-full uppercase border-2 ${
                      item.type === 'animal' 
                        ? 'bg-orange-50 text-orange-700 border-orange-200' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {item.type === 'animal' ? '🐾 Hewan' : '🌱 Tumbuhan'}
                    </span>
                    
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-xs text-mint-dark font-extrabold bg-mint-light/40 border border-mint/30 px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5 fill-current" /> Dibaca
                      </span>
                    )}
                  </div>

                  {/* Card Content - Large Emoji & Title */}
                  <div className="flex flex-col items-center justify-center flex-grow text-center select-none">
                    <motion.span 
                      className="text-8xl mb-4 filter drop-shadow-md"
                      animate={{ scale: isFlipped ? 0.9 : 1 }}
                      whileHover={{ scale: 1.15 }}
                    >
                      {item.emoji}
                    </motion.span>
                    <h4 className="text-2xl font-black text-darkslate-dark tracking-tight leading-tight">
                      {item.name}
                    </h4>
                  </div>

                  {/* Card Footer - Action Prompt */}
                  <div className="text-center text-sm font-bold text-darkslate/40 flex items-center justify-center gap-1.5 border-t border-darkslate/5 pt-4 select-none">
                    <BookOpen className="w-4 h-4" />
                    <span>Klik untuk info seru!</span>
                  </div>
                </div>

                {/* CARD BACK */}
                <div 
                  className="absolute inset-0 backface-hidden flex flex-col justify-between p-6 rounded-3xl border-4 border-mint bg-[#FFF9E6] shadow-xl"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  {/* Card Header (Back) */}
                  <div className="flex justify-between items-center select-none">
                    <span className="text-sm font-black text-darkslate-light italic">
                      ({item.scientificName})
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-black rounded-full border ${getStatusColor(item.conservationStatus)}`}>
                      {item.conservationStatus}
                    </span>
                  </div>

                  {/* Card Content (Back) */}
                  <div className="flex flex-col flex-grow my-4 justify-center select-none">
                    <div className="bg-white/60 border border-darkslate/5 rounded-2xl p-4 text-darkslate text-base md:text-base font-semibold leading-relaxed overflow-y-auto max-h-[170px]">
                      <span className="block font-black text-sunset mb-1 flex items-center gap-1 text-sm md:text-base uppercase tracking-wider">
                        💡 Tahukah Kamu?
                      </span>
                      {item.funFact}
                    </div>
                  </div>

                  {/* Card Action Button (Back) */}
                  <div className="flex justify-center pt-2">
                    <motion.button
                      onClick={(e) => handleComplete(e, item)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-2.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 border-b-4 ${
                        isCompleted
                          ? 'bg-mint/20 text-mint-dark border-mint border-2'
                          : 'bg-sunset text-white border-sunset-dark'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-5 h-5 fill-current" />
                          <span>Sudah Dibaca! (+10 ⭐)</span>
                        </>
                      ) : (
                        <>
                          <span>Tandai Sudah Dibaca (+10 ⭐)</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
