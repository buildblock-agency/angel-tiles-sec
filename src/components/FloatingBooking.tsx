'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import ShowroomBooking from './ShowroomBooking';
import { usePathname } from 'next/navigation';

export default function FloatingBooking() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide the floating button on the visualizer page to avoid cluttering the workspace
  if (pathname === '/visualize') return null;

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-garnet-500 to-garnet-600 hover:from-garnet-600 hover:to-garnet-700 text-silver-50 font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-garnet-900/40 transition-all border border-garnet-400/30 backdrop-blur-md"
          data-cursor="book"
        >
          <Calendar className="w-4 h-4" />
          <span>Book a Slab Viewing</span>
        </motion.button>
      </div>

      {/* Mobile Floating Button */}
      <div className="fixed bottom-6 left-4 z-40 md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-gradient-to-r from-garnet-500 to-garnet-600 text-silver-50 rounded-full shadow-lg shadow-garnet-900/40 flex items-center justify-center active:scale-95 transition-transform border border-garnet-400/30"
          aria-label="Book a Slab Viewing"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      <ShowroomBooking isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

