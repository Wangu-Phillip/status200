import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ZoomIn, ZoomOut, Eye, Contrast, Type } from 'lucide-react';

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [largeText]);

  const increaseFontSize = () => {
    if (fontSize < 150) setFontSize(fontSize + 10);
  };

  const decreaseFontSize = () => {
    if (fontSize > 70) setFontSize(fontSize - 10);
  };

  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setLargeText(false);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {/* Accessibility Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 shadow-lg bg-teal-600 hover:bg-teal-700 text-white"
        aria-label="Accessibility options"
        aria-expanded={isOpen}
      >
        <Eye className="h-6 w-6" />
      </Button>

      {/* Accessibility Menu */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 shadow-2xl">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Accessibility Options</h3>
            
            {/* Font Size Controls */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Text Size</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 70}
                  aria-label="Decrease text size"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="flex-1 text-center text-sm font-medium">{fontSize}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 150}
                  aria-label="Increase text size"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="mb-4">
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                  highContrast
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                role="switch"
                aria-checked={highContrast}
                aria-label="Toggle high contrast mode"
              >
                <div className="flex items-center gap-2">
                  <Contrast className="h-5 w-5" />
                  <span className="font-medium text-sm">High Contrast</span>
                </div>
                <div
                  className={`w-10 h-6 rounded-full transition-colors ${
                    highContrast ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                      highContrast ? 'ml-5' : 'ml-1'
                    }`}
                  ></div>
                </div>
              </button>
            </div>

            {/* Large Text Toggle */}
            <div className="mb-4">
              <button
                onClick={() => setLargeText(!largeText)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                  largeText
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                role="switch"
                aria-checked={largeText}
                aria-label="Toggle large text mode"
              >
                <div className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  <span className="font-medium text-sm">Large Text</span>
                </div>
                <div
                  className={`w-10 h-6 rounded-full transition-colors ${
                    largeText ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                      largeText ? 'ml-5' : 'ml-1'
                    }`}
                  ></div>
                </div>
              </button>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={resetSettings}
              aria-label="Reset accessibility settings"
            >
              Reset to Default
            </Button>

            {/* Keyboard Shortcuts Info */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Keyboard Shortcuts:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <kbd className="px-1 bg-gray-100 rounded">Ctrl+K</kbd> - Open search</li>
                <li>• <kbd className="px-1 bg-gray-100 rounded">Tab</kbd> - Navigate elements</li>
                <li>• <kbd className="px-1 bg-gray-100 rounded">Esc</kbd> - Close dialogs</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccessibilityMenu;
