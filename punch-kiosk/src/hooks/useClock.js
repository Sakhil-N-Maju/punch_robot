import { useEffect, useState } from 'react';

const TIME_FMT = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
});
const DATE_FMT = new Intl.DateTimeFormat('en-IN', {
  weekday: 'long', day: '2-digit', month: 'long', timeZone: 'Asia/Kolkata',
});

/**
 * useClock — live IST clock for the kiosk header. Ticks once a minute (the UI
 * only ever shows minute precision), aligned to the next minute boundary so it
 * doesn't drift.
 */
export function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timeout;
    const tick = () => {
      setNow(new Date());
      const msToNextMinute = 60000 - (Date.now() % 60000);
      timeout = setTimeout(tick, msToNextMinute);
    };
    tick();
    return () => clearTimeout(timeout);
  }, []);

  return {
    now,
    time: TIME_FMT.format(now),
    date: DATE_FMT.format(now),
  };
}
