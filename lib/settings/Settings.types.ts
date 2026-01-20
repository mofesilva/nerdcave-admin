import type { Media } from "@/lib/medias/Media.model";

// ─── SETTING TYPE ────────────────────────────────────────────────────────────

export type SettingType = 'theme' | 'system';

// ─── THEME SETTINGS ──────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark';
export type ThemeMedia = Record<string, Media | undefined>;

// ─── SYSTEM SETTINGS ─────────────────────────────────────────────────────────

export type SystemCategory = 'general' | 'content' | 'uploads' | 'notifications' | 'security' | 'layout';
