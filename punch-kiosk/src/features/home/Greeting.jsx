import React from 'react';
import { Chip } from '../../components/feedback/Chip.jsx';

const TOPIC_CHIPS = [
  { label: 'Campus Map', icon: 'map-pin', panel: 'campus' },
  { label: 'Events', icon: 'calendar', panel: 'events' },
  { label: 'Programs', icon: 'graduation-cap', panel: 'academics' },
  { label: 'Admissions', icon: 'clipboard-list', panel: 'admissions' },
];

function greetingForHour(hour) {
  if (hour < 12) return 'Good Morning, ASIET!';
  if (hour < 17) return 'Good Afternoon, ASIET!';
  return 'Good Evening, ASIET!';
}

export function Greeting({ onOpenPanel, now }) {
  return (
    <section style={{ height: 340, flex: 'none', padding: '40px 56px', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '2px', color: '#737373' }}>HELLO THERE</div>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 52, fontWeight: 800, letterSpacing: '-1.5px', color: '#0A0A0A', margin: '8px 0 4px' }}>
          {greetingForHour(now.getHours())}
        </h1>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 400, color: '#525252' }}>
          How can I help you today?
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          {TOPIC_CHIPS.map((c, i) => (
            <div key={c.label} style={{ animation: `chipStagger 0.5s ease both`, animationDelay: `${i * 0.08}s` }}>
              <Chip label={c.label} icon={c.icon} onClick={() => onOpenPanel(c.panel)} />
            </div>
          ))}
        </div>
        <div style={{ height: 1, marginTop: 24, background: 'linear-gradient(90deg, transparent, #E5E5E5, transparent)' }} />
      </div>
    </section>
  );
}
