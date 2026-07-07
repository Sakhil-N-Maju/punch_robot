import React from 'react';
import { Icon } from './Icon.jsx';

/**
 * IconButton — circular icon-only control. Used for the mic (turquoise gradient,
 * pulse ring) and the chat send button (turquoise when active, grey when idle).
 */
export function IconButton({ icon, variant = 'solid', size = 64, active = true, pulse = false, onClick, ariaLabel, style = {} }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const solid = {
    // Deep gradient: the white glyph needs >=3:1 against the whole surface;
    // the old #2DD4BF light end was ~1.8:1.
    background: active ? 'linear-gradient(135deg, #0D9488, #0F766E)' : '#E5E5E5',
    color: active ? '#FFFFFF' : '#737373',
    boxShadow: active ? '0 4px 20px rgba(20,184,166,0.45)' : 'none',
    border: 'none',
  };
  const flat = {
    background: hover || press ? '#F0FDFA' : '#FFFFFF',
    color: hover || press ? '#0F766E' : '#525252',
    boxShadow: 'none',
    border: `1px solid ${hover || press ? '#99F6E4' : '#E5E5E5'}`,
  };
  const v = variant === 'solid' ? solid : flat;

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        cursor: 'pointer',
        transform: press ? 'scale(0.94)' : hover ? 'scale(1.06)' : 'scale(1)',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        ...v,
        ...style,
      }}
    >
      {pulse && active && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'rgba(20,184,166,0.4)',
            animation: 'pulseRing 2.4s ease-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}
      <Icon name={icon} size={Math.round(size * 0.4)} color="currentColor" strokeWidth={1.6} />
    </button>
  );
}
