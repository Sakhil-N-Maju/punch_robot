import React from 'react';
import { DetailPanel, SectionLabel, InfoCard } from '../DetailPanel.jsx';
import { institution, accreditations, leadership, contact } from '../../../data/asietContent.js';

export function AboutPanel({ onBack, onAskPunch }) {
  return (
    <DetailPanel title="About & Directory" subtitle="Leadership, accreditations & contact" icon="building-2" onBack={onBack} onAskPunch={onAskPunch}>
      <div style={{
        padding: '24px 26px', background: '#F0FDFA', borderRadius: 20, marginBottom: 8,
      }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, color: '#0A0A0A' }}>{institution.name}</div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#525252', marginTop: 6, lineHeight: 1.6 }}>
          Founded {institution.founded} · {institution.tagline}
        </div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#525252', marginTop: 6 }}>
          {institution.address}
        </div>
      </div>

      <SectionLabel>ACCREDITATIONS</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {accreditations.map((a) => (
          <InfoCard key={a.label} icon={a.icon} label={a.label} detail={a.detail} />
        ))}
      </div>

      <SectionLabel>LEADERSHIP</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {leadership.map((l) => (
          <InfoCard key={l.name} icon="user" label={l.name} detail={l.phone ? `${l.role} · ${l.phone}` : l.role} />
        ))}
      </div>

      <SectionLabel>CONTACT</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {contact.lines.map((c) => (
          <InfoCard key={c.label} icon="phone" label={c.value} detail={c.label} />
        ))}
        <InfoCard icon="phone-call" label={contact.phones.join(' · ')} detail="Reception / general lines" />
        <InfoCard icon="mail" label={contact.email} detail="Email" />
      </div>
    </DetailPanel>
  );
}
