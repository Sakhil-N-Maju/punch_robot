import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Tag } from '../feedback/Tag.jsx';

/**
 * QuickAccessCard — the white tile in the Home "Quick Access" grid. Turquoise
 * icon container top-left, grey TAG top-right, Sora title, body, and a chevron
 * that nudges right on hover. `featured` gives the turquoise gradient hover border.
 */
export function QuickAccessCard({ title, body, icon, iconAnim, tag, featured = false, onClick, style = {} }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        padding: '28px 24px',
        backgroundColor: hover ? '#F0FDFA' : '#FFFFFF',
        borderRadius: 24,
        border: featured && hover ? '1px solid transparent' : `1px solid ${hover ? '#99F6E4' : '#E5E5E5'}`,
        backgroundImage: featured && hover ? 'linear-gradient(#F0FDFA,#F0FDFA), linear-gradient(135deg,#2DD4BF,#0D9488)' : 'none',
        backgroundOrigin: featured && hover ? 'border-box' : 'padding-box',
        backgroundClip: featured && hover ? 'padding-box, border-box' : 'border-box',
        boxShadow: hover ? '0 8px 28px rgba(20,184,166,0.14), 0 0 0 1px #99F6E4' : '0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)',
        cursor: 'pointer',
        transform: press ? 'scale(0.98)' : hover ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 14, background: '#F0FDFA' }}>
          <Icon name={icon} size={26} color="#14B8A6" strokeWidth={2} anim={hover ? iconAnim : undefined} />
        </span>
        {tag && <Tag>{tag}</Tag>}
      </div>

      <div style={{ fontFamily: "'Sora', system-ui, sans-serif", fontSize: 20, fontWeight: 600, color: '#0A0A0A', marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: 15, fontWeight: 400, color: '#525252', lineHeight: 1.6 }}>
        {body}
      </div>

      <span style={{ marginTop: 'auto', alignSelf: 'flex-end', paddingTop: 16, display: 'inline-flex', transform: hover ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)' }}>
        <Icon name="chevron-right" size={20} color="#A3A3A3" />
      </span>
    </button>
  );
}
