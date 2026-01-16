"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import Button from "./Button";

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hue, setHue] = useState(210);
    const [saturation, setSaturation] = useState(100);
    const [lightness, setLightness] = useState(50);
    const [hexInput, setHexInput] = useState(value);
    const [previewColor, setPreviewColor] = useState(value);

    const containerRef = useRef<HTMLDivElement>(null);
    const saturationRef = useRef<HTMLDivElement>(null);
    const hueRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setHexInput(value);
            setPreviewColor(value);
            const hsl = hexToHsl(value);
            if (hsl) {
                setHue(hsl.h);
                setSaturation(hsl.s);
                setLightness(hsl.l);
            }
        }
    }, [isOpen, value]);

    useEffect(() => {
        const color = hslToHex(hue, saturation, lightness);
        setPreviewColor(color);
        setHexInput(color);
    }, [hue, saturation, lightness]);

    function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return null;

        let r = parseInt(result[1], 16) / 255;
        let g = parseInt(result[2], 16) / 255;
        let b = parseInt(result[3], 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hslToHex(h: number, s: number, l: number): string {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    function updateSaturationFromEvent(e: MouseEvent | React.MouseEvent) {
        if (!saturationRef.current) return;
        const rect = saturationRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        setSaturation(Math.round((x / rect.width) * 100));
        setLightness(Math.round(100 - (y / rect.height) * 100));
    }

    function updateHueFromEvent(e: MouseEvent | React.MouseEvent) {
        if (!hueRef.current) return;
        const rect = hueRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setHue(Math.round((x / rect.width) * 360));
    }

    function handleSaturationMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        updateSaturationFromEvent(e);

        const onMove = (ev: MouseEvent) => updateSaturationFromEvent(ev);
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    function handleHueMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        updateHueFromEvent(e);

        const onMove = (ev: MouseEvent) => updateHueFromEvent(ev);
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    function handleApply() {
        onChange(previewColor);
        setIsOpen(false);
    }

    function handleHexChange(val: string) {
        setHexInput(val);
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            const hsl = hexToHsl(val);
            if (hsl) {
                setHue(hsl.h);
                setSaturation(hsl.s);
                setLightness(hsl.l);
            }
        }
    }

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 via-green-500 to-blue-500 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
            >
                <span className="text-white text-lg font-bold drop-shadow">+</span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-card border-2 border-border rounded-xl shadow-2xl shadow-black/50 w-64 p-4 space-y-3">
                    {/* Saturation/Lightness */}
                    <div
                        ref={saturationRef}
                        onMouseDown={handleSaturationMouseDown}
                        className="relative w-full h-32 rounded-lg cursor-crosshair select-none"
                        style={{
                            background: `linear-gradient(to bottom, white, transparent, black), linear-gradient(to right, gray, hsl(${hue}, 100%, 50%))`,
                        }}
                    >
                        <div
                            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{
                                left: `${saturation}%`,
                                top: `${100 - lightness}%`,
                                backgroundColor: previewColor,
                            }}
                        />
                    </div>

                    {/* Hue Slider */}
                    <div
                        ref={hueRef}
                        onMouseDown={handleHueMouseDown}
                        className="relative w-full h-3 rounded-lg cursor-pointer select-none"
                        style={{
                            background: `linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
                        }}
                    >
                        <div
                            className="absolute w-3 h-3 border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none"
                            style={{
                                left: `${(hue / 360) * 100}%`,
                                backgroundColor: `hsl(${hue}, 100%, 50%)`,
                            }}
                        />
                    </div>

                    {/* Preview & Hex */}
                    <div className="flex items-center gap-2">
                        <div
                            className="w-10 h-10 rounded-lg border border-border"
                            style={{ backgroundColor: previewColor }}
                        />
                        <input
                            type="text"
                            value={hexInput.toUpperCase()}
                            onChange={(e) => handleHexChange(e.target.value)}
                            className="flex-1 px-2 py-1.5 bg-background border border-border rounded-lg font-mono text-xs text-foreground uppercase"
                            maxLength={7}
                        />
                    </div>

                    {/* Apply Button */}
                    <Button onClick={handleApply} size="sm" className="w-full">
                        Aplicar
                    </Button>
                </div>
            )}
        </div>
    );
}
