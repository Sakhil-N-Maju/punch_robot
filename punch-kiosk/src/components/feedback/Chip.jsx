import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * Chip — rounded-full topic / quick-question pill that leads with an animated
 * Lucide icon. variant: pill (compact, greeting) | box (larger, chat empty grid).
 */
export function Chip({ label, icon, iconAnim = 'iconFloat', variant = 'pill', onClick, style = {} }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const isBox = variant === 'box';
  const lift = hover || press;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isBox ? 12 : 10,
        padding: isBox ? '20px' : '12px 22px',
        minHeight: 44, /* WCAG touch target */
        width: isBox ? '100%' : 'auto',
        justifyContent: isBox ? 'flex-start' : 'center',
        background: lift ? '#F0FDFA' : '#FFFFFF',
        border: `1px solid ${lift ? '#99F6E4' : '#E5E5E5'}`,
        borderRadius: isBox ? 16 : 999,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)',
        transform: press ? 'scale(0.96)' : 'scale(1)',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontSize: isBox ? 16 : 15,
        fontWeight: 500,
        color: lift ? '#0F766E' : (isBox ? '#0A0A0A' : '#525252'),
        textAlign: 'left',
        ...style,
      }}
    >
      <Icon name={icon} size={isBox ? 18 : 16} color={lift ? '#0F766E' : '#14B8A6'} anim={iconAnim} />
      {label}
    </button>
  );
}
