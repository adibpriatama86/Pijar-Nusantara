import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { WelcomeModal } from './components/WelcomeModal';
import { ScrollToTop } from './components/ScrollToTop';
import { Dashboard } from './pages/Dashboard';
import { IpasHub } from './pages/IpasHub';
import { IpasLevelOne } from './pages/IpasLevelOne';
import { IpasLevelTwo } from './pages/IpasLevelTwo';
import { IpasLevelThree } from './pages/IpasLevelThree';
import { curriculumData } from './data/curriculum';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  // Total completable items is 9 reading flashcards + 6 animal drag-n-drop games = 15 total items
  const totalItems = curriculumData.length + curriculumData.filter((i) => i.type === 'animal').length;

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        {/* Onboarding Welcome Modal */}
        <WelcomeModal />

        {/* Global Progress Header */}
        <Header totalItems={totalItems} />

        {/* Dynamic Route Container */}
        <main className="flex-grow pb-12">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Route: Home / Dashboard */}
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Dashboard />
                  </motion.div>
                }
              />

              {/* Route: IPAS Level Selection Hub */}
              <Route
                path="/ipas"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <IpasHub />
                  </motion.div>
                }
              />

              {/* Route: IPAS Level 1 */}
              <Route
                path="/ipas/level/1"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <IpasLevelOne />
                  </motion.div>
                }
              />

              {/* Route: IPAS Level 2 */}
              <Route
                path="/ipas/level/2"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <IpasLevelTwo />
                  </motion.div>
                }
              />

              {/* Route: IPAS Level 3 */}
              <Route
                path="/ipas/level/3"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <IpasLevelThree />
                  </motion.div>
                }
              />

              {/* Catch-all redirect to Home */}
              <Route
                path="*"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Dashboard />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Kid-friendly Footer */}
        <footer className="py-6 text-center text-sm font-bold text-darkslate/50 border-t border-darkslate/5 bg-[#FFF9E6]/50 select-none">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Kelas 3-4 SD - Kurikulum Merdeka</span>
            <span>Dibuat dengan 💚 untuk Anak Indonesia</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
