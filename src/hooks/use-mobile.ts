"use client";

import { useState, useEffect } from 'react';

export const useIsMobile = (maxWidth = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < maxWidth);
    };

    // Initial check
    checkDevice();

    // Add resize listener
    window.addEventListener('resize', checkDevice);

    // Cleanup listener
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, [maxWidth]);

  return isMobile;
};
