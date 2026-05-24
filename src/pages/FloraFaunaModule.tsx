import React, { useState } from 'react';
import { HabitatMap } from '../components/HabitatMap';
import { FlashcardGrid } from '../components/FlashcardGrid';
import { DragDropGame } from '../components/DragDropGame';
import { AnimatePresence, motion } from 'framer-motion';

export const FloraFaunaModule: React.FC = () => {
  const [currentView, setCurrentView] = useState<'hub' | 'habitat' | 'game'>('hub');
  const [activeHabitat, setActiveHabitat] = useState<'Hutan Tropis' | 'Sabana' | 'Lautan' | null>(null);

  const handleSelectHabitat = (habitat: 'Hutan Tropis' | 'Sabana' | 'Lautan') => {
    setActiveHabitat(habitat);
    setCurrentView('habitat');
  };

  const handleSelectGame = () => {
    setCurrentView('game');
  };

  const handleBackToHub = () => {
    setCurrentView('hub');
    setActiveHabitat(null);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 14 } },
    exit: { opacity: 0, y: -20, transition: { ease: "easeInOut" as const, duration: 0.2 } },
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === 'hub' && (
        <motion.div
          key="ff-hub"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <HabitatMap 
            onSelectHabitat={handleSelectHabitat} 
            onSelectGame={handleSelectGame} 
          />
        </motion.div>
      )}

      {currentView === 'habitat' && activeHabitat && (
        <motion.div
          key="ff-habitat"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <FlashcardGrid 
            habitatName={activeHabitat} 
            onBack={handleBackToHub} 
          />
        </motion.div>
      )}

      {currentView === 'game' && (
        <motion.div
          key="ff-game"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <DragDropGame onBack={handleBackToHub} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
