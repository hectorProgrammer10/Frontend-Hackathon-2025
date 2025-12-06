'use client';

import { useState, useEffect } from 'react';
import MonsterLoader from './MonsterLoader';

export default function AppSplash() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return <MonsterLoader isLoading={showSplash} />;
}
