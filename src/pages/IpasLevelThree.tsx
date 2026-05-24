import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, Zap, Sun, RotateCcw, Music, Flashlight, Wind, Flame, Fan, Lightbulb, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';
import { logInteraction } from '../utils/telemetry';
import { useAppStore } from '../store/useAppStore';
import { energiEksplorasiData, energiMesinData, energiTransformasiData, type EnergiTransformasi } from '../data/energi';
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core';

// Icon mapping dictionary
const IconMap: Record<string, React.FC<any>> = {
  Music, Flashlight, Wind, Flame, Sun, Fan, Lightbulb, Zap, Sparkles
};

// Draggable Output Energy Label
const DraggableLabel: React.FC<{ item: EnergiTransformasi; isMatched: boolean }> = ({ item, isMatched }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: isMatched,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
  } : undefined;

  if (isMatched) return null;

  const IconComponent = IconMap[item.icon] || Zap;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`touch-none p-4 rounded-xl border-4 flex items-center gap-3 select-none bg-white font-bold text-lg cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-2xl border-amber-400 opacity-80 scale-105' : 'shadow-sm border-slate-200 hover:border-amber-300'
      }`}
    >
      <IconComponent className="w-8 h-8 text-amber-500" />
      <span className="text-slate-700">{item.label}</span>
    </div>
  );
};

// Droppable Machine Container
const DroppableMachine: React.FC<{ machineId: string; name: string; icon: string; matchedItem?: EnergiTransformasi }> = ({ machineId, name, icon, matchedItem }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: machineId,
    disabled: !!matchedItem,
  });

  const IconComponent = IconMap[icon] || Sun;
  const MatchedIcon = matchedItem ? (IconMap[matchedItem.icon] || Zap) : null;

  return (
    <div
      ref={setNodeRef}
      className={`relative min-h-[240px] p-6 rounded-3xl border-4 flex flex-col items-center justify-center transition-all ${
        matchedItem
          ? 'bg-emerald-50 border-emerald-300'
          : isOver
          ? 'bg-amber-50 border-amber-400 ring-4 ring-amber-200'
          : 'bg-white border-slate-200 border-dashed'
      }`}
    >
      <div className="mb-4">
        <IconComponent className={`w-16 h-16 ${matchedItem ? 'text-emerald-500' : 'text-slate-400'}`} />
      </div>
      <h3 className="text-xl font-black text-slate-700 mb-6">{name}</h3>

      {/* Match Slot */}
      <div className={`w-full max-w-[200px] h-16 rounded-xl flex items-center justify-center border-2 ${
        matchedItem ? 'bg-emerald-100 border-emerald-400' : 'bg-slate-50 border-slate-200 border-dashed'
      }`}>
        {matchedItem && MatchedIcon ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 font-bold text-emerald-800 text-lg">
            <MatchedIcon className="w-6 h-6" />
            <span>{matchedItem.label}</span>
          </motion.div>
        ) : (
          <span className="text-slate-400 font-medium text-sm">Jatuhkan hasil energi...</span>
        )}
      </div>
    </div>
  );
};

export const IpasLevelThree: React.FC = () => {
  const navigate = useNavigate();
  const currentIpasLevel = useAppStore(state => state.currentIpasLevel);
  const unlockNextIpasLevel = useAppStore(state => state.unlockNextIpasLevel);
  const updateMissionProgress = useAppStore(state => state.updateMissionProgress);
  const addScore = useAppStore(state => state.addScore);
  const missionProgress = useAppStore(state => state.missionProgress);
  
  const [isReplaying, setIsReplaying] = useState(false);
  const effectivelyCompleted = (missionProgress[3] === 100) && !isReplaying;

  // Section 1 State
  const [flippedCards, setFlippedCards] = useState<string[]>(
    effectivelyCompleted ? energiEksplorasiData.map(s => s.id) : []
  );
  const section1Complete = flippedCards.length === energiEksplorasiData.length;

  // Section 2 State
  const [matches, setMatches] = useState<Record<string, string>>(
    effectivelyCompleted ? energiTransformasiData.reduce((acc, item) => ({ ...acc, [item.id]: item.machineId }), {}) : {}
  );
  const section2Complete = Object.keys(matches).length === energiTransformasiData.length;

  // Section 3 State
  const [levelComplete, setLevelComplete] = useState(effectivelyCompleted);
  const [wrongAnswerMsg, setWrongAnswerMsg] = useState('');
  const [selectedWrongOption, setSelectedWrongOption] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCardClick = (id: string) => {
    if (!flippedCards.includes(id)) {
      playSound('click');
      const newFlipped = [...flippedCards, id];
      setFlippedCards(newFlipped);
      
      // Update progress partially
      const progress = Math.floor((newFlipped.length / energiEksplorasiData.length) * 33);
      if (progress > (missionProgress[3] || 0) && !effectivelyCompleted) {
        updateMissionProgress(3, progress);
      }
      
      if (newFlipped.length === energiEksplorasiData.length) {
        playSound('success');
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      playSound('error');
      return;
    }

    const draggedItemId = active.id as string;
    const targetMachineId = over.id as string;
    
    const transformationItem = energiTransformasiData.find(item => item.id === draggedItemId);

    if (transformationItem && transformationItem.machineId === targetMachineId) {
      playSound('success');
      setMatches(prev => {
        const next = { ...prev, [draggedItemId]: targetMachineId };
        
        // Update progress partially
        const matchCount = Object.keys(next).length;
        const progress = 33 + Math.floor((matchCount / energiTransformasiData.length) * 33);
        if (progress > (missionProgress[3] || 0) && !effectivelyCompleted) {
          updateMissionProgress(3, progress);
        }

        if (matchCount === energiTransformasiData.length) {
          setTimeout(() => playSound('levelUp'), 300);
        }
        return next;
      });
    } else {
      playSound('error');
    }
  };

  const handleQuizAnswer = (isCorrect: boolean, optionIndex: number) => {
    if (isCorrect) {
      playSound('success');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#F59E0B', '#D97706']
      });
      setLevelComplete(true);
      
      // Fully unlock and update progress
      if (currentIpasLevel === 3) {
        unlockNextIpasLevel();
      }
      updateMissionProgress(3, 100);
      addScore(300);
      logInteraction('level_3_complete', { result: 'success' });
      setSelectedWrongOption(null);
    } else {
      playSound('error');
      setSelectedWrongOption(optionIndex);
      setWrongAnswerMsg("Coba pikirkan lagi! Jika desa panas dan selalu disinari matahari, sumber energi apa yang paling melimpah dan gratis?");
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
    useAppStore.getState().resetSpecificLevel(3);
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
          <h1 className="text-3xl md:text-4xl font-black text-slate-800">Energi Tersembunyi ⚡</h1>
          <p className="text-slate-500 font-medium">Misi 3: Temukan keajaiban perubahan energi di sekitarmu</p>
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
        <section className="bg-amber-50 rounded-3xl p-6 md:p-8 border-4 border-amber-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-200 rounded-xl text-amber-700">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-amber-900">1. Detektif Energi</h2>
          </div>
          
          <p className="text-amber-800 font-medium mb-6">
            Klik benda-benda di bawah ini untuk melihat energi apa yang tersembunyi di dalamnya!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {energiEksplorasiData.map((item) => {
              const isFlipped = flippedCards.includes(item.id);
              const IconComponent = IconMap[item.icon] || Zap;
              
              return (
                <div 
                  key={item.id} 
                  className="perspective-1000 w-full min-h-[260px] cursor-pointer"
                  onClick={() => handleCardClick(item.id)}
                >
                  <motion.div
                    className="relative w-full h-full preserve-3d"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                  >
                    {/* Front Face */}
                    <div 
                      className={`absolute inset-0 backface-hidden flex flex-col justify-center items-center p-6 rounded-3xl border-4 shadow-sm bg-gradient-to-br text-white ${item.bgGradient} border-transparent`}
                    >
                      <IconComponent className="w-20 h-20 mb-4 drop-shadow-md" />
                      <span className="font-black text-2xl tracking-wide text-center">{item.name}</span>
                      <span className="mt-4 text-sm font-bold bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm">Klik untuk intip!</span>
                    </div>

                    {/* Back Face */}
                    <div 
                      className="absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center p-6 rounded-3xl border-4 bg-white border-amber-300 shadow-md"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <IconComponent className="w-12 h-12 mb-3 text-amber-600" />
                      <h4 className="font-black text-amber-700 text-xl mb-3">{item.energyType}</h4>
                      <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {section1Complete && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Kamu berhasil menemukan semua energi tersembunyi!
            </motion.div>
          )}
        </section>

        {/* Section 2: Transformasi Energi */}
        {section1Complete && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-50 rounded-3xl p-6 md:p-8 border-4 border-indigo-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-200 rounded-xl text-indigo-700">
                <Sun className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-indigo-900">2. Pabrik Perubahan Energi</h2>
            </div>
            
            <p className="text-indigo-800 font-medium mb-8">
              Mesin ajaib membutuhkan energi yang tepat untuk bekerja. Tarik jenis energi di bawah dan letakkan di mesin yang sesuai!
            </p>

            <DndContext onDragEnd={handleDragEnd}>
              {/* Draggables */}
              {!section2Complete && (
                <div className="flex flex-wrap gap-4 mb-10 justify-center">
                  {energiTransformasiData.map(item => (
                    <DraggableLabel key={item.id} item={item} isMatched={!!matches[item.id]} />
                  ))}
                </div>
              )}

              {/* Droppables */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {energiMesinData.map(machine => {
                  const matchedItemId = Object.keys(matches).find(key => matches[key] === machine.id);
                  const matchedItem = matchedItemId ? energiTransformasiData.find(item => item.id === matchedItemId) : undefined;
                  
                  return (
                    <DroppableMachine 
                      key={machine.id}
                      machineId={machine.id}
                      name={machine.name}
                      icon={machine.icon}
                      matchedItem={matchedItem}
                    />
                  );
                })}
              </div>
            </DndContext>

            {section2Complete && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Luar biasa! Semua mesin berhasil menyala!
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Section 3: Konservasi (Quiz) */}
        {section2Complete && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 rounded-3xl p-6 md:p-8 border-4 border-emerald-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-200 rounded-xl text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-900">3. Pahlawan Hemat Energi</h2>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border-2 border-emerald-100">
              <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                <div className="bg-yellow-100 p-4 rounded-2xl shrink-0 text-yellow-600">
                  <Lightbulb className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 leading-relaxed">
                  Desa Nusantara sering mati lampu karena kekurangan batu bara, padahal desa ini sangat panas dan disinari matahari sepanjang tahun. Solusi energi apa yang paling tepat untuk membantu desa ini?
                </h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleQuizAnswer(false, 0)}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                    selectedWrongOption === 0 ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                  }`}
                  disabled={levelComplete}
                >
                  Membeli lebih banyak batu bara agar lampu terus menyala tanpa peduli polusi udara.
                </button>
                <button
                  onClick={() => handleQuizAnswer(true, 1)}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                    levelComplete ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                  }`}
                  disabled={levelComplete}
                >
                  Membangun Pembangkit Listrik Tenaga Surya (Panel Surya) yang ramah lingkungan.
                </button>
                <button
                  onClick={() => handleQuizAnswer(false, 2)}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                    selectedWrongOption === 2 ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                  }`}
                  disabled={levelComplete}
                >
                  Menyalakan lilin siang dan malam untuk menerangi seluruh desa.
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
                className="mt-8 text-center p-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl text-white shadow-lg relative overflow-hidden"
              >
                <Sun className="absolute -top-10 -right-10 w-48 h-48 text-white opacity-20" />
                <h3 className="text-3xl font-black mb-2 relative z-10">Level Selesai! 🏆</h3>
                <p className="text-emerald-50 font-medium mb-6 text-lg relative z-10">Kamu telah memahami keajaiban energi dan peduli pada solusi masa depan yang ramah lingkungan!</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <button
                    onClick={() => navigate('/ipas')}
                    className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 px-8 py-3 rounded-xl font-bold transition-colors shadow-sm text-lg flex items-center justify-center gap-2"
                  >
                    ⬅️ Kembali ke Peta
                  </button>
                  <button
                    onClick={() => navigate('/ipas/level/4')}
                    className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-sm text-lg flex items-center justify-center gap-2"
                  >
                    Lanjut ke Misi 4 ➡️
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

export default IpasLevelThree;
