import React from 'react';
import { Icon } from '../../components/core/Icon.jsx';

const ROWS_LETTERS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const ROWS_NUMBERS = ['1234567890', "-/:;()$&@\"", '.,?!\'#%^*'];

/**
 * Key — one keyboard key with instant pointer press feedback (touchscreens
 * never hover, and synthesized mouse events arrive too late to feel tactile).
 */
function Key({ onPress, flexGrow = 1, active = false, ariaLabel, children }) {
  const [press, setPress] = React.useState(false);

  return (
    <button
      onClick={onPress}
      aria-label={ariaLabel}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      style={{
        flex: flexGrow, height: 60, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        // Active (shift on / enter): #0D9488 keeps the white glyph >=3:1.
        background: active ? '#0D9488' : press ? '#CCFBF1' : '#FFFFFF',
        border: active ? 'none' : `1px solid ${press ? '#99F6E4' : '#E5E5E5'}`,
        borderRadius: 12,
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 19, fontWeight: 500,
        color: active ? '#FFFFFF' : '#0A0A0A',
        cursor: 'pointer', userSelect: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transform: press ? 'scale(0.94)' : 'scale(1)',
        transition: 'transform 0.08s ease, background 0.08s ease',
      }}
    >
      {children}
    </button>
  );
}

/**
 * OnScreenKeyboard — touch QWERTY for the chat input. Most kiosk touchscreens
 * have no physical keyboard, and a locked-down kiosk browser may not reliably
 * surface the OS soft keyboard, so this ships an in-app one instead.
 */
export function OnScreenKeyboard({ value, onChange, onEnter, onClose }) {
  const [shift, setShift] = React.useState(false);
  const [numeric, setNumeric] = React.useState(false);

  const press = (ch) => {
    onChange(value + (shift && !numeric ? ch.toUpperCase() : ch));
    // Standard soft-keyboard behavior: shift applies to one letter.
    if (shift) setShift(false);
  };
  const backspace = () => onChange(value.slice(0, -1));
  const space = () => onChange(value + ' ');

  const rows = numeric ? ROWS_NUMBERS : ROWS_LETTERS;

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 10,
      background: '#FAFAFA', borderTop: '1px solid #E5E5E5', padding: '8px 32px 24px',
      boxShadow: '0 -8px 24px rgba(0,0,0,0.08)', animation: 'fadeInUp 0.2s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        {/* 44x44 minimum touch target for the dismiss control */}
        <button onClick={onClose} aria-label="Hide keyboard" style={{
          width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', cursor: 'pointer', color: '#737373',
        }}>
          <Icon name="chevron-down" size={22} color="#737373" />
        </button>
      </div>

      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, paddingLeft: i === 1 ? 20 : 0, paddingRight: i === 1 ? 20 : 0 }}>
          {i === 2 && !numeric && (
            <Key flexGrow={1.5} active={shift} ariaLabel="Shift" onPress={() => setShift((s) => !s)}>
              <Icon name="arrow-big-up" size={18} color={shift ? '#FFFFFF' : '#525252'} />
            </Key>
          )}
          {row.split('').map((ch) => (
            <Key key={ch} onPress={() => press(ch)}>
              {shift && !numeric ? ch.toUpperCase() : ch}
            </Key>
          ))}
          {i === 2 && (
            <Key flexGrow={1.5} ariaLabel="Backspace" onPress={backspace}>
              <Icon name="delete" size={18} color="#525252" />
            </Key>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: 8 }}>
        <Key flexGrow={1.6} ariaLabel={numeric ? 'Letters' : 'Numbers'} onPress={() => setNumeric((n) => !n)}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{numeric ? 'ABC' : '123'}</span>
        </Key>
        <Key flexGrow={5} ariaLabel="Space" onPress={space}>space</Key>
        <Key flexGrow={1.8} active ariaLabel="Send" onPress={onEnter}>
          <Icon name="send" size={18} color="#FFFFFF" />
        </Key>
      </div>
    </div>
  );
}
