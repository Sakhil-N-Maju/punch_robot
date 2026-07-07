import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * SearchField — the rounded-full text field used in the Home assistant bar and
 * the chat input bar. Leading search icon (omit with showIcon=false for chat).
 */
export function SearchField({
  placeholder = 'Ask anything about ASIET...',
  value,
  onChange,
  onFocus,
  onBlur,
  onClick,
  onKeyDown,
  showIcon = true,
  height = 64,
  readOnly = false,
  inputRef,
  style = {},
}) {
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const active = focus || hover;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height,
        padding: showIcon ? '0 24px 0 20px' : '0 24px',
        background: '#FFFFFF',
        border: `1.5px solid ${active ? '#99F6E4' : '#E5E5E5'}`,
        borderRadius: 999,
        boxShadow: focus ? '0 0 0 4px rgba(20,184,166,0.15)' : 'none',
        cursor: readOnly ? 'pointer' : 'text',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        ...style,
      }}
    >
      {showIcon && <Icon name="search" size={16} color="#A3A3A3" />}
      <input
        ref={inputRef}
        type="text"
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        onKeyDown={onKeyDown}
        onFocus={() => { setFocus(true); onFocus && onFocus(); }}
        onBlur={() => { setFocus(false); onBlur && onBlur(); }}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: 16,
          color: '#0A0A0A',
          minWidth: 0,
          pointerEvents: readOnly ? 'none' : 'auto',
        }}
      />
    </div>
  );
}
