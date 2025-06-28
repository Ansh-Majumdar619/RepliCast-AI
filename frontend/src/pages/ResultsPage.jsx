/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import FormatCard from '../components/FormatCard';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function ResultsPage() {
  const { state: result } = useLocation();
  const containerRef = useRef(null);

  // Animate on load
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black text-[#dfcea9] px-4 py-20 flex items-center justify-center"
    >
      {result ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl"
        >
          <FormatCard data={result} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[#dfcea9]/60 text-lg"
        >
          🚫 No generated content available.
        </motion.div>
      )}
    </div>
  );
}
