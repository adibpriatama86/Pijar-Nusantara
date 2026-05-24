import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useProgressStore } from '../store/useProgressStore';
import { HabitatMap } from '../components/HabitatMap';
import { FlashcardGrid } from '../components/FlashcardGrid';
import { DragDropGame } from '../components/DragDropGame';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../utils/audio';
import { ArrowLeft, CheckCircle2, AlertCircle, Compass, BookOpen, ShieldAlert, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { logInteraction } from '../utils/telemetry';

export const IpasLevelOne: React.FC = () => {
  const navigate = useNavigate();
  const { currentIpasLevel, unlockNextIpasLevel } = useAppStore();
  const { completedItems, completeItem } = useProgressStore();

  const isAlreadyCompleted = currentIpasLevel > 1;

  // Nested exploration view state
  const [explorationView, setExplorationView] = useState<'map' | 'flashcard'>('map');
  const [activeHabitat, setActiveHabitat] = useState<'Hutan Tropis' | 'Sabana' | 'Lautan' | null>(null);

  const [isReplaying, setIsReplaying] = useState(false);

  // Derive counts
  const completedFlashcardsCount = completedItems.filter(
    (id) => !id.endsWith('-game') && id !== 'ipas-conservation'
  ).length;

  const sortedAnimalsCount = completedItems.filter(
    (id) => id.endsWith('-game')
  ).length;

  const effectivelyCompleted = isAlreadyCompleted && !isReplaying;
  const isDietUnlocked = effectivelyCompleted || completedFlashcardsCount >= 3;
  const isConservationUnlocked = effectivelyCompleted || sortedAnimalsCount >= 5;

  // Quiz State (Inline Conservation)
  const [levelComplete, setLevelComplete] = useState(effectivelyCompleted);
  const [wrongAnswerMsg, setWrongAnswerMsg] = useState('');
  const [selectedWrongOption, setSelectedWrongOption] = useState<string | null>(null);

  // Local scroll restoration
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleQuizAnswer = (isCorrect: boolean, optionId: string) => {
    if (isCorrect) {
      playSound('success');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#34D399', '#3B82F6', '#FBBF24']
      });
      setLevelComplete(true);
      completeItem('ipas-conservation', 100);
      unlockNextIpasLevel();
      logInteraction('level_1_complete', { result: 'success' });
      setSelectedWrongOption(null);
    } else {
      playSound('error');
      setSelectedWrongOption(optionId);
      if (optionId === 'A') {
        setWrongAnswerMsg("Aduh, kurang tepat! Orangutan adalah satwa liar dilindungi. Memeliharanya di rumah bertentangan dengan hukum.");
      } else {
        setWrongAnswerMsg("Hmm, kurang tepat! Memindahkan Orangutan ke luar negeri bisa sangat berbahaya karena cuaca dan makanannya berbeda.");
      }
    }
  };

  const handleResetMisi = () => {
    playSound('click');
    setIsReplaying(true);
    setLevelComplete(false);
    setSelectedWrongOption(null);
    setWrongAnswerMsg('');
    useProgressStore.getState().resetProgress();
    // Call the newly added store reset action
    useAppStore.getState().resetSpecificLevel(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/ipas')}
          className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800">Ekspedisi Flora & Fauna 🌴</h1>
          <p className="text-slate-500 font-medium">Misi 1: Jelajahi Kekayaan Makhluk Hidup Nusantara</p>
        </div>
        <button
          onClick={handleResetMisi}
          className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors flex items-center gap-2 font-bold"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="hidden sm:inline">Ulangi Misi</span>
        </button>
      </div>

      <div className="space-y-12">
        {/* Section 1: Eksplorasi */}
        <section className="bg-emerald-50 rounded-3xl p-6 md:p-8 border-4 border-emerald-100 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-200 rounded-xl text-emerald-700">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-900">1. Eksplorasi Flora & Fauna</h2>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={explorationView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {explorationView === 'flashcard' && activeHabitat ? (
                <FlashcardGrid
                  habitatName={activeHabitat}
                  onBack={() => setExplorationView('map')}
                />
              ) : (
                <HabitatMap
                  onSelectHabitat={(habitat) => {
                    setActiveHabitat(habitat);
                    setExplorationView('flashcard');
                  }}
                  onSelectGame={() => {}} // CTA removed
                />
              )}
            </motion.div>
          </AnimatePresence>

          {isDietUnlocked && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Kamu berhasil mempelajari minimal 3 spesies! Lanjut ke misi berikutnya di bawah.
            </motion.div>
          )}
        </section>

        {/* Section 2: Diet Hewan */}
        {isDietUnlocked && (
          <motion.section
            id="section-diet"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 rounded-3xl p-6 md:p-8 border-4 border-amber-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-200 rounded-xl text-amber-700">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-amber-900">2. Game Diet Hewan</h2>
            </div>
            <DragDropGame onBack={() => {}} />

            {isConservationUnlocked && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-amber-100 text-amber-800 rounded-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Kamu berhasil mencocokkan hewan! Lanjut ke misi terakhir di bawah.
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Section 3: Konservasi */}
        {isConservationUnlocked && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 rounded-3xl p-6 md:p-8 border-4 border-emerald-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-200 rounded-xl text-emerald-700">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-900">3. Misi Konservasi Alam</h2>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border-2 border-emerald-100">
              <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                <div className="text-6xl shrink-0">🦧</div>
                <h3 className="text-xl font-bold text-slate-800 leading-relaxed">
                  Hutan hujan tempat tinggal Orangutan sedang ditebang liar secara besar-besaran. Sebagai Sahabat Alam Nusantara, apa tindakan terbaik yang harus kita lakukan?
                </h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleQuizAnswer(false, 'A')}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                    selectedWrongOption === 'A' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                  }`}
                  disabled={levelComplete}
                >
                  Menangkap Orangutan dan membawanya pulang untuk dijadikan hewan peliharaan di rumah agar aman.
                </button>
                <button
                  onClick={() => handleQuizAnswer(true, 'B')}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                    levelComplete 
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800' 
                      : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                  }`}
                  disabled={levelComplete}
                >
                  Mendirikan kawasan Cagar Alam terlindungi, melarang penebangan liar, dan menanam kembali hutan yang gundul.
                </button>
                <button
                  onClick={() => handleQuizAnswer(false, 'C')}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                    selectedWrongOption === 'C' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                  }`}
                  disabled={levelComplete}
                >
                  Memindahkan semua Orangutan ke pulau kosong di benua lain agar mereka jauh dari jangkauan manusia.
                </button>
              </div>

              <AnimatePresence>
                {wrongAnswerMsg && !levelComplete && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-rose-50 text-rose-700 rounded-xl flex items-center gap-3 overflow-hidden"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{wrongAnswerMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* End of Level Actions */}
            {levelComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 text-center p-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl text-white shadow-lg"
              >
                <span className="text-6xl mb-4 block">🏆</span>
                <h3 className="text-3xl font-black mb-2">Level Selesai!</h3>
                <p className="text-emerald-50 font-medium mb-8 text-lg">Kamu telah membuktikan bahwa kamu peduli pada kelestarian alam Indonesia!</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/ipas')}
                    className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 px-8 py-3 rounded-xl font-bold transition-colors shadow-sm text-lg flex items-center justify-center gap-2"
                  >
                    ⬅️ Kembali ke Peta
                  </button>
                  <button
                    onClick={() => navigate('/ipas/level/2')}
                    className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-sm text-lg flex items-center justify-center gap-2"
                  >
                    Misi Selanjutnya ➡️
                  </button>
                </div>
              </motion.div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default IpasLevelOne;
