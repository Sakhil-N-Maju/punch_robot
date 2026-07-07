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

  // Callers pass inline arrows for onResult; keeping it in a ref (instead of
  // in the effect deps) stops the recognizer being torn down and recreated on
  // every render — which could abort a capture mid-sentence.
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; });

  useEffect(() => {
    if (!isSupported) return;
    const recognition = new RecognitionClass();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      onResultRef.current && onResultRef.current(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported]);

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
