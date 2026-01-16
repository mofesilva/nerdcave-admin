import { getThemeSettingsCollection } from './ThemeSettings.collection';
import { themeSettingsFromDocument } from './ThemeSettings.mapper';
import { ThemeSettings, ThemeType, DEFAULT_ADMIN_THEME_SETTINGS, DEFAULT_BLOG_THEME_SETTINGS } from './ThemeSettings.model';
import { toSnakeCaseKeys } from '../utils';

interface ThemeSettingsParametersProps {
    id?: string;
    updates?: Partial<ThemeSettings>;
    themeType?: ThemeType;
}

const cachedIds: Record<ThemeType, string | null> = {
    admin: null,
    blog: null,
};

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getThemeSettings(themeType: ThemeType = 'admin'): Promise<ThemeSettings | null> {
    const settings = getThemeSettingsCollection();
    // Busca TODOS os documentos e filtra no código
    const result = await settings.find({});
    console.log('[ThemeSettings] getThemeSettings result:', { themeType, error: result.error, docsCount: result.documents?.length, docs: result.documents });
    if (result.error || !result.documents || result.documents.length === 0) {
        return null;
    }
    // Procura documento com theme_type correto ou sem theme_type (legado)
    const doc = result.documents.find((d: any) => d.theme_type === themeType || !d.theme_type) || result.documents[0];
    cachedIds[themeType] = doc._id;
    const mapped = themeSettingsFromDocument(doc);
    console.log('[ThemeSettings] Mapped settings:', mapped);
    return mapped;
}

export async function getOrCreateThemeSettings(themeType: ThemeType = 'admin'): Promise<ThemeSettings> {
    const existing = await getThemeSettings(themeType);
    if (existing) return existing;

    // Double-check (race condition)
    const settings = getThemeSettingsCollection();
    const checkResult = await settings.find({});
    if (!checkResult.error && checkResult.documents && checkResult.documents.length > 0) {
        const doc = checkResult.documents.find((d: any) => d.theme_type === themeType || !d.theme_type) || checkResult.documents[0];
        cachedIds[themeType] = doc._id;
        return themeSettingsFromDocument(doc);
    }

    // Tenta criar novo documento com os defaults corretos
    const defaults = themeType === 'admin' ? DEFAULT_ADMIN_THEME_SETTINGS : DEFAULT_BLOG_THEME_SETTINGS;
    const snakeCaseData = toSnakeCaseKeys(defaults as Record<string, unknown>);
    const result = await settings.insertOne(snakeCaseData as any);

    // Se não conseguir criar (sem permissão), retorna defaults sem salvar
    if (result.error || !result.document) {
        console.warn(`[ThemeSettings] Could not create ${themeType} settings (user may not have permission). Using defaults.`);
        return { _id: '', ...defaults } as ThemeSettings;
    }

    cachedIds[themeType] = result.document._id;
    return themeSettingsFromDocument(result.document);
}

export async function updateThemeSettings({ id, updates }: ThemeSettingsParametersProps): Promise<ThemeSettings | null> {
    if (!updates) return null;
    const settings = getThemeSettingsCollection();
    const snakeCaseUpdates = toSnakeCaseKeys(updates as Record<string, unknown>);
    const result = await settings.updateOne(id!, snakeCaseUpdates);
    if (result.error) return null;

    // Retorna o settings atualizado baseado no themeType do updates ou busca pelo id
    const themeType = updates.themeType || 'admin';
    return getThemeSettings(themeType);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export async function updateThemeSettingsInfo({ updates, themeType = 'admin' }: ThemeSettingsParametersProps): Promise<ThemeSettings | null> {
    const current = await getOrCreateThemeSettings(themeType);
    return updateThemeSettings({ id: current._id, updates });
}

export function getCachedThemeSettingsId(themeType: ThemeType = 'admin'): string | null {
    return cachedIds[themeType];
}
