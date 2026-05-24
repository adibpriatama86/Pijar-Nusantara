import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, capitalizeName } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { Sparkles, Trees, Rocket, BookOpen } from 'lucide-react';
import { playSound } from '../utils/audio';
import { logInteraction } from '../utils/telemetry';

export const Dashboard: React.FC = () => {
  const { playerName, score } = useAppStore();
  const navigate = useNavigate();

  const handleCardClick = (route: string, active: boolean, title: string) => {
    playSound('click');
    logInteraction('dashboard_card_clicked', { title, active, route });

    if (active) {
      navigate(route);
    } else {
      // Playful alert for locked modules
      alert(
        title === 'Matematika'
          ? '🧑‍🚀 Misi luar angkasa sedang disiapkan oleh para astronot! Tunggu sebentar lagi, ya! 🚀✨'
          : '🧙‍♂️ Pintu perpustakaan ajaib sedang dirapal mantra oleh pustakawan! Sabar ya! 📚🔮'
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 12 },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Greetings Area */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/40 border-2 border-darkslate/5 rounded-3xl p-6 md:p-8 shadow-sm select-none">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 bg-sunset text-white rounded-full flex items-center justify-center border-4 border-white shadow-md text-3xl font-black shrink-0">
            {playerName ? playerName[0].toUpperCase() : '🎒'}
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-darkslate-dark tracking-tight leading-tight mb-1">
              Selamat Datang, Penjelajah {capitalizeName(playerName)}! 🌟
            </h2>
            <p className="text-darkslate/60 text-base md:text-lg font-bold">
              Mau belajar seru tentang apa hari ini? Pilih petualanganmu!
            </p>
          </div>
        </div>

        {/* Global Level Summary */}
        <div className="flex items-center gap-2 bg-yellow-100 border-2 border-yellow-300 text-yellow-800 px-4 py-2 rounded-2xl shadow-sm font-black text-lg">
          <Sparkles className="w-5 h-5 fill-current text-yellow-500 animate-spin-slow" />
          <span>Skor Petualang: {score} ⭐</span>
        </div>
      </div>

      {/* Module Catalog Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Card 1: IPAS */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCardClick('/ipas', true, 'IPAS')}
          className="cursor-pointer group flex flex-col h-full bg-[#FFF9E6] rounded-3xl border-4 border-mint overflow-hidden shadow-xl hover:shadow-2xl transition-all"
        >
          <div className="h-40 bg-gradient-to-br from-emerald-400 to-green-600 relative flex items-center justify-center">
            <Trees className="w-20 h-20 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute left-4 top-4 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase text-white backdrop-blur-sm tracking-wider">
              Aktif 🟢
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow select-none">
            <h3 className="text-2xl font-black text-emerald-800 mb-2 tracking-tight group-hover:text-sunset transition-colors">
              IPAS: Penjelajah Alam 🌴
            </h3>
            <p className="text-darkslate/70 text-base font-semibold leading-relaxed flex-grow mb-6">
              Mari jelajahi kekayaan flora dan fauna Nusantara! Belajar mengenai habitat eksotis, diet makanan hewan, serta status konservasi mereka.
            </p>
            <div className="bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-2xl font-black text-center text-sm border border-emerald-100 flex items-center justify-center gap-1.5 uppercase tracking-wide">
              <span>Mulai Ekspedisi! 🧭</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Matematika */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCardClick('/math', false, 'Matematika')}
          className="cursor-pointer group flex flex-col h-full bg-[#FFF9E6] rounded-3xl border-4 border-darkslate/10 overflow-hidden shadow-xl hover:shadow-2xl transition-all opacity-80"
        >
          <div className="h-40 bg-gradient-to-br from-indigo-800 to-blue-900 relative flex items-center justify-center">
            <Rocket className="w-20 h-20 text-yellow-300 drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute right-4 top-4 bg-yellow-400 border-2 border-white text-xs font-black uppercase text-darkslate px-2 py-0.5 rounded-full shadow-md">
              Segera Hadir 🚀
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow select-none">
            <h3 className="text-2xl font-black text-indigo-900 mb-2 tracking-tight">
              Matematika: Misi Angkasa 🌌
            </h3>
            <p className="text-darkslate/70 text-base font-semibold leading-relaxed flex-grow mb-6">
              Terbang ke galaksi angka! Selesaikan misi matematika luar angkasa bersama tim astronot cilik Indonesia.
            </p>
            <div className="bg-darkslate/5 text-darkslate/40 px-4 py-2.5 rounded-2xl font-black text-center text-sm border border-darkslate/10 flex items-center justify-center gap-1.5 uppercase tracking-wide">
              <span>Dikunci 🔒</span>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Bahasa Indonesia */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCardClick('/bahasa', false, 'Bahasa Indonesia')}
          className="cursor-pointer group flex flex-col h-full bg-[#FFF9E6] rounded-3xl border-4 border-darkslate/10 overflow-hidden shadow-xl hover:shadow-2xl transition-all opacity-80"
        >
          <div className="h-40 bg-gradient-to-br from-amber-600 to-red-700 relative flex items-center justify-center">
            <BookOpen className="w-20 h-20 text-white drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute right-4 top-4 bg-yellow-400 border-2 border-white text-xs font-black uppercase text-darkslate px-2 py-0.5 rounded-full shadow-md">
              Segera Hadir 📖
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow select-none">
            <h3 className="text-2xl font-black text-red-800 mb-2 tracking-tight">
              Bahasa: Perpustakaan Ajaib 🔮
            </h3>
            <p className="text-darkslate/70 text-base font-semibold leading-relaxed flex-grow mb-6">
              Buka buku mantra kata! Mainkan petualangan merangkai kalimat indah dan menulis cerita fiksi pertamamu.
            </p>
            <div className="bg-darkslate/5 text-darkslate/40 px-4 py-2.5 rounded-2xl font-black text-center text-sm border border-darkslate/10 flex items-center justify-center gap-1.5 uppercase tracking-wide">
              <span>Dikunci 🔒</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
