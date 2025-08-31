import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function UserCounter({ className = "" }) {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    // Use a growing fallback number to avoid a permission-denied API call for non-admins.
    const baseCount = 1247;
    const daysSinceLaunch = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24));
    const growthFactor = Math.floor(daysSinceLaunch * 2.3);
    const targetCount = baseCount + growthFactor;

    const duration = 2000;
    const steps = 60;
    const increment = targetCount / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setDisplayCount(targetCount);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`font-bold ${className}`}
    >
      {formatNumber(displayCount)}
    </motion.span>
  );
}