import React from 'react';
import { useProgressStore } from '../store/useProgressStore';
import { useAppStore, capitalizeName } from '../store/useAppStore';
import { Volume2, VolumeX, RotateCcw, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { playSound } from '../utils/audio';

interface HeaderProps {
  totalItems: number;
}

export const Header: React.FC<HeaderProps> = ({ totalItems }) => {
  const { completedItems, score, isMuted, toggleMute, resetProgress } = useProgressStore();
  const { playerName, resetStore } = useAppStore();

  const completedCount = completedItems.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalItems) * 100));

  // Kid-friendly levels
  let explorerLevel = "Penjelajah Pemula 🎒";
  let levelColor = "bg-amber-100 text-amber-800 border-amber-300";
  if (completedCount >= 9) {
    explorerLevel = "Ahli Biologi Cilik 🏆";
    levelColor = "bg-purple-100 text-purple-800 border-purple-300";
  } else if (completedCount >= 6) {
    explorerLevel = "Pelindung Alam 🌳";
    levelColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
  } else if (completedCount >= 3) {
    explorerLevel = "Sahabat Hutan 🦧";
    levelColor = "bg-sky-100 text-sky-800 border-sky-300";
  }

  const handleToggleMute = () => {
    toggleMute();
    setTimeout(() => {
      playSound('click');
    }, 50);
  };

  const handleReset = () => {
    if (window.confirm("Apakah kamu yakin ingin mengulang petualanganmu dari awal?")) {
      resetProgress();
      resetStore();
      playSound('error');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFF9E6]/95 backdrop-blur-md border-b-4 border-mint shadow-md px-4 py-3 md:px-8 md:py-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Logo and Level */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-darkslate-dark tracking-tight m-0 select-none font-sans leading-none">
                <span className="text-sunset">Pijar</span>&nbsp;<span className="text-mint-dark">Nusantara</span>
              </h1>
              {playerName && (
                <span className="text-xs font-bold text-sunset-dark block mt-1">
                  Halo, {capitalizeName(playerName)}! 🏕️
                </span>
              )}
            </div>
          </div>

          <div className={`px-3 py-1 text-sm font-bold rounded-full border-2 ${levelColor} flex items-center gap-1 shadow-sm select-none`}>
            <Award className="w-4 h-4" />
            <span>{explorerLevel}</span>
          </div>
        </div>

        {/* Progress & Actions */}
        <div className="flex flex-1 md:max-w-md items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm font-bold text-darkslate mb-1">
              <span>Kemajuan Penjelajah: {progressPercent}%</span>
              <span>{completedCount}/{totalItems} Info</span>
            </div>
            <div className="h-4 w-full bg-darkslate/10 rounded-full overflow-hidden border border-darkslate/15 p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-mint to-mint-dark rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              />
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center gap-2">
            <div className="bg-sunset text-white px-3 py-1.5 rounded-2xl border-b-4 border-sunset-dark font-extrabold text-lg shadow-sm flex items-center gap-1 select-none">
              ⭐ <span className="font-mono">{score}</span>
            </div>

            {/* Mute Button */}
            <motion.button
              onClick={handleToggleMute}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`p-2.5 rounded-2xl border-2 shadow-sm ${
                isMuted
                  ? 'bg-red-100 text-red-600 border-red-300'
                  : 'bg-mint-light text-mint-dark border-mint'
              }`}
              title={isMuted ? "Bunyi Mati" : "Bunyi Aktif"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </motion.button>

            {/* Reset Button */}
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 border-2 border-amber-300 shadow-sm"
              title="Ulangi Kemajuan"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};
