import React from 'react';
import { Icon } from '../../components/core/Icon.jsx';
import { Tag } from '../../components/feedback/Tag.jsx';

/**
 * DetailPanel — shared full-screen shell for the Quick Access drill-down
 * views (Academics, Campus Life, About, Events, Admissions). Header matches
 * the chat header so navigating between panels and chat feels like one app.
 */
export function DetailPanel({ title, subtitle, icon, onBack, onAskPunch, children }) {
  return (
    <div style={{
      width: 1080, height: 1920, background: '#FFFFFF', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative',
    }}>
      <header style={{
        height: 144, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', borderBottom: '1px solid #E5E5E5', background: '#FFFFFF', zIndex: 2,
      }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
          <Icon name="arrow-left" size={22} color="#525252" />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#525252' }}>Home</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 52, height: 52, borderRadius: '50%', background: '#F0FDFA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={icon} size={26} color="#14B8A6" />
          </span>
          <div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 700, color: '#0A0A0A' }}>{title}</div>
            {subtitle && <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#A3A3A3' }}>{subtitle}</div>}
          </div>
        </div>
        <button onClick={onAskPunch} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Tag variant="turquoise" icon={<Icon name="sparkles" size={13} color="#0D9488" />}>Ask Punch</Tag>
        </button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 56px 64px' }}>
        {children}
      </div>
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '2px', color: '#A3A3A3', marginBottom: 16, marginTop: 40 }}>
      {children}
    </div>
  );
}

export function InfoCard({ icon, label, detail, style = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 22px',
      background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)', ...style,
    }}>
      {icon && (
        <span style={{ flex: 'none', width: 44, height: 44, borderRadius: 12, background: '#F0FDFA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={22} color="#14B8A6" />
        </span>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 600, color: '#0A0A0A' }}>{label}</div>
        {detail && <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#525252', marginTop: 4, lineHeight: 1.5 }}>{detail}</div>}
      </div>
    </div>
  );
}

export function PillList({ items }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {items.map((item) => (
        <span key={item} style={{
          padding: '10px 18px', background: '#FAFAFA', border: '1px solid #E5E5E5', borderRadius: 999,
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#525252',
        }}>{item}</span>
      ))}
    </div>
  );
}
