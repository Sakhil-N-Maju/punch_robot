import React from 'react';
import { DetailPanel, SectionLabel, InfoCard } from '../DetailPanel.jsx';
import { admissions, contact, programs } from '../../../data/asietContent.js';

export function AdmissionsPanel({ onBack, onAskPunch }) {
  return (
    <DetailPanel title="Admissions" subtitle="2026 counselling & how to apply" icon="clipboard-list" onBack={onBack} onAskPunch={onAskPunch}>
      <div style={{ padding: '24px 26px', background: '#F0FDFA', borderRadius: 20 }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, color: '#0D9488' }}>{admissions.portal}</div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#525252', marginTop: 6 }}>Official admissions portal</div>
      </div>

      <SectionLabel>HOW TO APPLY</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {admissions.notes.map((n) => (
          <InfoCard key={n} icon="check-circle-2" label={n} />
        ))}
      </div>

      <SectionLabel>PROGRAMS OPEN FOR ADMISSION</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {[...programs.ug.map((p) => p.name), ...programs.business.map((p) => p.name)].map((p) => (
          <span key={p} style={{
            padding: '10px 18px', background: '#FAFAFA', border: '1px solid #E5E5E5', borderRadius: 999,
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#525252',
          }}>{p}</span>
        ))}
      </div>

      <SectionLabel>TALK TO ADMISSIONS</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {contact.lines.filter((l) => l.label.includes('Admission')).map((c) => (
          <InfoCard key={c.label} icon="phone" label={c.value} detail={c.label} />
        ))}
        <InfoCard icon="mail" label={contact.email} detail="Email the admissions office" />
      </div>
    </DetailPanel>
  );
}
