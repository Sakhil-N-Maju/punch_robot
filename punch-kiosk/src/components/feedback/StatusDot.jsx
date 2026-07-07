import React from 'react';

/**
 * StatusDot — a small turquoise dot (the "online / ready" indicator) with the
 * dotPulse animation, optionally followed by a label.
 */
export function StatusDot({ label, size = 8, labelColor = '#737373', style = {} }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}>
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#14B8A6',
          animation: 'dotPulse 2.2s ease-in-out infinite',
          flex: 'none',
        }}
      />
      {label && (
        <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 12, color: labelColor }}>
          {label}
        </span>
      )}
    </span>
  );
}
