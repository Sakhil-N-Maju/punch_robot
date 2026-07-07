import React from 'react';
import { Icon } from './Icon.jsx';

/**
 * Button — primary action control. Variants: primary (turquoise gradient),
 * secondary (white + grey border), ghost.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const sizes = {
    sm: { padding: '0 16px', height: 40, font: 14 },
    md: { padding: '0 24px', height: 52, font: 16 },
    lg: { padding: '0 32px', height: 60, font: 17 },
  }[size];

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #2DD4BF, #0D9488)',
      color: '#FFFFFF',
      border: '1.5px solid transparent',
      boxShadow: hover ? '0 8px 28px rgba(20,184,166,0.30)' : '0 4px 16px rgba(20,184,166,0.20)',
    },
    secondary: {
      background: hover ? '#F0FDFA' : '#FFFFFF',
      color: hover ? '#0D9488' : '#0A0A0A',
      border: `1.5px solid ${hover ? '#99F6E4' : '#E5E5E5'}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    ghost: {
      background: hover ? '#F0FDFA' : 'transparent',
      color: hover ? '#0D9488' : '#525252',
      border: '1.5px solid transparent',
      boxShadow: 'none',
    },
  }[variant];

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: sizes.height,
        padding: sizes.padding,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontSize: sizes.font,
        fontWeight: 600,
        borderRadius: 16,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transform: press ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
        whiteSpace: 'nowrap',
        ...variants,
        ...style,
      }}
      {...rest}
    >
      {icon && <Icon name={icon} size={sizes.font + 2} color="currentColor" strokeWidth={2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={sizes.font + 2} color="currentColor" strokeWidth={2} />}
    </button>
  );
}
