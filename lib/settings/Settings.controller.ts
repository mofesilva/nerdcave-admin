'use client';

import * as SettingsService from './Settings.service';
import type { Settings, SettingsCategory } from './Settings.model';

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getSettingsByCategory({ category }: { category: SettingsCategory }): Promise<Settings | null> {
    return SettingsService.getSettingsByCategory({ category });
}

export async function getAllSettings(): Promise<Settings[]> {
    return SettingsService.getAllSettings();
}

// ─── MUTATIONS ───────────────────────────────────────────────────────────────

export async function updateSettingsByCategory({
    category,
    updates,
}: {
    category: SettingsCategory;
    updates: Partial<Settings>;
}): Promise<Settings | null> {
    return SettingsService.updateSettingsByCategory({ category, updates });
}

export async function resetSettingsByCategory({ category }: { category: SettingsCategory }): Promise<Settings | null> {
    return SettingsService.resetSettingsByCategory({ category });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getDefaultSettings({ category }: { category: SettingsCategory }): Settings {
    return SettingsService.getDefaultSettings({ category });
}
