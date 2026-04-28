import React, { useState, useEffect } from 'react';
import { Link, useLocation, useOutlet } from 'react-router-dom';
import { Car, Search, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Layout() {
  const [compareCount, setCompareCount] = useState(0);
  const location = useLocation();
  const element = useOutlet();

  // Sync with localStorage manually since we aren't using a global state provider like Redux
  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem('compareIds');
      if (stored) {
        setCompareCount(JSON.parse(stored).length);
      } else {
        setCompareCount(0);
      }
    };
    
    updateCount();
    window.addEventListener('compareUpdated', updateCount);
    return () => window.removeEventListener('compareUpdated', updateCount);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* ... keeping the rest the same ... */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2 group active:scale-95 transition-transform">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Car size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">AutoTrade</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/browse" className="text-sm font-medium text-gray-600 hover:text-blue-600 active:scale-95 transition flex items-center gap-1.5">
              <Search size={16} />
              Browse Cars
            </Link>
            <Link to="/compare" className="text-sm font-medium text-gray-600 hover:text-blue-600 active:scale-95 transition flex items-center gap-1.5 relative">
              <ArrowRightLeft size={16} />
              Compare
              {compareCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {compareCount}
                </span>
              )}
            </Link>
            <Link to="/sell" className="text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all px-4 py-2 rounded-lg shadow-sm">
              Sell a Car
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full"
          >
            {element}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AutoTrade. University Project Demo.</p>
        </div>
      </footer>
    </div>
  );
}
