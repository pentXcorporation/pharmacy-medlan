/**
 * Accessibility Widget Component
 * Floating widget providing quick access to accessibility features
 */

import { useState, useEffect } from "react";
import {
  Accessibility,
  ZoomIn,
  ZoomOut,
  Eye,
  MousePointer2,
  Type,
  Sun,
  Moon,
  X,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Default accessibility settings
const defaultSettings = {
  fontSize: 100,
  highContrast: false,
  reduceMotion: false,
  largeText: false,
  highlightLinks: false,
  readableFont: false,
  cursorSize: "normal",
  darkMode: false,
};

const AccessibilityWidget = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("accessibility-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Apply settings to document
  const applySettings = (newSettings) => {
    const root = document.documentElement;

    // Font size
    root.style.fontSize = `${newSettings.fontSize}%`;

    // High contrast
    root.classList.toggle("high-contrast", newSettings.highContrast);

    // Reduce motion
    root.classList.toggle("reduce-motion", newSettings.reduceMotion);

    // Large text
    root.classList.toggle("large-text", newSettings.largeText);

    // Highlight links
    root.classList.toggle("highlight-links", newSettings.highlightLinks);

    // Readable font
    root.classList.toggle("readable-font", newSettings.readableFont);

    // Cursor size
    root.setAttribute("data-cursor-size", newSettings.cursorSize);

    // Dark mode
    if (newSettings.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // Apply settings on mount and when settings change
  useEffect(() => {
    applySettings(settings);
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
  }, [settings]);

  // Update a single setting
  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Reset all settings
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Quick font size adjustments
  const increaseFontSize = () => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + 10, 150),
    }));
  };

  const decreaseFontSize = () => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - 10, 80),
    }));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className={cn(
              "h-14 w-14 rounded-full shadow-lg transition-all hover:scale-110",
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            aria-label="Accessibility options"
          >
            <Accessibility className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0"
          align="end"
          side="top"
          sideOffset={16}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility
              </h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetSettings}
                  className="h-8 w-8"
                  title="Reset to defaults"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Text Size Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Text Size: {settings.fontSize}%
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={decreaseFontSize}
                    disabled={settings.fontSize <= 80}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateSetting("fontSize", value)}
                    min={80}
                    max={150}
                    step={5}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={increaseFontSize}
                    disabled={settings.fontSize >= 150}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Toggle Options */}
              <div className="space-y-3">
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm flex items-center gap-2 cursor-pointer">
                    {settings.darkMode ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                    Dark Mode
                  </Label>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                      updateSetting("darkMode", checked)
                    }
                  />
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm flex items-center gap-2 cursor-pointer">
                    <Eye className="h-4 w-4" />
                    High Contrast
                  </Label>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) =>
                      updateSetting("highContrast", checked)
                    }
                  />
                </div>

                {/* Reduce Motion */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm flex items-center gap-2 cursor-pointer">
                    <MousePointer2 className="h-4 w-4" />
                    Reduce Motion
                  </Label>
                  <Switch
                    checked={settings.reduceMotion}
                    onCheckedChange={(checked) =>
                      updateSetting("reduceMotion", checked)
                    }
                  />
                </div>

                {/* Highlight Links */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm flex items-center gap-2 cursor-pointer">
                    <span className="h-4 w-4 flex items-center justify-center font-bold underline text-xs">
                      A
                    </span>
                    Highlight Links
                  </Label>
                  <Switch
                    checked={settings.highlightLinks}
                    onCheckedChange={(checked) =>
                      updateSetting("highlightLinks", checked)
                    }
                  />
                </div>

                {/* Readable Font */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm flex items-center gap-2 cursor-pointer">
                    <Type className="h-4 w-4" />
                    Readable Font
                  </Label>
                  <Switch
                    checked={settings.readableFont}
                    onCheckedChange={(checked) =>
                      updateSetting("readableFont", checked)
                    }
                  />
                </div>

                {/* Large Cursor */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm flex items-center gap-2 cursor-pointer">
                    <MousePointer2 className="h-4 w-4" />
                    Large Cursor
                  </Label>
                  <Switch
                    checked={settings.cursorSize === "large"}
                    onCheckedChange={(checked) =>
                      updateSetting("cursorSize", checked ? "large" : "normal")
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="border-t bg-muted/50 p-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => updateSetting("fontSize", 80)}
              >
                Small
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => updateSetting("fontSize", 100)}
              >
                Normal
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => updateSetting("fontSize", 125)}
              >
                Large
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => updateSetting("fontSize", 150)}
              >
                XL
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccessibilityWidget;
