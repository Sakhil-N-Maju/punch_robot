import { useEffect, useRef } from 'react';

/**
 * useKioskScale — scales the fixed 1080x1920 kiosk frame to fit whatever
 * screen it's mounted on (the mounted touchscreen, a browser window while
 * developing, etc.) while preserving the design's exact pixel proportions.
 */
export function useKioskScale() {
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const fit = () => {
      const scale = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
      frame.style.transform = `scale(${scale})`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return frameRef;
}
