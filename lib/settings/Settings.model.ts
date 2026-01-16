export type SettingsCategory = 'general' | 'content' | 'uploads' | 'notifications' | 'security';

export type Settings = {
    _id: string;
    category: SettingsCategory;

    // General Settings
    siteName?: string;
    siteUrl?: string;
    adminEmail?: string;
    defaultLanguage?: string;
    timezone?: string;

    // Content Settings
    postsPerPage?: number;
    enableComments?: boolean;
    moderateComments?: boolean;
    enableDrafts?: boolean;
    autoSaveDrafts?: boolean;
    autoSaveIntervalSec?: number;

    // Upload Settings
    maxUploadSizeMb?: number;
    allowedFileTypes?: string[];
    imageQuality?: number;

    // Notifications Settings
    emailNotifications?: boolean;
    notifyOnNewComment?: boolean;
    notifyOnNewUser?: boolean;

    // Security Settings
    sessionTimeoutMinutes?: number;
    maxLoginAttempts?: number;
    requireEmailVerification?: boolean;
};

export const DEFAULT_GENERAL_SETTINGS: Omit<Settings, '_id'> = {
    category: 'general',
    siteName: 'NerdCave CMS',
    siteUrl: '',
    adminEmail: '',
    defaultLanguage: 'pt-BR',
    timezone: 'America/Sao_Paulo',
};

export const DEFAULT_CONTENT_SETTINGS: Omit<Settings, '_id'> = {
    category: 'content',
    postsPerPage: 10,
    enableComments: true,
    moderateComments: true,
    enableDrafts: true,
    autoSaveDrafts: true,
    autoSaveIntervalSec: 30,
};

export const DEFAULT_UPLOAD_SETTINGS: Omit<Settings, '_id'> = {
    category: 'uploads',
    maxUploadSizeMb: 10,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    imageQuality: 85,
};

export const DEFAULT_NOTIFICATION_SETTINGS: Omit<Settings, '_id'> = {
    category: 'notifications',
    emailNotifications: true,
    notifyOnNewComment: true,
    notifyOnNewUser: true,
};

export const DEFAULT_SECURITY_SETTINGS: Omit<Settings, '_id'> = {
    category: 'security',
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    requireEmailVerification: false,
};

export const DEFAULT_SETTINGS_BY_CATEGORY: Record<SettingsCategory, Omit<Settings, '_id'>> = {
    general: DEFAULT_GENERAL_SETTINGS,
    content: DEFAULT_CONTENT_SETTINGS,
    uploads: DEFAULT_UPLOAD_SETTINGS,
    notifications: DEFAULT_NOTIFICATION_SETTINGS,
    security: DEFAULT_SECURITY_SETTINGS,
};
