'use client';

import * as SettingsService from './Settings.service';
import type { AdminThemeSetting, SystemSetting } from './Settings.model';
import type { ThemeMode, SystemCategory } from './Settings.types';

// ─── THEME SETTING QUERIES ───────────────────────────────────────────────────

export async function getThemeSettingByMode({ themeMode }: { themeMode: ThemeMode }): Promise<AdminThemeSetting | null> {
    return SettingsService.getThemeSettingByMode({ themeMode });
}

export async function getOrCreateThemeSettingByMode({ themeMode }: { themeMode: ThemeMode }): Promise<AdminThemeSetting> {
    return SettingsService.getOrCreateThemeSettingByMode({ themeMode });
}

export async function getAllAdminThemeSettings(): Promise<{ light: AdminThemeSetting; dark: AdminThemeSetting }> {
    return SettingsService.getAllAdminThemeSettings();
}

// ─── THEME SETTING MUTATIONS ─────────────────────────────────────────────────

export async function updateThemeSetting({ id, updates }: { id: string; updates: Partial<AdminThemeSetting> }): Promise<AdminThemeSetting | null> {
    return SettingsService.updateThemeSetting({ id, updates });
}

export async function resetThemeSetting({ themeMode }: { themeMode: ThemeMode }): Promise<AdminThemeSetting> {
    return SettingsService.resetThemeSetting({ themeMode });
}

// ─── SYSTEM SETTING QUERIES ──────────────────────────────────────────────────

export async function getSystemSetting({ category }: { category: SystemCategory }): Promise<SystemSetting | null> {
    return SettingsService.getSystemSetting({ category });
}

export async function getAllSystemSettings(): Promise<SystemSetting[]> {
    return SettingsService.getAllSystemSettings();
}

// ─── SYSTEM SETTING MUTATIONS ────────────────────────────────────────────────

export async function updateSystemSetting({
    category,
    updates,
}: {
    category: SystemCategory;
    updates: Partial<SystemSetting>;
}): Promise<SystemSetting | null> {
    return SettingsService.updateSystemSetting({ category, updates });
}

export async function resetSystemSetting({ category }: { category: SystemCategory }): Promise<SystemSetting | null> {
    return SettingsService.resetSystemSetting({ category });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getDefaultSystemSetting({ category }: { category: SystemCategory }): SystemSetting {
    return SettingsService.getDefaultSystemSetting({ category });
}
