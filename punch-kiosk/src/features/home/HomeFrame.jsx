import React from 'react';
import { Atmosphere } from './Atmosphere.jsx';
import { Header } from './Header.jsx';
import { Greeting } from './Greeting.jsx';
import { QuickAccess } from './QuickAccess.jsx';
import { Carousel } from './Carousel.jsx';
import { AssistantBar } from './AssistantBar.jsx';
import { OnScreenKeyboard } from '../chat/OnScreenKeyboard.jsx';

/**
 * HomeFrame — Frame A. The default kiosk state: 5 stacked zones filling
 * 1080x1920 (192 + 340 + 660 + 536 + 192).
 */
export function HomeFrame({ onOpenPanel, onOpenChat }) {
  const [now] = React.useState(() => new Date());
  const [searchValue, setSearchValue] = React.useState('');
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);

  const submitSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setKeyboardOpen(false);
    setSearchValue('');
    onOpenChat(trimmed);
  };

  return (
    <div style={{
      width: 1080, height: 1920, background: '#FFFFFF', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative',
    }}>
      <Atmosphere intensity={55} motion />
      <Header />
      <Greeting onOpenPanel={onOpenPanel} now={now} />
      <QuickAccess onOpenPanel={onOpenPanel} />
      <Carousel onOpenPanel={onOpenPanel} />
      <AssistantBar
        value={searchValue}
        onChange={setSearchValue}
        onFocus={() => setKeyboardOpen(true)}
        onSubmit={submitSearch}
        onMic={() => onOpenChat()}
      />

      {keyboardOpen && (
        <OnScreenKeyboard
          value={searchValue}
          onChange={setSearchValue}
          onEnter={() => submitSearch(searchValue)}
          onClose={() => setKeyboardOpen(false)}
        />
      )}
    </div>
  );
}
