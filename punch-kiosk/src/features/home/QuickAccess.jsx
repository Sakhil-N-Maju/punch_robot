import React from 'react';
import { QuickAccessCard } from '../../components/cards/QuickAccessCard.jsx';

const QUICK_CARDS = [
  { title: 'Academics & Programs', body: 'B.Tech, M.Tech, MBA, MCA & PhD departments', icon: 'graduation-cap', tag: 'PROGRAMS', anim: 'iconWiggle', panel: 'academics' },
  { title: 'Campus Life', body: 'Library, hostels, clubs & innovation centers', icon: 'map-pin', tag: 'EXPLORE', anim: 'iconWiggle', panel: 'campus' },
  { title: 'About & Directory', body: 'Leadership, accreditations & contact numbers', icon: 'building-2', tag: 'ASIET', anim: 'iconWiggle', panel: 'about' },
  { title: 'Events & News', body: "What's happening on campus right now", icon: 'calendar', tag: 'UPCOMING', anim: 'iconWiggle', panel: 'events' },
  { title: 'Admissions', body: '2026 counselling, fees & how to apply', icon: 'clipboard-list', tag: 'JOIN US', anim: 'iconWiggle', panel: 'admissions' },
  { title: 'Ask Punch', body: 'Chat with our AI — 24/7', icon: 'sparkles', tag: 'AI POWERED', anim: 'sparkleTwinkle', panel: 'chat', featured: true },
];

export function QuickAccess({ onOpenPanel }) {
  return (
    <section style={{ height: 660, flex: 'none', padding: '32px 56px', position: 'relative', zIndex: 1 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '2px', color: '#A3A3A3', marginBottom: 20 }}>QUICK ACCESS</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 16, height: 540 }}>
        {QUICK_CARDS.map((c) => (
          <QuickAccessCard key={c.title} title={c.title} body={c.body} icon={c.icon} tag={c.tag}
            iconAnim={c.anim} featured={c.featured}
            onClick={() => onOpenPanel(c.panel)} style={{ height: '100%' }} />
        ))}
      </div>
    </section>
  );
}
