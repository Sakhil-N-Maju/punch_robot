import React from 'react';
import { Icon } from '../../components/core/Icon.jsx';

const ROWS_LETTERS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const ROWS_NUMBERS = ['1234567890', "-/:;()$&@\"", '.,?!\'#%^*'];

/**
 * OnScreenKeyboard — touch QWERTY for the chat input. Most kiosk touchscreens
 * have no physical keyboard, and a locked-down kiosk browser may not reliably
 * surface the OS soft keyboard, so this ships an in-app one instead.
 */
export function OnScreenKeyboard({ value, onChange, onEnter, onClose }) {
  const [shift, setShift] = React.useState(false);
  const [numeric, setNumeric] = React.useState(false);

  const press = (ch) => onChange(value + ch);
  const backspace = () => onChange(value.slice(0, -1));
  const space = () => onChange(value + ' ');

  const rows = numeric ? ROWS_NUMBERS : ROWS_LETTERS;

  const keyStyle = {
    flex: 1, height: 60, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 12,
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 19, fontWeight: 500, color: '#0A0A0A',
    cursor: 'pointer', userSelect: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 10,
      background: '#FAFAFA', borderTop: '1px solid #E5E5E5', padding: '16px 32px 24px',
      boxShadow: '0 -8px 24px rgba(0,0,0,0.08)', animation: 'fadeInUp 0.2s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={onClose} aria-label="Hide keyboard" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#A3A3A3' }}>
          <Icon name="chevron-down" size={20} color="#A3A3A3" />
        </button>
      </div>

      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, paddingLeft: i === 1 ? 20 : 0, paddingRight: i === 1 ? 20 : 0 }}>
          {i === 2 && !numeric && (
            <button onClick={() => setShift((s) => !s)} style={{ ...keyStyle, flex: 1.5, background: shift ? '#14B8A6' : '#FFFFFF', color: shift ? '#FFFFFF' : '#0A0A0A' }}>
              <Icon name="arrow-big-up" size={18} color={shift ? '#FFFFFF' : '#525252'} />
            </button>
          )}
          {row.split('').map((ch) => (
            <button key={ch} onClick={() => press(shift && !numeric ? ch.toUpperCase() : ch)} style={keyStyle}>
              {shift && !numeric ? ch.toUpperCase() : ch}
            </button>
          ))}
          {i === 2 && (
            <button onClick={backspace} style={{ ...keyStyle, flex: 1.5 }}>
              <Icon name="delete" size={18} color="#525252" />
            </button>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setNumeric((n) => !n)} style={{ ...keyStyle, flex: 1.6, fontSize: 15, fontWeight: 600 }}>
          {numeric ? 'ABC' : '123'}
        </button>
        <button onClick={space} style={{ ...keyStyle, flex: 5 }}>space</button>
        <button onClick={onEnter} style={{ ...keyStyle, flex: 1.8, background: '#14B8A6', color: '#FFFFFF', border: 'none' }}>
          <Icon name="send" size={18} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
}
