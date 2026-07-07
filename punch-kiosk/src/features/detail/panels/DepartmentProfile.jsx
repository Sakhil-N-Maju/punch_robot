import React from 'react';
import { SectionLabel, InfoCard, PillList } from '../DetailPanel.jsx';
import { Icon } from '../../../components/core/Icon.jsx';

function StatChip({ icon, value, label }) {
  return (
    <div style={{
      flex: 1, minWidth: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: '18px 12px', background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 16,
    }}>
      <Icon name={icon} size={20} color="#14B8A6" />
      <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, color: '#0A0A0A' }}>{value}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: '#A3A3A3', textTransform: 'uppercase', textAlign: 'center' }}>{label}</div>
    </div>
  );
}

/**
 * DepartmentProfile — the rich "everything about this department" view shown
 * above the HOD/faculty list in AcademicsPanel, when departmentDetails has an
 * entry for the selected department. Departments without an entry simply
 * don't render this (see AcademicsPanel) rather than showing empty sections.
 */
export function DepartmentProfile({ name, detail }) {
  return (
    <>
      <div style={{ padding: '24px 26px', background: 'linear-gradient(135deg, #F0FDFA, #ECFEFF)', borderRadius: 20, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Icon name="target" size={18} color="#0D9488" />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: '#0D9488', textTransform: 'uppercase' }}>Vision · Est. {detail.established}</span>
        </div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontStyle: 'italic', color: '#0A0A0A', lineHeight: 1.6 }}>
          "{detail.vision}"
        </div>
      </div>

      <SectionLabel>MISSION</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {detail.mission.map((m) => (
          <div key={m} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 14 }}>
            <Icon name="compass" size={16} color="#14B8A6" style={{ marginTop: 2, flex: 'none' }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#525252', lineHeight: 1.6 }}>{m}</span>
          </div>
        ))}
      </div>

      <SectionLabel>PROGRAMS & INTAKE</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {detail.programs.map((p) => (
          <InfoCard key={p.name} icon="graduation-cap" label={p.name} detail={`Intake: ${p.intake} seats/year`} />
        ))}
      </div>

      <SectionLabel>LABS</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {detail.labs.map((l) => (
          <InfoCard key={l.name} icon="flask-conical" label={l.name} detail={l.focus} />
        ))}
      </div>

      <SectionLabel>RESEARCH & INNOVATION</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <StatChip icon="file-badge" value={detail.research.patents} label="Patents" />
        <StatChip icon="book-open" value={detail.research.journalPublications} label="Journal Papers" />
        <StatChip icon="users" value={detail.research.conferencePublications} label="Conf. Papers" />
        <StatChip icon="book-open" value={detail.research.books} label="Books" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {detail.research.fundedProjects.map((p) => (
          <InfoCard key={p.title} icon="rocket" label={p.title} detail={`${p.funder} · ${p.amount} · ${p.duration}, ${p.year}`} />
        ))}
      </div>

      <SectionLabel>INDUSTRY COLLABORATIONS</SectionLabel>
      <PillList items={detail.collaborations} />

      <SectionLabel>SKILL & ADD-ON PROGRAMS</SectionLabel>
      <PillList items={detail.addOnPrograms} />

      <SectionLabel>DEPARTMENT CLUBS</SectionLabel>
      <PillList items={detail.clubs} />

      <SectionLabel>NOTABLE STUDENT PROJECTS</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {detail.studentProjects.map((p) => (
          <InfoCard key={p.name} icon="folder-kanban" label={p.name} detail={p.detail} />
        ))}
      </div>

      <SectionLabel>ACHIEVEMENTS</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {detail.achievements.map((a) => (
          <InfoCard key={a} icon="trophy" label={a} />
        ))}
      </div>

      <SectionLabel>SIGNATURE EVENTS</SectionLabel>
      <PillList items={detail.signatureEvents} />

      <SectionLabel>COORDINATORS</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {detail.coordinators.map((c) => (
          <InfoCard key={c.role} icon="user" label={c.name} detail={c.role} />
        ))}
      </div>
    </>
  );
}
