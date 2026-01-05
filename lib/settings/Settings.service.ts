import { getSettingsCollection } from './Settings.collection';
import { settingsFromDocument } from './Settings.mapper';
import { Settings, DEFAULT_SETTINGS } from './Settings.model';

interface SettingsParametersProps {
    id?: string;
    color?: string;
    updates?: Partial<Settings>;
}

let cachedSettingsId: string | null = null;

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<Settings | null> {
    const settings = getSettingsCollection();
    const result = await settings.find();
    if (result.error || !result.documents || result.documents.length === 0) {
        return null;
    }
    const doc = result.documents[0];
    cachedSettingsId = doc._id;
    return settingsFromDocument(doc);
}

export async function getOrCreateSettings(): Promise<Settings> {
    const existing = await getSettings();
    if (existing) return existing;

    // Double-check (race condition)
    const settings = getSettingsCollection();
    const checkResult = await settings.find();
    if (!checkResult.error && checkResult.documents && checkResult.documents.length > 0) {
        const doc = checkResult.documents[0];
        cachedSettingsId = doc._id;
        return settingsFromDocument(doc);
    }

    const result = await settings.insertOne(DEFAULT_SETTINGS as any);
    if (result.error || !result.document) {
        throw new Error(result.errorMsg || 'Failed to create settings');
    }
    cachedSettingsId = result.document._id;
    return settingsFromDocument(result.document);
}

export async function updateSettings({ id, updates }: SettingsParametersProps): Promise<Settings | null> {
    if (!updates) return null;
    const settings = getSettingsCollection();
    const result = await settings.updateOne(id!, updates);
    if (result.error) return null;
    return getSettings();
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export async function updatePrimaryColor({ color }: SettingsParametersProps): Promise<Settings | null> {
    const current = await getOrCreateSettings();
    return updateSettings({ id: current._id, updates: { primaryColor: color } });
}

export async function updateSiteInfo({ updates }: SettingsParametersProps): Promise<Settings | null> {
    const current = await getOrCreateSettings();
    return updateSettings({ id: current._id, updates });
}

export function getCachedSettingsId(): string | null {
    return cachedSettingsId;
}
