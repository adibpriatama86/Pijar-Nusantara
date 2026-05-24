import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playSound } from '../utils/audio';
import { logInteraction } from '../utils/telemetry';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Lock, Compass } from 'lucide-react';

interface LevelItem {
  id: number;
  title: string;
  description: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
  unlocked: boolean;
  route?: string;
}

export const IpasHub: React.FC = () => {
  const navigate = useNavigate();
  const currentIpasLevel = useAppStore((state) => state.currentIpasLevel);
  const missionProgress = useAppStore((state) => state.missionProgress);

  const levels: LevelItem[] = [
    {
      id: 1,
      title: "Ekspedisi Flora & Fauna",
      description: "Jelajahi kekayaan makhluk hidup Nusantara, habitat eksotis, diet makanan hewan, serta misi penyelamatan lingkungan hidup!",
      emoji: "🌴",
      bgGradient: "from-emerald-400 to-green-600",
      borderColor: "border-mint",
      unlocked: true,
      route: "/ipas/level/1"
    },
    {
      id: 2,
      title: "Misteri Siklus Air",
      description: "Ikuti perjalanan tetesan air dari awan, hujan rintik-rintik, hingga meresap ke dalam tanah subur Indonesia.",
      emoji: "💧",
      bgGradient: "from-blue-400 to-sky-600",
      borderColor: "border-blue-300",
      unlocked: currentIpasLevel >= 2,
      route: "/ipas/level/2"
    },
    {
      id: 3,
      title: "Energi Tersembunyi",
      description: "Temukan berbagai macam energi di sekitarmu, mulai dari panas matahari hingga aliran listrik ramah lingkungan.",
      emoji: "⚡",
      bgGradient: "from-amber-400 to-yellow-600",
      borderColor: "border-amber-300",
      unlocked: currentIpasLevel >= 3,
      route: "/ipas/level/3"
    },
    {
      id: 4,
      title: "Gaya & Gerak Magnet",
      description: "Bermain dengan kekuatan tak terlihat! Cari tahu bagaimana magnet menarik benda dan mendorong mobil balap cilik.",
      emoji: "🧲",
      bgGradient: "from-red-400 to-rose-600",
      borderColor: "border-red-300",
      unlocked: currentIpasLevel >= 4,
      route: "/ipas/level/4"    },
    {
      id: 5,
      title: "Rahasia Tata Surya",
      description: "Terbang menembus atmosfer menuju bintang-bintang! Pelajari planet berputar mengelilingi matahari.",
      emoji: "🪐",
      bgGradient: "from-indigo-500 to-purple-700",
      borderColor: "border-indigo-300",
      unlocked: currentIpasLevel >= 5
    }
  ];

  const handleLevelClick = (level: LevelItem) => {
    if (level.unlocked && level.route) {
      playSound('click');
      logInteraction('level_grid_clicked', { levelId: level.id, title: level.title });
      navigate(level.route);
    } else {
      playSound('error');
      alert(`🔒 Misi "${level.title}" masih terkunci! Selesaikan ekspedisi sebelumnya untuk membuka gerbang petualangan ini! ✨`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
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
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 select-none">
        <motion.button
          onClick={() => {
            playSound('click');
            navigate('/');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="self-start flex items-center gap-2 bg-[#FFF9E6] text-darkslate border-b-4 border-darkslate/20 border-2 px-5 py-2.5 rounded-2xl shadow-md font-bold text-base"
        >
          <ArrowLeft className="w-5 h-5 text-sunset" />
          Kembali ke Beranda
        </motion.button>

        <div className="flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-2 rounded-2xl shadow-sm font-black text-lg">
          <Compass className="w-5 h-5 animate-spin-slow text-sunset" />
          <span>Peta Petualangan IPAS Kelas 3-4 SD 🗺️</span>
        </div>
      </div>

      {/* Intro text */}
      <div className="text-center mb-12 select-none">
        <h2 className="text-3xl md:text-5xl font-black text-darkslate-dark tracking-tight leading-none mb-4">
          Peta Misi Nusantara 🏕️
        </h2>
        <p className="text-lg md:text-xl text-darkslate/70 max-w-2xl mx-auto font-medium">
          Pilih salah satu tingkat kesulitan di bawah ini untuk memulai petualangan sains serumu!
        </p>
      </div>

      {/* Levels Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {levels.map((level) => {
          const progressPercentage = missionProgress[level.id] || 0;
          const isCompleted = progressPercentage === 100;
          
          return (
          <motion.div
            key={level.id}
            variants={cardVariants}
            whileHover={level.unlocked ? { scale: 1.04, y: -5 } : {}}
            whileTap={level.unlocked ? { scale: 0.96 } : {}}
            onClick={() => handleLevelClick(level)}
            className={`flex flex-col h-full bg-[#FFF9E6] rounded-3xl border-4 overflow-hidden shadow-xl transition-all ${
              level.unlocked
                ? 'cursor-pointer border-mint hover:shadow-2xl'
                : 'cursor-not-allowed border-darkslate/10 opacity-70 grayscale'
            }`}
          >
            {/* Level Cover Image / Color Banner */}
            <div className={`h-36 bg-gradient-to-br ${level.bgGradient} relative flex items-center justify-center`}>
              <span className={`text-6xl filter drop-shadow-md ${level.unlocked ? 'animate-pulse' : ''}`}>
                {level.emoji}
              </span>

              {/* Unlock status badge */}
              <div className="absolute left-4 top-4 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase text-white backdrop-blur-sm tracking-wider">
                Misi {level.id}
              </div>

              {isCompleted && (
                <div className="absolute right-4 top-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-black uppercase shadow-md flex items-center gap-1 border-2 border-yellow-300">
                  Selesai 🏆
                </div>
              )}

              {/* Lock Icon */}
              {!level.unlocked && !isCompleted && (
                <div className="absolute right-4 top-4 bg-darkslate/60 p-2 rounded-full text-white border-2 border-white shadow-md">
                  <Lock className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Level Info */}
            <div className="p-6 flex flex-col flex-grow select-none">
              <h3 className={`text-2xl font-black mb-2 tracking-tight ${
                level.unlocked ? 'text-emerald-800' : 'text-darkslate/40'
              }`}>
                {level.title}
              </h3>
              <p className="text-darkslate/70 text-base font-semibold leading-relaxed flex-grow mb-4">
                {level.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className={level.unlocked ? 'text-darkslate' : 'text-darkslate/40'}>Progres Misi</span>
                  <div className="text-right shrink-0 min-w-[3rem]">
                    <span className={level.unlocked ? 'text-darkslate' : 'text-darkslate/40'}>
                      {progressPercentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-darkslate/10 rounded-full overflow-hidden mt-1 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`absolute top-0 left-0 h-full ${level.bgGradient}`}
                  />
                </div>
              </div>

              {/* Action Button */}
              {level.unlocked ? (
                <div className="bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-2xl font-black text-center text-sm border border-emerald-100 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <span>Mulai Ekspedisi! 🧭</span>
                </div>
              ) : (
                <div className="bg-darkslate/5 text-darkslate/40 px-4 py-2.5 rounded-2xl font-black text-center text-sm border border-darkslate/10 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <span>Terkunci 🔒</span>
                </div>
              )}
            </div>
          </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
export default IpasHub;
