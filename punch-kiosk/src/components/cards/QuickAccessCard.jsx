import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Tag } from '../feedback/Tag.jsx';

/**
 * QuickAccessCard — the white tile in the Home "Quick Access" grid. Turquoise
 * icon container top-left, grey TAG top-right, Sora title, body, and a chevron
 * that nudges right on hover.
 *
 * `featured` (the Ask Punch tile) carries its turquoise-gradient border and
 * soft fill AT REST — hover never fires on a touchscreen, so the primary
 * action has to be distinguishable without it.
 *
 * Press feedback uses pointer events: mouse events are synthesized late (or
 * not at all) under touch, so onMouseDown alone gives no tactile response.
 */
export function QuickAccessCard({ title, body, icon, iconAnim, tag, featured = false, onClick, style = {} }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const lift = hover || press;
  const gradientBorder = featured; // always on for the featured tile

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        padding: '28px 24px',
        backgroundColor: lift || featured ? '#F0FDFA' : '#FFFFFF',
        borderRadius: 24,
        border: gradientBorder ? '1px solid transparent' : `1px solid ${lift ? '#99F6E4' : '#E5E5E5'}`,
        backgroundImage: gradientBorder
          ? `linear-gradient(${lift ? '#F0FDFA,#F0FDFA' : '#F0FDFA,#FFFFFF'}), linear-gradient(135deg,#2DD4BF,#0D9488)`
          : 'none',
        backgroundOrigin: gradientBorder ? 'border-box' : 'padding-box',
        backgroundClip: gradientBorder ? 'padding-box, border-box' : 'border-box',
        boxShadow: lift
          ? '0 8px 28px rgba(20,184,166,0.14), 0 0 0 1px #99F6E4'
          : featured
            ? '0 4px 16px rgba(20,184,166,0.10)'
            : '0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)',
        cursor: 'pointer',
        transform: press ? 'scale(0.97)' : hover ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 14, background: featured ? '#FFFFFF' : '#F0FDFA' }}>
          <Icon name={icon} size={26} color="#14B8A6" strokeWidth={2} anim={lift ? iconAnim : undefined} />
        </span>
        {tag && <Tag variant={featured ? 'turquoise' : 'neutral'}>{tag}</Tag>}
      </div>

      <div style={{ fontFamily: "'Sora', system-ui, sans-serif", fontSize: 20, fontWeight: 600, color: '#0A0A0A', marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: 15, fontWeight: 400, color: '#525252', lineHeight: 1.6 }}>
        {body}
      </div>

      <span style={{ marginTop: 'auto', alignSelf: 'flex-end', paddingTop: 16, display: 'inline-flex', transform: lift ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)' }}>
        <Icon name="chevron-right" size={20} color={featured ? '#0F766E' : '#737373'} />
      </span>
    </button>
  );
}
