import * as ThemeSettingsService from './ThemeSettings.service';
import type { ThemeSettings, ThemeType } from './ThemeSettings.model';

interface ThemeSettingsControllerProps {
    id?: string;
    updates?: Partial<ThemeSettings>;
    themeType?: ThemeType;
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getThemeSettings(themeType: ThemeType = 'admin'): Promise<ThemeSettings | null> {
    return ThemeSettingsService.getThemeSettings(themeType);
}

export async function getOrCreateThemeSettings(themeType: ThemeType = 'admin'): Promise<ThemeSettings> {
    return ThemeSettingsService.getOrCreateThemeSettings(themeType);
}

export async function updateThemeSettings({ id, updates }: ThemeSettingsControllerProps): Promise<ThemeSettings | null> {
    return ThemeSettingsService.updateThemeSettings({ id, updates });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export async function updateThemeSettingsInfo({ updates, themeType = 'admin' }: ThemeSettingsControllerProps): Promise<ThemeSettings | null> {
    return ThemeSettingsService.updateThemeSettingsInfo({ updates, themeType });
}
