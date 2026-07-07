import React from 'react';
import { StatusDot } from '../../components/feedback/StatusDot.jsx';
import { useClock } from '../../hooks/useClock.js';

const PAD_X = 56;

export function Header() {
  const { time, date } = useClock();

  return (
    <header style={{
      height: 192, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `0 ${PAD_X}px`,
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E5E5E5',
      boxShadow: '0 1px 0 #E5E5E5, 0 4px 20px rgba(0,0,0,0.03)',
      position: 'relative', zIndex: 2,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 200 }}>
        <img src="/assets/asiet-logo.jpg" width="68" height="68" alt="ASIET"
          style={{ objectFit: 'contain', borderRadius: 18 }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#A3A3A3' }}>Est. 2001</span>
      </div>

      <div style={{ textAlign: 'center', flex: 1, maxWidth: 560 }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: '0.6px', color: '#0A0A0A', lineHeight: 1.25 }}>
          ADI SHANKARA INSTITUTE OF ENGINEERING AND TECHNOLOGY
        </div>
        <div style={{ width: 200, height: 1, background: '#E5E5E5', margin: '8px auto' }} />
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#A3A3A3' }}>
          Approved by AICTE · Affiliated to APJ Abdul Kalam Technological University (KTU)
        </div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#A3A3A3', marginTop: 4 }}>
          NBA Accredited · NAAC 'A' Grade · Kalady, Kerala
        </div>
      </div>

      <div style={{ width: 200, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 40, fontWeight: 700, color: '#0A0A0A', lineHeight: 1 }}>{time}</span>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 500, color: '#525252' }}>{date}</span>
        <StatusDot label="Online" style={{ marginTop: 2 }} />
      </div>
    </header>
  );
}
