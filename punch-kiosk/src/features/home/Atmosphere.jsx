import React from 'react';

/**
 * Atmosphere — soft turquoise light drifting across the whole Home screen,
 * behind every zone. Replaces hard boxed separation with a continuous wash
 * (per the brand's "premium airport self-service" visual target).
 */
export function Atmosphere({ intensity = 55, motion = true }) {
  const k = Math.max(0, Math.min(1, intensity / 100));
  const drift = (dur, delay) => (motion
    ? { animation: `floatDrift ${dur}s ease-in-out infinite`, animationDelay: `${delay}s` }
    : {});

  const blobs = [
    { cx: '16%', cy: '20%', r: 640, col: '45,212,191', op: 0.14, dur: 26, d: 0 },
    { cx: '84%', cy: '30%', r: 700, col: '20,184,166', op: 0.13, dur: 30, d: -4 },
    { cx: '28%', cy: '60%', r: 560, col: '13,148,136', op: 0.10, dur: 24, d: -8 },
    { cx: '76%', cy: '74%', r: 660, col: '45,212,191', op: 0.12, dur: 28, d: -2 },
    { cx: '50%', cy: '46%', r: 520, col: '20,184,166', op: 0.08, dur: 22, d: -6 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.cx, top: b.cy, width: b.r, height: b.r,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(${b.col},${(b.op * k).toFixed(3)}) 0%, rgba(${b.col},0) 70%)`,
          filter: 'blur(60px)', ...drift(b.dur, b.d),
        }} />
      ))}
    </div>
  );
}
