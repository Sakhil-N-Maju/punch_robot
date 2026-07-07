import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * MessageBubble — a chat bubble. User bubbles are right-aligned turquoise
 * gradient; Punch bubbles are left-aligned white with a sparkles avatar.
 * Set typing to render the 3-dot typing indicator instead of text.
 */
export function MessageBubble({ role = 'punch', text, typing = false, style = {} }) {
  const isUser = role === 'user';

  const avatar = !isUser && (
    <span
      style={{
        flex: 'none', width: 36, height: 36, borderRadius: '50%',
        background: 'linear-gradient(135deg, #F0FDFA, #CCFBF1)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 2,
      }}
    >
      <Icon name="sparkles" size={18} color="#14B8A6" anim="sparkleTwinkle" />
    </span>
  );

  const bubbleBase = {
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontSize: 17,
    lineHeight: 1.55,
    animation: 'fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1)',
    whiteSpace: 'pre-wrap',
  };

  const userBubble = {
    ...bubbleBase,
    background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
    color: '#FFFFFF',
    borderRadius: '20px 20px 4px 20px',
    padding: '16px 22px',
    maxWidth: '75%',
  };

  const punchBubble = {
    ...bubbleBase,
    background: '#FFFFFF',
    color: '#0A0A0A',
    border: '1px solid #E5E5E5',
    borderRadius: '20px 20px 20px 4px',
    padding: typing ? '20px 22px' : '18px 22px',
    maxWidth: '82%',
  };

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-start', ...style }}>
      {avatar}
      <div style={isUser ? userBubble : punchBubble}>
        {typing ? (
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                width: 8, height: 8, borderRadius: '50%', background: '#A3A3A3', display: 'inline-block',
                animation: `typingDot 1.4s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </span>
        ) : text}
      </div>
    </div>
  );
}
