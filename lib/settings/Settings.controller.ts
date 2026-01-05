import * as SettingsService from './Settings.service';
import type { Settings } from './Settings.model';

interface SettingsControllerProps {
    id?: string;
    color?: string;
    updates?: Partial<Settings>;
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<Settings | null> {
    return SettingsService.getSettings();
}

export async function getOrCreateSettings(): Promise<Settings> {
    return SettingsService.getOrCreateSettings();
}

export async function updateSettings({ id, updates }: SettingsControllerProps): Promise<Settings | null> {
    return SettingsService.updateSettings({ id, updates });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export async function updatePrimaryColor({ color }: SettingsControllerProps): Promise<Settings | null> {
    return SettingsService.updatePrimaryColor({ color });
}

export async function updateSiteInfo({ updates }: SettingsControllerProps): Promise<Settings | null> {
    return SettingsService.updateSiteInfo({ updates });
}
