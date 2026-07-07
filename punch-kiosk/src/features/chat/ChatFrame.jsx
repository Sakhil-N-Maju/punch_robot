import React from 'react';
import { MessageBubble } from '../../components/feedback/MessageBubble.jsx';
import { SearchField } from '../../components/forms/SearchField.jsx';
import { IconButton } from '../../components/core/IconButton.jsx';
import { Icon } from '../../components/core/Icon.jsx';
import { Tag } from '../../components/feedback/Tag.jsx';
import { Chip } from '../../components/feedback/Chip.jsx';
import { OnScreenKeyboard } from './OnScreenKeyboard.jsx';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition.js';
import { getResponse, SUGGESTED_QUESTIONS } from '../../data/chatEngine.js';

const TYPING_DELAY_MS = 550;

function ChatHeader({ onBack }) {
  return (
    <header style={{
      height: 120, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', borderBottom: '1px solid #E5E5E5', background: '#FFFFFF', zIndex: 2,
    }}>
      {/* minHeight 48: comfortably above the 44px touch-target floor */}
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px 12px 8px', minHeight: 48, borderRadius: 12 }}>
        <Icon name="arrow-left" size={22} color="#525252" />
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 500, color: '#525252' }}>Back</span>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 48, height: 48, borderRadius: '50%', background: '#F0FDFA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="sparkles" size={24} color="#14B8A6" anim="sparkleTwinkle" />
        </span>
        <div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: '#0A0A0A' }}>Ask Punch</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#737373' }}>AI Receptionist · ASIET, Kalady</div>
        </div>
      </div>
      <Tag variant="turquoise" style={{ borderRadius: 8 }}>AI</Tag>
    </header>
  );
}

function EmptyState({ onAsk }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: 8 }}>
      <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #F0FDFA, #ECFEFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Icon name="sparkles" size={56} color="#14B8A6" anim="sparkleTwinkle" />
      </div>
      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 38, fontWeight: 800, color: '#0A0A0A', margin: 0 }}>Hi, I'm Punch!</h2>
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 19, color: '#525252', marginBottom: 28 }}>Your AI guide to ASIET, Kalady</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 760 }}>
        {SUGGESTED_QUESTIONS.map((c) => (
          <Chip key={c.label} label={c.label} icon={c.icon} variant="box" onClick={() => onAsk(c.label)} />
        ))}
      </div>
    </div>
  );
}

export function ChatFrame({ onBack, initialQuery = '' }) {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);
  const scrollRef = React.useRef(null);

  const sendMessage = React.useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: 'punch', text: getResponse(trimmed) }]);
      setTyping(false);
    }, TYPING_DELAY_MS);
  }, []);

  const speech = useSpeechRecognition({ onResult: (transcript) => sendMessage(transcript) });

  // Lets the home screen's search bar feel instant: a query typed there
  // arrives here pre-filled and gets sent the moment this frame mounts.
  // Guarded with a ref (not just an empty dep array) because StrictMode
  // double-invokes mount effects in dev, which would otherwise send it twice.
  const sentInitialQuery = React.useRef(false);
  React.useEffect(() => {
    if (initialQuery && !sentInitialQuery.current) {
      sentInitialQuery.current = true;
      sendMessage(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  return (
    <div style={{
      width: 1080, height: 1920, background: '#FFFFFF', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative',
    }}>
      <ChatHeader onBack={onBack} />

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
        {messages.length === 0
          ? <EmptyState onAsk={sendMessage} />
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'flex-end', minHeight: '100%' }}>
              {messages.map((m, i) => <MessageBubble key={i} role={m.role} text={m.text} />)}
              {typing && <MessageBubble role="punch" typing />}
            </div>
          )}
      </div>

      <footer style={{ height: 120, flex: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '0 32px', borderTop: '1px solid #E5E5E5', background: '#FFFFFF', position: 'relative', zIndex: 2 }}>
        <div style={{ flex: 1 }}>
          <SearchField
            placeholder="Ask Punch anything..."
            showIcon={false}
            value={input}
            onChange={setInput}
            onFocus={() => setKeyboardOpen(true)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input); }}
          />
        </div>
        {speech.isSupported && (
          <IconButton
            icon="mic"
            size={60}
            variant={speech.listening ? 'solid' : 'flat'}
            active={speech.listening}
            pulse={speech.listening}
            ariaLabel="Voice input"
            onClick={() => (speech.listening ? speech.stop() : speech.start())}
            style={{ flex: 'none' }}
          />
        )}
        <IconButton icon="send" size={60} active={input.trim().length > 0} ariaLabel="Send" onClick={() => sendMessage(input)} style={{ flex: 'none' }} />
      </footer>

      {keyboardOpen && (
        <OnScreenKeyboard
          value={input}
          onChange={setInput}
          onEnter={() => sendMessage(input)}
          onClose={() => setKeyboardOpen(false)}
        />
      )}
    </div>
  );
}
