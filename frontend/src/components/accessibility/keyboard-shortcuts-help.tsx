'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const shortcuts = [
    { keys: 'Alt + D', action: 'Go to Dashboard' },
    { keys: 'Alt + P', action: 'Go to POS' },
    { keys: 'Alt + I', action: 'Go to Inventory' },
    { keys: 'Alt + S', action: 'Go to Sales' },
    { keys: 'Alt + /', action: 'Focus search' },
    { keys: 'Esc', action: 'Close dialog' },
    { keys: 'Shift + ?', action: 'Show shortcuts' },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 z-50"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {shortcuts.map((shortcut, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="text-sm">{shortcut.action}</span>
                <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 border border-gray-300 rounded">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
