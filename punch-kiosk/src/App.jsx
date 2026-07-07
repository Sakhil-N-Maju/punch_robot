import React from 'react';
import { HomeFrame } from './features/home/HomeFrame.jsx';
import { ChatFrame } from './features/chat/ChatFrame.jsx';
import { AcademicsPanel } from './features/detail/panels/AcademicsPanel.jsx';
import { CampusPanel } from './features/detail/panels/CampusPanel.jsx';
import { AboutPanel } from './features/detail/panels/AboutPanel.jsx';
import { EventsPanel } from './features/detail/panels/EventsPanel.jsx';
import { AdmissionsPanel } from './features/detail/panels/AdmissionsPanel.jsx';
import { useKioskScale } from './hooks/useKioskScale.js';

const PANELS = {
  academics: AcademicsPanel,
  campus: CampusPanel,
  about: AboutPanel,
  events: EventsPanel,
  admissions: AdmissionsPanel,
};

// Return to the Home attract screen (and drop any previous visitor's chat)
// after this long with no touches. Generous enough to read a long panel.
const IDLE_RESET_MS = 180000;

export function App() {
  const frameRef = useKioskScale();
  const [view, setView] = React.useState('home'); // 'home' | 'chat' | panel key
  const [pendingQuery, setPendingQuery] = React.useState('');
  // Overlay being dismissed — kept mounted (same element, no remount) while
  // slideDownOut plays, so Back gets a real exit transition.
  const [closing, setClosing] = React.useState(null);
  // Bumped on idle reset to remount HomeFrame (clears search text / keyboard).
  const [homeEpoch, setHomeEpoch] = React.useState(0);

  const goHome = () => {
    if (view !== 'home') setClosing(view);
    setView('home');
  };
  const openChat = (query = '') => { setClosing(null); setPendingQuery(query); setView('chat'); };
  const openPanel = (key) => {
    if (key === 'chat') return openChat();
    setClosing(null);
    setView(key);
  };

  // Idle reset: any touch re-arms the timer; on expiry snap straight to a
  // fresh Home (no exit animation — nobody is watching, and the next visitor
  // must never see the previous visitor's conversation).
  React.useEffect(() => {
    let timer;
    const reset = () => {
      setView('home');
      setClosing(null);
      setPendingQuery('');
      setHomeEpoch((e) => e + 1);
    };
    const arm = () => { clearTimeout(timer); timer = setTimeout(reset, IDLE_RESET_MS); };
    window.addEventListener('pointerdown', arm);
    arm();
    return () => { clearTimeout(timer); window.removeEventListener('pointerdown', arm); };
  }, []);

  // Backstop for the exit animation: if animationend never fires (e.g.
  // prefers-reduced-motion strips all animations), still unmount the overlay.
  React.useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => setClosing(null), 450);
    return () => clearTimeout(t);
  }, [closing]);

  // One overlay layer, keyed by which view it shows. When the user goes Home,
  // `view` flips but the key stays the same, so React keeps the element alive
  // and only the animation changes (slideUpIn -> slideDownOut).
  const overlayKey = view !== 'home' ? view : closing;
  const isClosing = view === 'home' && !!closing;
  const OverlayPanel = overlayKey && overlayKey !== 'chat' ? PANELS[overlayKey] : null;

  return (
    <div id="punch-stage">
      <div id="punch-frame" ref={frameRef}>
        <div className="punch-layer" style={{ zIndex: 1 }}>
          <HomeFrame key={homeEpoch} onOpenPanel={openPanel} onOpenChat={openChat} />
        </div>

        {overlayKey && (
          <div
            key={overlayKey}
            className="punch-layer"
            style={{
              zIndex: 2,
              animation: `${isClosing ? 'slideDownOut 0.36s' : 'slideUpIn 0.42s'} cubic-bezier(0.4,0,0.2,1) both`,
              pointerEvents: isClosing ? 'none' : 'auto',
            }}
            onAnimationEnd={isClosing ? () => setClosing(null) : undefined}
          >
            {overlayKey === 'chat'
              ? <ChatFrame onBack={goHome} initialQuery={pendingQuery} />
              : OverlayPanel && <OverlayPanel onBack={goHome} onAskPunch={openChat} />}
          </div>
        )}
      </div>
    </div>
  );
}
