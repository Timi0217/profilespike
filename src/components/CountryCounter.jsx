import React, { useState, useEffect } from "react";
import { UserProfile } from "@/api/entities";
import { motion } from "framer-motion";

export default function CountryCounter({ className = "" }) {
  const [countryCount, setCountryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCountryCount();
  }, []);

  const loadCountryCount = async () => {
    try {
      const profiles = await UserProfile.list(undefined, undefined, ["country"]);
      const uniqueCountries = new Set(profiles.map(p => p.country).filter(Boolean));
      setCountryCount(uniqueCountries.size);
    } catch (error) {
      console.error("Error loading country count:", error);
      // Fallback to a reasonable number
      setCountryCount(50);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <span className={`inline-block ${className}`}>
        <span className="animate-pulse bg-gray-200 rounded px-2 py-1">...</span>
      </span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${className}`}
    >
      {countryCount}+
    </motion.span>
  );
}