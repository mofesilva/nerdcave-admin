"use client";
import { createCollection } from '@/lib/cappuccino/client';
import type { ThemeSettings } from './ThemeSettings.model';

export function getThemeSettingsCollection() {
    return createCollection<ThemeSettings>('themes');
}
