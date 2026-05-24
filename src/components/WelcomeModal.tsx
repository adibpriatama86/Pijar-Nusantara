import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gamepad2 } from 'lucide-react';
import { playSound } from '../utils/audio';
import { logInteraction } from '../utils/telemetry';

export const WelcomeModal: React.FC = () => {
  const { playerName, setPlayerName } = useAppStore();
  const [nameInput, setNameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Show only if playerName is not set yet
  const isOpen = !playerName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim();

    if (!cleanName) {
      setErrorMsg('Aduh! Namamu tidak boleh kosong, ya! 😉');
      playSound('error');
      return;
    }

    if (cleanName.length < 2) {
      setErrorMsg('Namamu terlalu pendek! Pakai nama panggilanmu yang lucu, ya! 🐾');
      playSound('error');
      return;
    }

    if (cleanName.length > 15) {
      setErrorMsg('Wah, namamu panjang sekali! Maksimal 15 huruf saja, ya! ⭐');
      playSound('error');
      return;
    }

    // Success onboarding!
    setPlayerName(cleanName);
    playSound('levelUp');
    logInteraction('player_onboarding_success', { playerName: cleanName });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
    if (errorMsg) {
      setErrorMsg('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-darkslate/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative w-full max-w-md bg-[#FFF9E6] border-4 border-sunset rounded-3xl p-6 md:p-8 shadow-2xl z-10 text-center select-none"
          >
            {/* Playful Floating Badges */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-sunset text-white p-4 rounded-full border-4 border-white shadow-lg animate-bounce">
              <Gamepad2 className="w-8 h-8" />
            </div>

            <div className="mt-6 mb-4">
              <h2 className="text-2xl md:text-3xl font-black text-darkslate-dark mb-2 tracking-tight leading-tight">
                Halo Penjelajah Cilik! 👋
              </h2>
              <p className="text-darkslate/70 font-bold text-base md:text-lg">
                Sebelum memulai petualangan seru ini, beri tahu kami nama panggilanmu, ya!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={nameInput}
                  onChange={handleChange}
                  placeholder="Ketik namamu di sini..."
                  maxLength={15}
                  className="w-full text-center px-4 py-3 rounded-2xl border-4 border-darkslate/15 bg-white text-darkslate-dark placeholder-darkslate/30 font-black text-lg focus:outline-none focus:border-sunset focus:ring-4 focus:ring-sunset/20 transition-all shadow-inner"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-60">✍️</span>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-600 font-extrabold text-sm text-center"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full py-4 bg-gradient-to-r from-sunset-light to-sunset text-white font-black text-lg md:text-xl rounded-2xl shadow-md border-b-4 border-sunset-dark uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-lg"
              >
                <Sparkles className="w-5 h-5 fill-current" />
                Mulai Petualangan!
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
