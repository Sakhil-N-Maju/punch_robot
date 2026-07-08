import React from 'react';

/**
 * FpsCounter — on-screen frame-time overlay, shown only with ?debug=true.
 * Samples requestAnimationFrame continuously and updates the readout twice a
 * second (state updates are throttled so the counter itself stays cheap).
 *
 * Reading it: avg <=17ms = solid 60fps (green) · 17-34ms = borderline (amber)
 * · >34ms = real jank (red). `max` is the worst single frame in the window —
 * occasional spikes during panel transitions are the thing to watch.
 */
export function FpsCounter({ lowPower = false, lowPowerForced = false }) {
  const [stats, setStats] = React.useState({ fps: 0, avg: 0, max: 0 });

  React.useEffect(() => {
    let alive = true;
    let raf;
    let last = performance.now();
    let frames = [];

    const tick = (t) => {
      if (!alive) return;
      frames.push(t - last);
      last = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const timer = setInterval(() => {
      if (!frames.length) return;
      const avg = frames.reduce((a, b) => a + b, 0) / frames.length;
      const max = Math.max(...frames);
      setStats({ fps: Math.round(1000 / avg), avg, max });
      frames = [];
    }, 500);

    return () => { alive = false; cancelAnimationFrame(raf); clearInterval(timer); };
  }, []);

  const color = stats.avg <= 17 ? '#0F766E' : stats.avg <= 34 ? '#B45309' : '#B91C1C';

  return (
    <div style={{
      position: 'absolute', top: 12, left: 12, zIndex: 99, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 14px', background: 'rgba(255,255,255,0.92)',
      border: '1px solid #E5E5E5', borderRadius: 10,
      fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 13, fontWeight: 700,
    }}>
      <span style={{ color }}>
        {stats.fps} FPS · {stats.avg.toFixed(1)}ms avg · {stats.max.toFixed(0)}ms max
      </span>
      {lowPower && (
        <span style={{ color: '#FFFFFF', background: '#0F766E', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>
          LOW POWER {lowPowerForced ? '(URL)' : '(AUTO)'}
        </span>
      )}
    </div>
  );
}
