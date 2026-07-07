import React from 'react';
import { Icon } from '../../components/core/Icon.jsx';
import { Tag } from '../../components/feedback/Tag.jsx';
import { getCarouselSlides } from '../../data/asietContent.js';
import { useClock } from '../../hooks/useClock.js';

const ROTATE_MS = 8000;

export function Carousel({ onOpenPanel }) {
  // Recompute the slide list when the calendar day changes — the kiosk runs
  // for weeks, and events must drop off / appear without a reboot.
  const { now } = useClock();
  const dayKey = now.toDateString();
  const slides = React.useMemo(() => getCarouselSlides(new Date()), [dayKey]);

  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [press, setPress] = React.useState(false);

  // If the slide list shrinks on a day change, keep idx in range.
  React.useEffect(() => {
    setIdx((i) => (i < slides.length ? i : 0));
  }, [slides.length]);

  React.useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const s = slides[idx];
  if (!s) return null;

  return (
    <section style={{ height: 536, flex: 'none', padding: '24px 56px 40px', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '2px', color: '#737373' }}>WHAT'S HAPPENING AT ASIET</div>
      </div>
      <button
        onClick={() => onOpenPanel('events')}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { setPaused(false); setPress(false); }}
        onPointerDown={() => { setPress(true); setPaused(true); }}
        onPointerUp={() => { setPress(false); setPaused(false); }}
        onPointerCancel={() => { setPress(false); setPaused(false); }}
        style={{
          height: 360, width: '100%', background: '#FFFFFF', borderRadius: 28, border: '1px solid #E5E5E5',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '48px 52px', display: 'flex', alignItems: 'center', gap: 40,
          cursor: 'pointer', textAlign: 'left', font: 'inherit',
          transform: press ? 'scale(0.99)' : 'scale(1)',
          transition: 'transform 0.15s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* key={idx} remounts on rotation; fadeInUp turns the hard cut into a soft transition */}
        <div style={{ flex: 1, minWidth: 0, animation: 'fadeInUp 0.45s cubic-bezier(0.4,0,0.2,1) both' }} key={idx}>
          <Tag variant="turquoise" icon={<Icon name={s.pillIcon} size={14} color="#0F766E" anim="iconFloat" />}>{s.pill}</Tag>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: '-0.5px', color: '#0A0A0A', margin: '18px 0 10px' }}>{s.title}</h2>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 19, fontWeight: 500, color: '#525252', marginBottom: 22 }}>{s.sub}</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#FAFAFA', border: '1px solid #E5E5E5', borderRadius: 999, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#525252' }}>
            <Icon name="clock" size={15} color="#737373" />{s.dateLabel}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 24, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 600, color: '#0F766E' }}>
            Tap to learn more <Icon name="chevron-right" size={18} color="#0F766E" />
          </div>
        </div>
        <div style={{ width: 180, flex: 'none', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 96, fontWeight: 900, color: '#CCFBF1', lineHeight: 1 }}>{s.decor}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '1px', color: '#737373', marginTop: 4 }}>{s.decorLabel}</div>
        </div>
      </button>
      {/* Dots: 44x44 hit areas (WCAG target size) around small visual dots */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} style={{
            width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <span style={{
              width: i === idx ? 24 : 8, height: 8, borderRadius: 999,
              background: i === idx ? '#14B8A6' : '#737373',
              transition: 'all 0.3s ease',
            }} />
          </button>
        ))}
      </div>
    </section>
  );
}
