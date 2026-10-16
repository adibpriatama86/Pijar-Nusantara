import React from 'react';
import { habitats, curriculumData } from '../data/curriculum';
import { useProgressStore } from '../store/useProgressStore';
import { Compass, Sparkles, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { playSound } from '../utils/audio';

interface HabitatMapProps {
  onSelectHabitat: (habitatName: 'Hutan Tropis' | 'Sabana' | 'Lautan') => void;
  onSelectGame: () => void;
}

export const HabitatMap: React.FC<HabitatMapProps> = ({ onSelectHabitat, onSelectGame }) => {
  const completedItems = useProgressStore((state) => state.completedItems);

  // Helper to count progress in each habitat
  const getHabitatProgress = (habitatName: 'Hutan Tropis' | 'Sabana' | 'Lautan') => {
    const total = curriculumData.filter(item => item.habitat === habitatName).length;
    const completed = curriculumData.filter(
      item => item.habitat === habitatName && completedItems.includes(item.id)
    ).length;
    return { completed, total };
  };

  const handleHabitatClick = (habitatName: 'Hutan Tropis' | 'Sabana' | 'Lautan') => {
    playSound('click');
    onSelectHabitat(habitatName);
  };

  const handleGameClick = () => {
    playSound('levelUp');
    onSelectGame();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 12 }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Intro Banner */}
      <div className="text-center mb-10 select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="inline-flex items-center gap-2 bg-accentSky-light border-2 border-accentSky text-darkslate px-4 py-1.5 rounded-full mb-3 shadow-sm font-semibold"
        >
          <Compass className="w-5 h-5 text-sunset animate-spin-slow" />
          <span>Kurikulum Merdeka - IPA &amp; IPS Kelas 3-4 SD</span>
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-black text-darkslate-dark tracking-tight leading-none mb-4">
          Peta Penjelajah Nusantara 🗺️
        </h2>
        <p className="text-lg md:text-xl text-darkslate/70 max-w-2xl mx-auto font-medium">
          Hai Penjelajah Cilik! Pilih salah satu habitat di bawah untuk mulai menjelajahi flora dan fauna unik Indonesia, atau langsung mainkan game mencocokkan!
        </p>
      </div>



      {/* Habitats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {habitats.map((habitat) => {
          const { completed, total } = getHabitatProgress(habitat.name as any);
          const isCompleted = completed === total && total > 0;

          return (
            <motion.div
              key={habitat.id}
              variants={cardVariants}
              whileHover={{ scale: 1.04, y: -8 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              onClick={() => handleHabitatClick(habitat.name as any)}
              className="cursor-pointer group flex flex-col h-full bg-[#FFF9E6] rounded-3xl border-4 border-darkslate/10 overflow-hidden shadow-xl hover:shadow-2xl hover:border-mint transition-all"
            >
              {/* Colored Top Header */}
              <div className={`h-32 bg-gradient-to-br ${habitat.themeColor} relative flex items-center justify-center`}>
                <span className="text-6xl filter drop-shadow-md transition-transform group-hover:scale-110 duration-300">
                  {habitat.name === 'Hutan Tropis' ? '🌳' : habitat.name === 'Sabana' ? '🦁' : '🐠'}
                </span>
                
                {isCompleted && (
                  <div className="absolute right-4 top-4 bg-yellow-400 border-2 border-white text-xs font-black uppercase text-darkslate px-2 py-1 rounded-full shadow-md animate-bounce">
                    Selesai! 🏆
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow select-none">
                <h3 className="text-2xl font-black text-darkslate-dark mb-2 tracking-tight group-hover:text-sunset transition-colors">
                  {habitat.displayName}
                </h3>
                <p className="text-darkslate/70 text-base font-semibold leading-relaxed flex-grow mb-6">
                  {habitat.description}
                </p>

                {/* Progress bar */}
                <div className="bg-darkslate/5 border border-darkslate/10 p-3 rounded-2xl">
                  <div className="flex justify-between text-sm font-bold text-darkslate mb-1">
                    <span>Eksplorasi</span>
                    <span>{completed}/{total} Spesies</span>
                  </div>
                  <div className="h-2.5 w-full bg-darkslate/10 rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full bg-gradient-to-r ${habitat.themeColor} rounded-full`}
                      style={{ width: `${(completed / total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
