"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InfoBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-sand-100 dark:bg-sand-800 text-sand-800 dark:text-sand-100"
        >
          <div className="container mx-auto px-4 py-2 flex justify-center items-center">
            <p className="text-sm font-medium text-center">
              🚧 This is a demo application and is currently under construction 🚧
            </p>
            <button
              onClick={() => setIsVisible(false)}
              className="text-sand-600 hover:text-sand-800 dark:text-sand-300 dark:hover:text-sand-100 transition-colors ml-4"
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
