import React from 'react';

/**
 * Tag — small uppercase mono pill. neutral = grey-on-off-white, turquoise = soft fill.
 */
export function Tag({ children, variant = 'neutral', icon, style = {} }) {
  const variants = {
    neutral: { background: '#FAFAFA', color: '#A3A3A3', border: '1px solid #E5E5E5' },
    turquoise: { background: '#F0FDFA', color: '#0D9488', border: '1px solid transparent' },
  }[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        ...variants,
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
}
