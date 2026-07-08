import { useEffect, useState } from 'react';

// URL flags, read once at module load:
//   ?lowPower=true  — force the cheap Atmosphere fallback (for A/B testing on
//                     the Pi, or to pin it permanently via the kiosk launch URL)
//   ?lowPower=false — pin the full effect and skip the auto-benchmark (so an
//                     A/B comparison isn't disturbed by the self-switch)
//   ?debug=true     — show the on-screen FPS counter overlay
const params = typeof window !== 'undefined'
  ? new URLSearchParams(window.location.search)
  : new URLSearchParams();

export const flags = {
  lowPowerForced: params.get('lowPower') === 'true',
  lowPowerPinned: params.get('lowPower') !== null, // either value set explicitly
  debug: params.get('debug') === 'true',
};

// Self-benchmark tuning. Sampling starts after the initial mount burst
// (fonts, first paint, entry animations settling) and watches real frames.
const BENCH_DELAY_MS = 1500;
const BENCH_FRAMES = 60;
// Median frame time above this (~42fps sustained) means the machine can't
// hold the full animated Atmosphere — switch to the static fallback.
const BAD_FRAME_MS = 24;

/**
 * usePerformanceMode — decides whether the kiosk should run in low-power
 * visual mode. Returns true immediately when forced via ?lowPower=true;
 * otherwise runs a one-shot self-benchmark shortly after mount and flips to
 * low power if frame times are consistently poor (e.g. on the Pi 5's GPU).
 */
export function usePerformanceMode() {
  const [lowPower, setLowPower] = useState(flags.lowPowerForced);

  useEffect(() => {
    if (flags.lowPowerPinned) return;

    let cancelled = false;
    let raf;
    const samples = [];
    let last = null;

    const tick = (t) => {
      if (cancelled) return;
      if (last !== null) samples.push(t - last);
      last = t;
      if (samples.length < BENCH_FRAMES) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const sorted = [...samples].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      if (median > BAD_FRAME_MS) {
        // eslint-disable-next-line no-console
        console.info(`[punch] self-benchmark: median frame ${median.toFixed(1)}ms > ${BAD_FRAME_MS}ms — enabling low-power Atmosphere`);
        setLowPower(true);
      }
    };

    const timer = setTimeout(() => { raf = requestAnimationFrame(tick); }, BENCH_DELAY_MS);
    return () => { cancelled = true; clearTimeout(timer); cancelAnimationFrame(raf); };
  }, []);

  return lowPower;
}
