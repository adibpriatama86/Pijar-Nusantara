import React, { useState } from 'react';
import { useProgressStore } from '../store/useProgressStore';
import { playSound } from '../utils/audio';
import { logInteraction } from '../utils/telemetry';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConservationGameProps {
  onBack: () => void;
  onComplete: () => void;
}

interface Option {
  id: 'A' | 'B' | 'C';
  text: string;
  isCorrect: boolean;
  explanation: string;
  emoji: string;
}

export const ConservationGame: React.FC<ConservationGameProps> = ({ onBack, onComplete }) => {
  const { completeItem } = useProgressStore();
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const scenario = {
    title: "Misi Penyelamatan Hutan Orangutan 🦧",
    description: "Hutan hujan tempat tinggal Orangutan di Kalimantan sedang ditebang liar secara besar-besaran. Orangutan kehilangan rumah (habitat asli) mereka dan kesulitan mencari makan, sehingga jumlah mereka berkurang drastis.",
    question: "Sebagai Sahabat Alam Nusantara, apa tindakan terbaik yang harus kita lakukan?",
    options: [
      {
        id: 'A',
        emoji: '🏠',
        text: 'Menangkap Orangutan dan membawanya pulang untuk dijadikan hewan peliharaan di rumah agar aman.',
        isCorrect: false,
        explanation: 'Aduh, kurang tepat! Orangutan adalah satwa liar dilindungi. Memeliharanya di rumah bertentangan dengan hukum dan membuat mereka stres karena tidak dapat memanjat pohon tinggi di habitat aslinya. 🚫'
      },
      {
        id: 'B',
        emoji: '🛡️',
        text: 'Mendirikan kawasan Cagar Alam terlindungi, melarang penebangan liar, dan menanam kembali hutan yang gundul.',
        isCorrect: true,
        explanation: 'Luar biasa! Jawabanmu 100% benar! Ini disebut konservasi In-Situ (menjaga satwa di tempat tinggal aslinya). Dengan menjaga hutan tetap lestari, Orangutan akan memiliki rumah aman dan makanan berlimpah sepanjang tahun! 💚✨'
      },
      {
        id: 'C',
        emoji: '✈️',
        text: 'Memindahkan semua Orangutan ke pulau kosong di benua lain agar mereka jauh dari jangkauan manusia.',
        isCorrect: false,
        explanation: 'Hmm, kurang tepat! Memindahkan Orangutan ke luar negeri bisa sangat berbahaya. Cuaca, jenis pohon, dan makanan di sana berbeda dari hutan asli Indonesia. Mereka bisa jatuh sakit dan sulit menyesuaikan diri. 🚫'
      }
    ] as Option[]
  };

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    logInteraction('conservation_option_selected', { optionId: option.id, isCorrect: option.isCorrect });

    if (option.isCorrect) {
      playSound('levelUp');
      triggerMassiveConfetti();
      setHasSucceeded(true);
      
      // Mark as complete and give 100 points
      completeItem('ipas-conservation', 100);
    } else {
      playSound('error');
    }
    setShowModal(true);
  };

  const triggerMassiveConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF7A59', '#38bdf8', '#34d399', '#fbbf24']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF7A59', '#38bdf8', '#34d399', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (hasSucceeded) {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6 select-none">
        <motion.button
          onClick={() => {
            playSound('click');
            onBack();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-[#FFF9E6] text-darkslate border-b-4 border-darkslate/20 border-2 px-5 py-2.5 rounded-2xl shadow-md font-bold text-base"
        >
          <ArrowLeft className="w-5 h-5 text-sunset" />
          Kembali ke Level
        </motion.button>
      </div>

      {/* Main Container */}
      <div className="bg-[#FFF9E6] border-4 border-sunset rounded-3xl p-6 md:p-8 shadow-xl select-none">
        
        {/* Level Indicator Badge */}
        <div className="inline-flex items-center gap-2 bg-sunset/10 border-2 border-sunset/30 text-sunset-dark px-4 py-1.5 rounded-full mb-6 font-black text-sm">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>LEVEL 3: MISI KONSERVASI ADVANCED</span>
        </div>

        {/* Case Study Card */}
        <div className="bg-white/70 border-2 border-darkslate/5 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="text-8xl shrink-0 p-4 bg-sunset-light/20 rounded-full border-4 border-white shadow-md animate-pulse">
            🦧
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-darkslate-dark tracking-tight mb-2">
              {scenario.title}
            </h3>
            <p className="text-darkslate/80 text-base md:text-lg font-bold leading-relaxed mb-4">
              {scenario.description}
            </p>
            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl font-black text-base md:text-lg flex items-start gap-2 shadow-inner">
              <span className="text-xl">🕵️‍♂️</span>
              <p>{scenario.question}</p>
            </div>
          </div>
        </div>

        {/* Choices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenario.options.map((option) => (
            <motion.div
              key={option.id}
              onClick={() => handleSelectOption(option)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="cursor-pointer bg-white rounded-3xl border-4 border-darkslate/10 hover:border-sunset p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-colors h-full"
            >
              <div>
                <div className="w-14 h-14 bg-sunset-light/10 border-2 border-sunset-light rounded-2xl flex items-center justify-center text-3xl font-black mb-4 shadow-sm">
                  {option.emoji}
                </div>
                <h4 className="text-xl font-black text-darkslate-dark mb-3">
                  Pilihan {option.id}
                </h4>
                <p className="text-darkslate/70 text-base font-semibold leading-relaxed">
                  {option.text}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-darkslate/5 text-center">
                <span className="text-sunset text-sm font-black uppercase tracking-wider group-hover:text-sunset-dark">
                  Pilih Tindakan! 🧭
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Result / Explanation Modal */}
      <AnimatePresence>
        {showModal && selectedOption && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleModalClose}
              className="absolute inset-0 bg-darkslate/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`relative w-full max-w-lg rounded-3xl p-6 md:p-8 text-center shadow-2xl z-10 select-none border-4 bg-[#FFF9E6] ${
                selectedOption.isCorrect ? 'border-mint' : 'border-red-400'
              }`}
            >
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full border-4 border-white shadow-md text-6xl ${
                  selectedOption.isCorrect ? 'bg-mint-light/20 text-mint' : 'bg-red-50 text-red-500'
                }`}>
                  {selectedOption.isCorrect ? (
                    <CheckCircle2 className="w-14 h-14 text-mint" />
                  ) : (
                    <AlertCircle className="w-14 h-14 text-red-500" />
                  )}
                </div>
              </div>

              <h3 className={`text-2xl md:text-3xl font-black mb-3 tracking-tight ${
                selectedOption.isCorrect ? 'text-emerald-800' : 'text-red-700'
              }`}>
                {selectedOption.isCorrect ? 'Hore! Kamu Benar!' : 'Aduh, Kurang Tepat!'}
              </h3>

              <p className="text-darkslate/80 text-base md:text-lg font-bold leading-relaxed mb-6 bg-white/60 border border-darkslate/5 p-4 rounded-2xl shadow-inner">
                {selectedOption.explanation}
              </p>

              <motion.button
                onClick={handleModalClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3.5 rounded-2xl font-black text-white text-lg shadow-md uppercase tracking-wider border-b-4 ${
                  selectedOption.isCorrect 
                    ? 'bg-gradient-to-r from-mint to-mint-dark border-mint-dark hover:shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-red-600 border-red-700 hover:shadow-lg'
                }`}
              >
                {selectedOption.isCorrect ? 'Selesaikan Misi! 🏆' : 'Coba Lagi! 🔁'}
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
