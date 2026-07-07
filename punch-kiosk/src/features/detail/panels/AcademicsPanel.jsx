import React from 'react';
import { DetailPanel, SectionLabel, InfoCard } from '../DetailPanel.jsx';
import { DepartmentProfile } from './DepartmentProfile.jsx';
import { Icon } from '../../../components/core/Icon.jsx';
import { programs, facultyDirectory, departmentDetails } from '../../../data/asietContent.js';

function DeptChip({ label, active, onClick }) {
  const [press, setPress] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      style={{
        // minHeight 44 (touch target); active bg #0F766E keeps white 14px text AA.
        padding: '12px 20px', minHeight: 44, borderRadius: 999, border: `1px solid ${active ? 'transparent' : '#E5E5E5'}`,
        background: active ? '#0F766E' : press ? '#F0FDFA' : '#FFFFFF', color: active ? '#FFFFFF' : '#525252',
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer',
        boxShadow: active ? '0 4px 14px rgba(20,184,166,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
        transform: press ? 'scale(0.96)' : 'scale(1)',
        transition: 'all 0.18s ease',
      }}>{label}</button>
  );
}

export function AcademicsPanel({ onBack, onAskPunch }) {
  const [selectedDept, setSelectedDept] = React.useState(facultyDirectory[0].key);
  const dept = facultyDirectory.find((d) => d.key === selectedDept);

  return (
    <DetailPanel title="Academics & Programs" subtitle="UG · PG · Business School · PhD" icon="graduation-cap" onBack={onBack} onAskPunch={onAskPunch}>
      <SectionLabel>B.TECH (UNDERGRADUATE)</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {programs.ug.map((p) => (
          <InfoCard key={p.name} icon={p.icon} label={p.name} detail={p.code} />
        ))}
      </div>

      <SectionLabel>M.TECH (POSTGRADUATE)</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {programs.pg.map((p) => (
          <InfoCard key={p.name} icon={p.icon} label={p.name} detail={p.code} />
        ))}
      </div>

      <SectionLabel>BUSINESS SCHOOL</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {programs.business.map((p) => (
          <InfoCard key={p.name} icon={p.icon} label={p.name} detail={p.code} />
        ))}
      </div>

      <SectionLabel>PhD PROGRAMS</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {programs.phd.map((p) => (
          <span key={p} style={{
            padding: '10px 18px', background: '#F0FDFA', border: '1px solid transparent', borderRadius: 999,
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#0F766E',
          }}>{p}</span>
        ))}
      </div>

      <SectionLabel>DEPARTMENTS</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        {facultyDirectory.map((d) => (
          <DeptChip key={d.key} label={d.key} active={d.key === selectedDept} onClick={() => setSelectedDept(d.key)} />
        ))}
      </div>

      {dept && departmentDetails[dept.key] && (
        <DepartmentProfile name={dept.name} detail={departmentDetails[dept.key]} />
      )}

      {dept && (
        <>
          <SectionLabel>FACULTY</SectionLabel>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px',
            background: '#F0FDFA', borderRadius: 20, marginBottom: 16,
          }}>
            <span style={{ flex: 'none', width: 48, height: 48, borderRadius: 12, background: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="user" size={24} color="#0D9488" />
            </span>
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 700, color: '#0A0A0A' }}>{dept.hod}</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#0F766E', marginTop: 2 }}>Head of Department · {dept.name}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dept.members.filter((m) => m.name !== dept.hod).map((m) => (
              <div key={m.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 18px', background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 14,
              }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 600, color: '#0A0A0A' }}>{m.name}</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#737373', textAlign: 'right' }}>{m.designation}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </DetailPanel>
  );
}
