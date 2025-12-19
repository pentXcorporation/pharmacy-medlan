'use client';

import { useEffect, useState } from 'react';

let announceTimeout: NodeJS.Timeout;

export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const event = new CustomEvent('announce', { detail: { message, priority } });
  window.dispatchEvent(event);
};

export function LiveRegion() {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  useEffect(() => {
    const handleAnnounce = (e: Event) => {
      const { message, priority } = (e as CustomEvent).detail;
      
      clearTimeout(announceTimeout);
      
      if (priority === 'assertive') {
        setAssertiveMessage(message);
        announceTimeout = setTimeout(() => setAssertiveMessage(''), 1000);
      } else {
        setPoliteMessage(message);
        announceTimeout = setTimeout(() => setPoliteMessage(''), 1000);
      }
    };

    window.addEventListener('announce', handleAnnounce);
    return () => window.removeEventListener('announce', handleAnnounce);
  }, []);

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </>
  );
}
