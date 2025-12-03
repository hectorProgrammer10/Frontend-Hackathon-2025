'use client';

import { useState, useEffect } from 'react';
import MonsterLoader from './MonsterLoader';

export default function AppSplash() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide after 1 second
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return <MonsterLoader isLoading={showSplash} />;
}
