import React from 'react';
import { DetailPanel, SectionLabel, InfoCard, PillList } from '../DetailPanel.jsx';
import { facilities, innovationCenters, clubs, socialService, studentSupport } from '../../../data/asietContent.js';

export function CampusPanel({ onBack, onAskPunch }) {
  return (
    <DetailPanel title="Campus Life" subtitle="Facilities, innovation centers & student life" icon="map-pin" onBack={onBack} onAskPunch={onAskPunch}>
      <SectionLabel>FACILITIES</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {facilities.map((f) => (
          <InfoCard key={f.label} icon={f.icon} label={f.label} detail={f.detail} />
        ))}
      </div>

      <SectionLabel>INNOVATION & RESEARCH CENTERS</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {innovationCenters.map((c) => (
          <InfoCard key={c.label} icon="lightbulb" label={c.label} detail={c.detail} />
        ))}
      </div>

      <SectionLabel>CLUBS & PROFESSIONAL ASSOCIATIONS</SectionLabel>
      <PillList items={clubs} />

      <SectionLabel>SOCIAL SERVICE INITIATIVES</SectionLabel>
      <PillList items={socialService} />

      <SectionLabel>STUDENT SUPPORT</SectionLabel>
      <PillList items={studentSupport} />
    </DetailPanel>
  );
}
