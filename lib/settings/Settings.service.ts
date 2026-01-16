'use client';

import { getSettingsCollection } from './Settings.collection';
import { settingsFromDocument } from './Settings.mapper';
import {
    Settings,
    SettingsCategory,
    DEFAULT_SETTINGS_BY_CATEGORY,
} from './Settings.model';

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getSettingsByCategory({ category }: { category: SettingsCategory }): Promise<Settings | null> {
    const collection = getSettingsCollection();
    const result = await collection.find({ query: { category } });

    if (result.error || !result.documents?.length) {
        return getDefaultSettings({ category });
    }

    return settingsFromDocument(result.documents[0]);
}

export async function getAllSettings(): Promise<Settings[]> {
    const collection = getSettingsCollection();
    const result = await collection.find({ query: {} });

    if (result.error || !result.documents?.length) {
        return [];
    }

    return result.documents.map(settingsFromDocument);
}

// ─── MUTATIONS ───────────────────────────────────────────────────────────────

export async function updateSettingsByCategory({
    category,
    updates,
}: {
    category: SettingsCategory;
    updates: Partial<Settings>;
}): Promise<Settings | null> {
    const collection = getSettingsCollection();
    const existing = await collection.find({ query: { category } });

    if (existing.documents?.length) {
        const result = await collection.updateOne(existing.documents[0]._id, {
            ...updates,
            category,
        });

        if (result.error || !result.document) {
            console.error('Erro ao atualizar settings:', result.error);
            return null;
        }

        return settingsFromDocument(result.document);
    }

    // Criar novo se não existir
    const result = await collection.insertOne({
        ...DEFAULT_SETTINGS_BY_CATEGORY[category],
        ...updates,
        category,
    });

    if (result.error || !result.document) {
        console.error('Erro ao criar settings:', result.error);
        return null;
    }

    return settingsFromDocument(result.document);
}

export async function resetSettingsByCategory({ category }: { category: SettingsCategory }): Promise<Settings | null> {
    const defaults = DEFAULT_SETTINGS_BY_CATEGORY[category];
    if (!defaults) return null;

    return updateSettingsByCategory({ category, updates: defaults });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getDefaultSettings({ category }: { category: SettingsCategory }): Settings {
    const defaults = DEFAULT_SETTINGS_BY_CATEGORY[category];
    return { _id: '', ...defaults } as Settings;
}
