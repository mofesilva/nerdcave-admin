'use client';

import { getSettingsCollection } from './Settings.collection';
import { adminThemeSettingFromDocument, systemSettingFromDocument } from './Settings.mapper';
import {
    AdminThemeSetting,
    SystemSetting,
    DEFAULT_ADMIN_THEME_LIGHT,
    DEFAULT_ADMIN_THEME_DARK,
    DEFAULT_SYSTEM_SETTINGS_BY_CATEGORY,
} from './Settings.model';
import type { ThemeMode, SystemCategory } from './Settings.types';
import { toSnakeCaseKeys } from '../utils';

// ─── THEME SETTING QUERIES ───────────────────────────────────────────────────

export async function getThemeSettingByMode({ themeMode }: { themeMode: ThemeMode }): Promise<AdminThemeSetting | null> {
    const collection = getSettingsCollection();
    const result = await collection.find({ query: { type: 'theme', domain: 'admin', theme_mode: themeMode } });

    if (result.error || !result.documents?.length) {
        return null;
    }

    return adminThemeSettingFromDocument(result.documents[0]);
}

export async function getOrCreateThemeSettingByMode({ themeMode }: { themeMode: ThemeMode }): Promise<AdminThemeSetting> {
    const existing = await getThemeSettingByMode({ themeMode });
    if (existing) return existing;

    const collection = getSettingsCollection();
    const defaults = themeMode === 'light' ? DEFAULT_ADMIN_THEME_LIGHT : DEFAULT_ADMIN_THEME_DARK;
    const snakeCaseData = toSnakeCaseKeys(defaults as Record<string, unknown>);
    const result = await collection.insertOne(snakeCaseData as any);

    if (result.error || !result.document) {
        console.warn(`[Settings] Could not create theme setting for ${themeMode}. Using defaults.`);
        return { _id: '', ...defaults } as AdminThemeSetting;
    }

    return adminThemeSettingFromDocument(result.document);
}

export async function getAllAdminThemeSettings(): Promise<{ light: AdminThemeSetting; dark: AdminThemeSetting }> {
    const [light, dark] = await Promise.all([
        getOrCreateThemeSettingByMode({ themeMode: 'light' }),
        getOrCreateThemeSettingByMode({ themeMode: 'dark' }),
    ]);
    return { light, dark };
}

// ─── THEME SETTING MUTATIONS ─────────────────────────────────────────────────

export async function updateThemeSetting({ id, updates }: { id: string; updates: Partial<AdminThemeSetting> }): Promise<AdminThemeSetting | null> {
    if (!id || !updates) {
        console.error('[Settings] updateThemeSetting: id and updates are required');
        return null;
    }

    const collection = getSettingsCollection();

    // Remove campos undefined para não sobrescrever com null
    const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    const snakeCaseUpdates = toSnakeCaseKeys(cleanUpdates as Record<string, unknown>);
    const result = await collection.updateOne(id, snakeCaseUpdates);

    if (result.error) {
        console.error('[Settings] updateThemeSetting error:', result.error);
        return null;
    }

    const themeMode = updates.themeMode || 'dark';
    return getThemeSettingByMode({ themeMode });
}

export async function resetThemeSetting({ themeMode }: { themeMode: ThemeMode }): Promise<AdminThemeSetting> {
    const collection = getSettingsCollection();

    // Busca o registro existente
    const existing = await getThemeSettingByMode({ themeMode });

    if (existing && existing._id) {
        // Deleta o existente
        await collection.deleteOne(existing._id);
    }

    // Cria novo com defaults completos
    return getOrCreateThemeSettingByMode({ themeMode });
}

// ─── SYSTEM SETTING QUERIES ──────────────────────────────────────────────────

export async function getSystemSetting({ category }: { category: SystemCategory }): Promise<SystemSetting | null> {
    const collection = getSettingsCollection();
    const result = await collection.find({ query: { type: 'system', category } });

    if (result.error || !result.documents?.length) {
        return getDefaultSystemSetting({ category });
    }

    return systemSettingFromDocument(result.documents[0]);
}

export async function getAllSystemSettings(): Promise<SystemSetting[]> {
    const collection = getSettingsCollection();
    const result = await collection.find({ query: { type: 'system' } });

    if (result.error || !result.documents?.length) {
        return [];
    }

    return result.documents.map(systemSettingFromDocument);
}

// ─── SYSTEM SETTING MUTATIONS ────────────────────────────────────────────────

export async function updateSystemSetting({
    category,
    updates,
}: {
    category: SystemCategory;
    updates: Partial<SystemSetting>;
}): Promise<SystemSetting | null> {
    const collection = getSettingsCollection();
    const existing = await collection.find({ query: { type: 'system', category } });

    if (existing.documents?.length) {
        const result = await collection.updateOne(existing.documents[0]._id, {
            ...updates,
            type: 'system',
            category,
        });

        if (result.error || !result.document) {
            console.error('[Settings] updateSystemSetting error:', result.error);
            return null;
        }

        return systemSettingFromDocument(result.document);
    }

    // Criar novo se não existir
    const defaults = DEFAULT_SYSTEM_SETTINGS_BY_CATEGORY[category];
    const result = await collection.insertOne({
        ...defaults,
        ...updates,
        type: 'system',
        category,
    });

    if (result.error || !result.document) {
        console.error('[Settings] createSystemSetting error:', result.error);
        return null;
    }

    return systemSettingFromDocument(result.document);
}

export async function resetSystemSetting({ category }: { category: SystemCategory }): Promise<SystemSetting | null> {
    const defaults = DEFAULT_SYSTEM_SETTINGS_BY_CATEGORY[category];
    if (!defaults) return null;

    return updateSystemSetting({ category, updates: defaults });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getDefaultSystemSetting({ category }: { category: SystemCategory }): SystemSetting {
    const defaults = DEFAULT_SYSTEM_SETTINGS_BY_CATEGORY[category];
    return { _id: '', ...defaults } as SystemSetting;
}
