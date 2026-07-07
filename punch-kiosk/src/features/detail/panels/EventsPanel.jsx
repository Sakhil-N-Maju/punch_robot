import React from 'react';
import { DetailPanel, SectionLabel, InfoCard } from '../DetailPanel.jsx';
import { getCarouselSlides } from '../../../data/asietContent.js';

export function EventsPanel({ onBack, onAskPunch }) {
  const slides = React.useMemo(() => getCarouselSlides(new Date()), []);
  const eventItems = slides.filter((s) => s.kind === 'event');
  const newsItems = slides.filter((s) => s.kind === 'news');

  return (
    <DetailPanel title="Events & News" subtitle="What's happening at ASIET" icon="calendar" onBack={onBack} onAskPunch={onAskPunch}>
      <SectionLabel>EVENTS</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {eventItems.map((e) => (
          <InfoCard key={e.id} icon={e.pillIcon} label={e.title} detail={`${e.sub} · ${e.dateLabel}${e.location ? ' · ' + e.location : ''}`} />
        ))}
      </div>

      <SectionLabel>RECENT NEWS & ACHIEVEMENTS</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {newsItems.map((n) => (
          <InfoCard key={n.id} icon={n.pillIcon} label={n.title} detail={`${n.sub} · ${n.dateLabel}`} />
        ))}
      </div>
    </DetailPanel>
  );
}
