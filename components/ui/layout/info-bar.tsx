"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InfoBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#FEEBC8] dark:bg-[#4B5563] border border-[#FBCF8D] dark:border-[#4A4A4A]"
        >
          <div className="container mx-auto px-4 py-3 flex justify-center items-center">
            <p className="text-sm font-medium text-center text-[#4A4A4A] dark:text-[#D1FAE5]">
              🚧 This is a demo application and is currently under construction 🚧
            </p>
            <button
              onClick={() => setIsVisible(false)}
              className="text-[#D0BFB4] hover:text-[#B69B2D] dark:text-[#D1FAE5] dark:hover:text-[#A1E3D8] transition-colors ml-4"
              aria-label="Close info bar"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
