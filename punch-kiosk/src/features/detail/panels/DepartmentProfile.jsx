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
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: '#737373', textTransform: 'uppercase', textAlign: 'center' }}>{label}</div>
    </div>
  );
}

const has = (arr) => Array.isArray(arr) && arr.length > 0;

/**
 * DepartmentProfile — the rich "everything about this department" view shown
 * above the HOD/faculty list in AcademicsPanel, when departmentDetails has an
 * entry for the selected department.
 *
 * Every section is guarded: the 10 remaining departments will get profiles
 * added incrementally, and a partial entry (say, vision + labs but no funded
 * projects yet) must render its available sections instead of crashing the
 * whole Academics panel on a missing array.
 */
export function DepartmentProfile({ name, detail }) {
  if (!detail) return null;

  return (
    <>
      {detail.vision && (
        <div style={{ padding: '24px 26px', background: 'linear-gradient(135deg, #F0FDFA, #ECFEFF)', borderRadius: 20, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Icon name="target" size={18} color="#0F766E" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', color: '#0F766E', textTransform: 'uppercase' }}>
              Vision{detail.established ? ` · Est. ${detail.established}` : ''}
            </span>
          </div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontStyle: 'italic', color: '#0A0A0A', lineHeight: 1.6 }}>
            "{detail.vision}"
          </div>
        </div>
      )}

      {has(detail.mission) && (
        <>
          <SectionLabel>MISSION</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {detail.mission.map((m) => (
              <div key={m} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 14 }}>
                <Icon name="compass" size={16} color="#14B8A6" style={{ marginTop: 2, flex: 'none' }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#525252', lineHeight: 1.6 }}>{m}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {has(detail.programs) && (
        <>
          <SectionLabel>PROGRAMS & INTAKE</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {detail.programs.map((p) => (
              <InfoCard key={p.name} icon="graduation-cap" label={p.name} detail={p.intake ? `Intake: ${p.intake} seats/year` : undefined} />
            ))}
          </div>
        </>
      )}

      {has(detail.labs) && (
        <>
          <SectionLabel>LABS</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {detail.labs.map((l) => (
              <InfoCard key={l.name} icon="flask-conical" label={l.name} detail={l.focus} />
            ))}
          </div>
        </>
      )}

      {detail.research && (
        <>
          <SectionLabel>RESEARCH & INNOVATION</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            {detail.research.patents != null && <StatChip icon="file-badge" value={detail.research.patents} label="Patents" />}
            {detail.research.journalPublications != null && <StatChip icon="book-open" value={detail.research.journalPublications} label="Journal Papers" />}
            {detail.research.conferencePublications != null && <StatChip icon="users" value={detail.research.conferencePublications} label="Conf. Papers" />}
            {detail.research.books != null && <StatChip icon="book-open" value={detail.research.books} label="Books" />}
          </div>
          {has(detail.research.fundedProjects) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {detail.research.fundedProjects.map((p) => (
                <InfoCard key={p.title} icon="rocket" label={p.title} detail={`${p.funder} · ${p.amount} · ${p.duration}, ${p.year}`} />
              ))}
            </div>
          )}
        </>
      )}

      {has(detail.collaborations) && (
        <>
          <SectionLabel>INDUSTRY COLLABORATIONS</SectionLabel>
          <PillList items={detail.collaborations} />
        </>
      )}

      {has(detail.addOnPrograms) && (
        <>
          <SectionLabel>SKILL & ADD-ON PROGRAMS</SectionLabel>
          <PillList items={detail.addOnPrograms} />
        </>
      )}

      {has(detail.clubs) && (
        <>
          <SectionLabel>DEPARTMENT CLUBS</SectionLabel>
          <PillList items={detail.clubs} />
        </>
      )}

      {has(detail.studentProjects) && (
        <>
          <SectionLabel>NOTABLE STUDENT PROJECTS</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {detail.studentProjects.map((p) => (
              <InfoCard key={p.name} icon="folder-kanban" label={p.name} detail={p.detail} />
            ))}
          </div>
        </>
      )}

      {has(detail.achievements) && (
        <>
          <SectionLabel>ACHIEVEMENTS</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {detail.achievements.map((a) => (
              <InfoCard key={a} icon="trophy" label={a} />
            ))}
          </div>
        </>
      )}

      {has(detail.signatureEvents) && (
        <>
          <SectionLabel>SIGNATURE EVENTS</SectionLabel>
          <PillList items={detail.signatureEvents} />
        </>
      )}

      {has(detail.coordinators) && (
        <>
          <SectionLabel>COORDINATORS</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {detail.coordinators.map((c) => (
              <InfoCard key={c.role} icon="user" label={c.name} detail={c.role} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
