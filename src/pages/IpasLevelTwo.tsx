import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, BookOpen, Puzzle, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';
import { logInteraction } from '../utils/telemetry';
import { useAppStore } from '../store/useAppStore';
import { siklusAirData, dropZones, type SiklusAirStage } from '../data/siklusAir';
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core';

// Draggable Component
const DraggableTerm = ({ stage, isMatched }: { stage: SiklusAirStage, isMatched: boolean }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: stage.id,
    disabled: isMatched
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  if (isMatched) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white border-2 border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 cursor-grab active:cursor-grabbing z-50 relative`}
    >
      <span className="text-xl">{stage.emoji}</span>
      <span className="font-bold text-slate-800">{stage.name}</span>
    </div>
  );
};

// Droppable Component
const DroppableZone = ({ id, label, hint, positionClasses, isMatched, matchedStage }: { id: string, label: string, hint: string, positionClasses: string, isMatched: boolean, matchedStage?: SiklusAirStage }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`absolute ${positionClasses} w-36 h-28 rounded-2xl border-4 flex flex-col items-center justify-center p-2 transition-colors ${
        isMatched 
          ? 'bg-white/90 border-emerald-400 shadow-lg' 
          : isOver 
            ? 'bg-white/80 border-amber-400 border-dashed scale-105' 
            : 'bg-white/60 border-white/80 border-dashed'
      }`}
    >
      {isMatched && matchedStage ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center text-center">
          <span className="text-3xl mb-1">{matchedStage.emoji}</span>
          <span className="font-black text-sm text-emerald-700 leading-tight">{matchedStage.name}</span>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center text-center opacity-70">
          <span className="text-slate-800 font-bold text-sm mb-1">{label}</span>
          <span className="text-slate-600 font-semibold text-[10px] leading-tight">{hint}</span>
        </div>
      )}
    </div>
  );
};

export const IpasLevelTwo: React.FC = () => {
  const navigate = useNavigate();
  const currentIpasLevel = useAppStore(state => state.currentIpasLevel);
  const addScore = useAppStore(state => state.addScore);
  const [isReplaying, setIsReplaying] = useState(false);
  const isAlreadyCompleted = currentIpasLevel > 2;
  const effectivelyCompleted = isAlreadyCompleted && !isReplaying;

  // Section 1 State
  const [flippedCards, setFlippedCards] = useState<string[]>(
    effectivelyCompleted ? siklusAirData.map(s => s.id) : []
  );
  const section1Complete = flippedCards.length === siklusAirData.length;

  // Section 2 State
  const [matches, setMatches] = useState<Record<string, string>>(
    effectivelyCompleted ? dropZones.reduce((acc, zone) => {
      const stage = siklusAirData.find(s => s.dropZoneId === zone.id);
      return stage ? { ...acc, [stage.id]: zone.id } : acc;
    }, {}) : {}
  );
  const section2Complete = Object.keys(matches).length === siklusAirData.length;

  // Section 3 State
  const [levelComplete, setLevelComplete] = useState(effectivelyCompleted);
  const [wrongAnswerMsg, setWrongAnswerMsg] = useState('');
  const [selectedWrongOption, setSelectedWrongOption] = useState<number | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCardClick = (id: string) => {
    playSound('flip');
    if (!flippedCards.includes(id)) {
      setFlippedCards(prev => [...prev, id]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active) {
      const draggedStage = siklusAirData.find(s => s.id === active.id);
      if (draggedStage && draggedStage.dropZoneId === over.id) {
        playSound('success');
        setMatches(prev => ({ ...prev, [active.id as string]: over.id as string }));
        addScore(50);
      } else {
        playSound('error');
      }
    }
  };

  const handleQuizAnswer = (isCorrect: boolean, optionIndex: number) => {
    if (isCorrect) {
      playSound('success');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#34D399', '#3B82F6', '#FBBF24']
      });
      setLevelComplete(true);
      addScore(200);
      logInteraction('level_2_complete', { result: 'success' });
      setSelectedWrongOption(null);
    } else {
      playSound('error');
      setSelectedWrongOption(optionIndex);
      setWrongAnswerMsg("Coba pikirkan lagi! Jika pohon tidak ada, apakah air bisa diserap oleh akar?");
    }
  };

  const handleResetMisi = () => {
    playSound('click');
    setIsReplaying(true);
    setFlippedCards([]);
    setMatches({});
    setLevelComplete(false);
    setSelectedWrongOption(null);
    setWrongAnswerMsg('');
    useAppStore.getState().resetSpecificLevel(2);
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
          <h1 className="text-3xl md:text-4xl font-black text-slate-800">Misteri Siklus Air 💧</h1>
          <p className="text-slate-500 font-medium">Misi 2: Pahami Perjalanan Tetesan Air</p>
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
        {/* Section 1: Eksplorasi Siklus */}
        <section className="bg-sky-50 rounded-3xl p-6 md:p-8 border-4 border-sky-100 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-sky-200 rounded-xl text-sky-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-sky-900">1. Eksplorasi Siklus</h2>
          </div>
          <p className="text-sky-800 mb-6 font-medium">Klik semua kartu di bawah ini untuk mempelajari 4 tahap penting dalam siklus air!</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {siklusAirData.map((stage) => {
              const isFlipped = flippedCards.includes(stage.id);
              return (
                <motion.div
                  key={stage.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCardClick(stage.id)}
                  className={`cursor-pointer rounded-2xl p-6 border-4 shadow-sm transition-all h-48 flex flex-col justify-center relative overflow-hidden ${isFlipped ? 'bg-white border-sky-300' : 'bg-gradient-to-br border-transparent text-white ' + stage.bgGradient}`}
                >
                  <div className="absolute top-4 right-4 text-6xl opacity-20">{stage.emoji}</div>
                  {!isFlipped ? (
                    <div className="flex flex-col items-center gap-3 relative z-10 text-center">
                      <span className="text-5xl">{stage.emoji}</span>
                      <h3 className="text-2xl font-black">{stage.name}</h3>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
                      <h3 className={`text-xl font-bold mb-2 ${stage.accentColor}`}>{stage.name}</h3>
                      <p className="text-slate-600 text-sm font-medium">{stage.description}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {section1Complete && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Kamu berhasil mempelajari semua tahap! Lanjut ke misi berikutnya.
            </motion.div>
          )}
        </section>

        {/* Section 2: Puzzle Seret & Cocokkan */}
        {section1Complete && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 rounded-3xl p-6 md:p-8 border-4 border-amber-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-200 rounded-xl text-amber-700">
                <Puzzle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-amber-900">2. Puzzle Seret & Cocokkan</h2>
            </div>
            <p className="text-amber-800 mb-6 font-medium">Bantu air melengkapi perjalanannya! Seret istilah yang tepat ke dalam kotak di gambar.</p>

            <DndContext onDragEnd={handleDragEnd}>
              {/* Terms to drag */}
              <div className="flex flex-wrap gap-3 mb-8 justify-center">
                {siklusAirData.map(stage => (
                  <DraggableTerm key={stage.id} stage={stage} isMatched={!!matches[stage.id]} />
                ))}
              </div>

              {/* Diagram Area */}
              <div className="relative w-full min-h-[60vh] md:min-h-[500px] bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 rounded-3xl border-4 border-slate-200 overflow-hidden shadow-inner">
                {/* Visual Elements (Sky, Sun, Mountain, Sea) */}
                <div className="absolute top-4 left-10 text-8xl opacity-80 animate-pulse">☀️</div>
                <div className="absolute top-10 right-20 text-7xl opacity-90">☁️</div>
                <div className="absolute top-8 left-1/3 text-6xl opacity-70">☁️</div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-emerald-600 rounded-tl-[100px] opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-2/3 h-1/3 bg-blue-500 opacity-80 rounded-tr-[80px]"></div>

                {/* Drop Zones */}
                {dropZones.map(zone => {
                  const matchedStageId = Object.keys(matches).find(k => matches[k] === zone.id);
                  const matchedStage = matchedStageId ? siklusAirData.find(s => s.id === matchedStageId) : undefined;
                  return (
                    <DroppableZone 
                      key={zone.id}
                      id={zone.id} 
                      label={zone.label} 
                      hint={zone.hint}
                      positionClasses={zone.positionClasses}
                      isMatched={!!matchedStage} 
                      matchedStage={matchedStage} 
                    />
                  );
                })}
              </div>
            </DndContext>

            {section2Complete && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Wow! Diagram siklus airmu sudah lengkap!
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Section 3: Misi Konservasi Advanced */}
        {section2Complete && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 rounded-3xl p-6 md:p-8 border-4 border-emerald-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-200 rounded-xl text-emerald-700">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-900">3. Misi Konservasi</h2>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border-2 border-emerald-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
                Pohon di hutan banyak ditebang menjadi gundul. Saat hujan deras turun, apa yang akan terjadi pada siklus air?
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleQuizAnswer(false, 0)}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                    selectedWrongOption === 0 ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                  }`}
                  disabled={levelComplete}
                >
                  Hujan akan berhenti turun selamanya.
                </button>
                <button
                  onClick={() => handleQuizAnswer(true, 1)}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                    levelComplete ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                  }`}
                  disabled={levelComplete}
                >
                  Air hujan tidak bisa meresap ke tanah (Infiltrasi gagal) dan menyebabkan banjir bandang.
                </button>
                <button
                  onClick={() => handleQuizAnswer(false, 2)}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                    selectedWrongOption === 2 ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                  }`}
                  disabled={levelComplete}
                >
                  Air hujan akan langsung menguap kembali menjadi awan.
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

            {levelComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl text-white shadow-lg"
              >
                <span className="text-6xl mb-4 block">🏆</span>
                <h3 className="text-3xl font-black mb-2">Level Selesai!</h3>
                <p className="text-emerald-50 font-medium mb-6 text-lg">Kamu telah berhasil memahami siklus air dan pentingnya menjaga pohon!</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/ipas')}
                    className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 px-8 py-3 rounded-xl font-bold transition-colors shadow-sm text-lg flex items-center justify-center gap-2"
                  >
                    ⬅️ Kembali ke Peta
                  </button>
                  <button
                    onClick={() => navigate('/ipas/level/3')}
                    className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-sm text-lg flex items-center justify-center gap-2"
                  >
                    Lanjut ke Misi 3 ➡️
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

export default IpasLevelTwo;
