import React, { useState } from 'react';
import type { FloraFaunaItem } from '../data/curriculum';
import { curriculumData } from '../data/curriculum';
import { useProgressStore } from '../store/useProgressStore';
import { DndContext, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { ArrowLeft, RotateCcw, HelpCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

interface DragDropGameProps {
  onBack: () => void;
}

// Draggable Animal Item Component
const DraggableAnimal: React.FC<{ animal: FloraFaunaItem }> = ({ animal }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: animal.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 100 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`touch-none cursor-grab active:cursor-grabbing p-4 rounded-2xl bg-[#FFF9E6] border-4 border-darkslate/15 shadow-md flex flex-col items-center justify-center select-none text-center transition-all ${
        isDragging ? 'opacity-40 scale-95 border-dashed border-sunset' : 'hover:border-sunset-light'
      }`}
    >
      <span className="text-6xl mb-2 filter drop-shadow-sm pointer-events-none">{animal.emoji}</span>
      <span className="font-extrabold text-base md:text-lg text-darkslate-dark leading-tight pointer-events-none">
        {animal.name}
      </span>
      <span className="text-xs font-bold text-darkslate/40 mt-1 pointer-events-none uppercase">Seret Aku! 👆</span>
    </div>
  );
};

// Droppable Bucket Component
interface DroppableBucketProps {
  id: 'Karnivora' | 'Herbivora' | 'Omnivora';
  label: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  matchedAnimals: FloraFaunaItem[];
}

const DroppableBucket: React.FC<DroppableBucketProps> = ({
  id,
  label,
  emoji,
  bgGradient,
  borderColor,
  textColor,
  matchedAnimals,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative min-h-[250px] p-5 rounded-3xl border-4 ${borderColor} ${bgGradient} flex flex-col justify-between shadow-xl transition-all duration-300 ${
        isOver ? 'scale-105 ring-8 ring-mint/30 shadow-2xl' : ''
      }`}
    >
      {/* Bucket Title */}
      <div className="text-center select-none">
        <span className="text-4xl block mb-1">{emoji}</span>
        <h4 className={`text-xl md:text-2xl font-black ${textColor} uppercase tracking-wide leading-none`}>
          {label}
        </h4>
        <span className="text-xs font-black text-darkslate/50 bg-white/50 px-2 py-0.5 rounded-full mt-1 inline-block">
          Zona Makan
        </span>
      </div>

      {/* Dropped / Matched Items */}
      <div className="my-4 flex-grow flex flex-wrap gap-2 items-center justify-center p-3 rounded-2xl bg-white/40 border border-white/50 min-h-[100px]">
        {matchedAnimals.length === 0 ? (
          <div className="text-center text-sm font-extrabold text-darkslate/40 p-2 select-none flex flex-col items-center gap-1">
            <HelpCircle className="w-5 h-5 opacity-60" />
            <span>Jatuhkan hewan pemakan {label.toLowerCase()} di sini!</span>
          </div>
        ) : (
          <AnimatePresence>
            {matchedAnimals.map((animal) => (
              <motion.div
                key={animal.id}
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="flex items-center gap-1.5 bg-white border-2 border-mint text-darkslate px-2.5 py-1.5 rounded-xl shadow-sm text-sm font-bold select-none relative overflow-hidden group"
              >
                <span className="text-xl pointer-events-none">{animal.emoji}</span>
                <span className="leading-tight pointer-events-none">{animal.name}</span>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="w-3.5 h-3.5 absolute -right-0.5 -top-0.5 text-yellow-500 pointer-events-none"
                >
                  ⭐
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer count indicator */}
      <div className="text-right text-xs font-black text-darkslate/50 select-none">
        Total: {matchedAnimals.length} Hewan
      </div>
    </div>
  );
};

export const DragDropGame: React.FC<DragDropGameProps> = ({ onBack }) => {
  const { completeItem, addScore } = useProgressStore();

  // Extract all animal items from curriculumData (total: 6 animals)
  const animals = curriculumData.filter((item) => item.type === 'animal');

  // Track matched states: map animal ID to its dropped category, or keep local arrays
  const [matchedGroups, setMatchedGroups] = useState<Record<string, FloraFaunaItem[]>>({
    Karnivora: [],
    Herbivora: [],
    Omnivora: [],
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  // Derive remaining animals that haven't been matched
  const matchedIds = Object.values(matchedGroups).flatMap((arr) => arr.map((item) => item.id));
  const remainingAnimals = animals.filter((item) => !matchedIds.includes(item.id));

  const isGameFinished = remainingAnimals.length === 0;

  const handleDragStart = (event: DragStartEvent) => {
    playSound('click');
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      playSound('error');
      return;
    }

    const animalId = active.id as string;
    const bucketId = over.id as 'Karnivora' | 'Herbivora' | 'Omnivora';

    const animal = animals.find((item) => item.id === animalId);
    if (!animal) return;

    // Check correctness: animal's diet must match bucketId
    if (animal.diet === bucketId) {
      // Correct!
      setMatchedGroups((prev) => {
        // Prevent duplicates
        if (prev[bucketId].some((item) => item.id === animalId)) return prev;
        return {
          ...prev,
          [bucketId]: [...prev[bucketId], animal],
        };
      });

      // Complete progress & reward points
      const isNew = completeItem(`${animalId}-game`, 25);
      if (isNew) {
        playSound('success');
      } else {
        playSound('click');
      }

      // Check if this was the last animal to be matched
      if (remainingAnimals.length === 1 && !matchedIds.includes(animalId)) {
        // Delay a tiny bit for the final success sound of the game completion
        setTimeout(() => {
          playSound('levelUp');
          addScore(50); // Final bonus
        }, 300);
      }
    } else {
      // Incorrect! Trigger error sound (snaps back automatically in dnd-kit since we don't update state)
      playSound('error');
    }
  };

  const handleResetGame = () => {
    playSound('click');
    setMatchedGroups({
      Karnivora: [],
      Herbivora: [],
      Omnivora: [],
    });
  };

  const activeAnimal = animals.find((a) => a.id === activeId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Controls */}
      <div className="text-center mb-8 select-none">
        <h3 className="text-2xl md:text-3xl font-black text-darkslate-dark uppercase tracking-wide">
          🎮 Seret &amp; Cocokkan Diet Hewan
        </h3>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Game Layout */}
        <div className="flex flex-col gap-8">
          {/* Instructions */}
          <div className="text-center select-none bg-white/40 border-2 border-darkslate/5 rounded-3xl p-6 shadow-sm">
            <h4 className="text-xl md:text-2xl font-extrabold text-darkslate-dark mb-1">
              🥗 Kelompokkan Hewan Berdasarkan Makanannya!
            </h4>
            <p className="text-darkslate/75 text-base font-semibold max-w-xl mx-auto">
              Seret kartu hewan ke keranjang diet yang tepat. Dapatkan <span className="text-sunset font-extrabold">+25 ⭐</span> untuk setiap pencocokan benar, dan <span className="text-mint-dark font-extrabold">+50 ⭐</span> bonus kelulusan!
            </p>
          </div>

          {/* Draggable Cards Area */}
          <div className="bg-[#FFF9E6]/60 border-4 border-dashed border-darkslate/10 p-6 rounded-3xl min-h-[160px] flex items-center justify-center shadow-inner">
            {isGameFinished ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-6 max-w-md select-none"
              >
                <div className="text-6xl mb-3 animate-bounce">🏆</div>
                <h4 className="text-2xl font-black text-emerald-800 mb-1">Selamat! Kamu Lulus Ujian Diet!</h4>
                <p className="text-darkslate/80 font-bold mb-4">
                  Semua hewan berhasil dikelompokkan dengan benar ke zona makannya. Kamu mendapatkan bonus +50 ⭐ bintang!
                </p>
                <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-darkslate-dark px-4 py-2 rounded-2xl font-black shadow-md border-b-4 border-yellow-600">
                  <Star className="w-5 h-5 fill-current" />
                  <span>Selesai Sempurna!</span>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 w-full">
                <AnimatePresence>
                  {remainingAnimals.map((animal) => (
                    <motion.div
                      key={animal.id}
                      layoutId={animal.id}
                      exit={{ scale: 0.3, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <DraggableAnimal animal={animal} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Droppable Zones Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <DroppableBucket
              id="Karnivora"
              label="Karnivora"
              emoji="🥩"
              bgGradient="bg-gradient-to-b from-red-50 to-red-100/80"
              borderColor="border-red-300"
              textColor="text-red-700"
              matchedAnimals={matchedGroups.Karnivora}
            />
            <DroppableBucket
              id="Herbivora"
              label="Herbivora"
              emoji="🌿"
              bgGradient="bg-gradient-to-b from-green-50 to-green-100/80"
              borderColor="border-green-300"
              textColor="text-green-700"
              matchedAnimals={matchedGroups.Herbivora}
            />
            <DroppableBucket
              id="Omnivora"
              label="Omnivora"
              emoji="🍇"
              bgGradient="bg-gradient-to-b from-purple-50 to-purple-100/80"
              borderColor="border-purple-300"
              textColor="text-purple-700"
              matchedAnimals={matchedGroups.Omnivora}
            />
          </div>
        </div>

        {/* Drag Overlay (Displays a clean copy of card during drag) */}
        <DragOverlay>
          {activeId && activeAnimal ? (
            <div className="p-4 rounded-2xl bg-[#FFF9E6] border-4 border-sunset shadow-2xl flex flex-col items-center justify-center select-none text-center scale-105 rotate-2">
              <span className="text-6xl mb-2 pointer-events-none">{activeAnimal.emoji}</span>
              <span className="font-extrabold text-base md:text-lg text-darkslate-dark leading-tight pointer-events-none">
                {activeAnimal.name}
              </span>
              <span className="text-xs font-bold text-sunset mt-1 pointer-events-none uppercase">Menjatuhkan... 🪂</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
