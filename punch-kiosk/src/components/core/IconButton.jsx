import React from 'react';
import { Icon } from './Icon.jsx';

/**
 * IconButton — circular icon-only control. Used for the mic (turquoise gradient,
 * pulse ring) and the chat send button (turquoise when active, grey when idle).
 */
export function IconButton({ icon, variant = 'solid', size = 64, active = true, pulse = false, onClick, ariaLabel, style = {} }) {
  const [hover, setHover] = React.useState(false);

  const solid = {
    background: active ? 'linear-gradient(135deg, #2DD4BF, #0D9488)' : '#E5E5E5',
    color: active ? '#FFFFFF' : '#A3A3A3',
    boxShadow: active ? '0 4px 20px rgba(20,184,166,0.45)' : 'none',
    border: 'none',
  };
  const flat = {
    background: hover ? '#F0FDFA' : '#FFFFFF',
    color: hover ? '#0D9488' : '#525252',
    boxShadow: 'none',
    border: `1px solid ${hover ? '#99F6E4' : '#E5E5E5'}`,
  };
  const v = variant === 'solid' ? solid : flat;

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        cursor: 'pointer',
        transform: hover ? 'scale(1.06)' : 'scale(1)',
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
