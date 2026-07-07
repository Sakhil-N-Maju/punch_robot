import React from 'react';
import { StatusDot } from '../../components/feedback/StatusDot.jsx';
import { SearchField } from '../../components/forms/SearchField.jsx';
import { IconButton } from '../../components/core/IconButton.jsx';

const PAD_X = 56;

export function AssistantBar({ value, onChange, onFocus, onSubmit, onMic }) {
  return (
    <footer style={{
      height: 192, flex: 'none', display: 'flex', alignItems: 'center', gap: 24, padding: `0 ${PAD_X}px`,
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid #E5E5E5',
      boxShadow: '0 -1px 0 #E5E5E5, 0 -4px 20px rgba(0,0,0,0.03)',
      position: 'relative', zIndex: 2,
    }}>
      <div style={{ width: 220, flex: 'none' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800, letterSpacing: '2.5px', color: '#14B8A6' }}>PUNCH</div>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 600, color: '#0A0A0A', margin: '4px 0 6px' }}>Your AI Receptionist</div>
        <StatusDot label="Ready to help" />
      </div>
      <div style={{ flex: 1 }}>
        <SearchField
          placeholder="Ask anything about ASIET..."
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(value); }}
        />
      </div>
      <IconButton icon="mic" size={80} pulse ariaLabel="Voice input" onClick={onMic} style={{ flex: 'none' }} />
    </footer>
  );
}
