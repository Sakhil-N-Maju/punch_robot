import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useSpeechRecognition — thin wrapper over the browser's Web Speech API.
 * Returns isSupported=false on browsers/embedded webviews without it (common
 * on locked-down kiosk builds) so callers can fall back to the on-screen
 * keyboard instead of showing a dead mic button.
 */
export function useSpeechRecognition({ onResult } = {}) {
  const RecognitionClass = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null;
  const isSupported = !!RecognitionClass;

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!isSupported) return;
    const recognition = new RecognitionClass();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      onResult && onResult(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, [isSupported, onResult]);

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    setListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      setListening(false);
    }
  }, [listening]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { isSupported, listening, start, stop };
}
