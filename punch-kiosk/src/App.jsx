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

export function App() {
  const frameRef = useKioskScale();
  const [view, setView] = React.useState('home'); // 'home' | 'chat' | panel key
  const [pendingQuery, setPendingQuery] = React.useState('');

  const goHome = () => setView('home');
  const openChat = (query = '') => { setPendingQuery(query); setView('chat'); };
  const openPanel = (key) => (key === 'chat' ? openChat() : setView(key));

  const PanelComponent = PANELS[view];

  return (
    <div id="punch-stage">
      <div id="punch-frame" ref={frameRef}>
        <div className="punch-layer" style={{ zIndex: 1 }}>
          <HomeFrame onOpenPanel={openPanel} onOpenChat={openChat} />
        </div>

        {view === 'chat' && (
          <div className="punch-layer" style={{ zIndex: 2, animation: 'slideUpIn 0.42s cubic-bezier(0.4,0,0.2,1) both' }}>
            <ChatFrame onBack={goHome} initialQuery={pendingQuery} />
          </div>
        )}

        {PanelComponent && (
          <div className="punch-layer" style={{ zIndex: 2, animation: 'slideUpIn 0.42s cubic-bezier(0.4,0,0.2,1) both' }}>
            <PanelComponent onBack={goHome} onAskPunch={openChat} />
          </div>
        )}
      </div>
    </div>
  );
}
