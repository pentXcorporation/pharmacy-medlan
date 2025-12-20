'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Accessibility, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  Contrast, 
  Eye,
  MousePointer2,
  Keyboard,
  Volume2,
  X
} from 'lucide-react';

export function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [largePointer, setLargePointer] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [textSpacing, setTextSpacing] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${fontSize}%`;
    
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (largePointer) {
      root.classList.add('large-pointer');
    } else {
      root.classList.remove('large-pointer');
    }

    if (textSpacing) {
      root.classList.add('text-spacing');
    } else {
      root.classList.remove('text-spacing');
    }
  }, [fontSize, highContrast, largePointer, textSpacing]);

  useEffect(() => {
    if (!readingGuide) return;

    const guide = document.createElement('div');
    guide.className = 'reading-guide';
    document.body.appendChild(guide);

    const handleMouseMove = (e: MouseEvent) => {
      guide.style.top = `${e.clientY}px`;
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      guide.remove();
    };
  }, [readingGuide]);

  const resetAll = () => {
    setFontSize(100);
    setHighContrast(false);
    setLargePointer(false);
    setReadingGuide(false);
    setTextSpacing(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 z-50"
        aria-label="Accessibility options"
        title="Accessibility Toolbar"
      >
        <Accessibility className="w-5 h-5" />
      </button>

      {open && (
        <Card className="fixed bottom-32 right-4 w-80 p-4 shadow-2xl z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              Accessibility
            </h3>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {/* Font Size */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Type className="w-4 h-4" />
                Text Size: {fontSize}%
              </label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                  disabled={fontSize <= 80}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(100)}
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(Math.min(200, fontSize + 10))}
                  disabled={fontSize >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* High Contrast */}
            <Button
              variant={highContrast ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setHighContrast(!highContrast)}
            >
              <Contrast className="w-4 h-4 mr-2" />
              High Contrast
            </Button>

            {/* Large Pointer */}
            <Button
              variant={largePointer ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setLargePointer(!largePointer)}
            >
              <MousePointer2 className="w-4 h-4 mr-2" />
              Large Cursor
            </Button>

            {/* Reading Guide */}
            <Button
              variant={readingGuide ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setReadingGuide(!readingGuide)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Reading Guide
            </Button>

            {/* Text Spacing */}
            <Button
              variant={textSpacing ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setTextSpacing(!textSpacing)}
            >
              <Type className="w-4 h-4 mr-2" />
              Text Spacing
            </Button>

            {/* Screen Reader */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const msg = new SpeechSynthesisUtterance('Screen reader test. Accessibility features are active.');
                window.speechSynthesis.speak(msg);
              }}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Test Screen Reader
            </Button>

            {/* Keyboard Nav */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const firstInput = document.querySelector<HTMLElement>('input, button, a');
                firstInput?.focus();
              }}
            >
              <Keyboard className="w-4 h-4 mr-2" />
              Focus First Element
            </Button>

            {/* Reset */}
            <Button
              variant="destructive"
              className="w-full"
              onClick={resetAll}
            >
              Reset All
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
