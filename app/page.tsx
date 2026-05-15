'use client';

import { useState, useCallback, useEffect } from 'react';
import { Desktop } from '@/components/desktop/Desktop';
import { BootScreen } from '@/components/boot/BootScreen';

export default function Home() {
  const [booted, setBooted] = useState(true);

  useEffect(() => {
    const already = sessionStorage.getItem('booted');
    if (!already) setBooted(false);
  }, []);

  const handleBootDone = useCallback(() => {
    sessionStorage.setItem('booted', '1');
    setBooted(true);
  }, []);

  return (
    <>
      {!booted && <BootScreen onDone={handleBootDone} />}
      <Desktop />
    </>
  );
}
