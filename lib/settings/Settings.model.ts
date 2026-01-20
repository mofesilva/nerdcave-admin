import type { SettingType, ThemeMode, ThemeMedia, SystemCategory } from './Settings.types';

// ─── BASE SETTING ────────────────────────────────────────────────────────────

export type BaseSetting = {
    _id: string;
    type: SettingType;
};

// ─── ADMIN THEME SETTING ─────────────────────────────────────────────────────

export type AdminThemeSetting = BaseSetting & {
    type: 'theme';
    domain: 'admin';
    themeMode: ThemeMode;
    backgroundColor?: string;
    foregroundColor?: string;
    primaryTextColor?: string;
    secondaryTextColor?: string;
    mutedTextColor?: string;
    highlightedTextColor?: string;
    mutedColor?: string;
    accentColor?: string;
    accentTextColor?: string;
    sidebarBackgroundColor?: string;
    sidebarForegroundColor?: string;
    sidebarActiveColor?: string;
    sidebarHoverColor?: string;
    cardForegroundColor?: string;
    cardBorderColor?: string;
    cardBackgroundColor?: string;
    themeMedia: ThemeMedia;
};

export const DEFAULT_ADMIN_THEME_LIGHT: Omit<AdminThemeSetting, '_id'> = {
    type: 'theme',
    domain: 'admin',
    themeMode: 'light',
    backgroundColor: '#f8f9fa',
    foregroundColor: '#212529',
    primaryTextColor: '#212529',
    secondaryTextColor: '#495057',
    mutedTextColor: '#6c757d',
    highlightedTextColor: '#000000',
    mutedColor: '#e9ecef',
    accentColor: '#0067ff',
    accentTextColor: '#ffffff',
    sidebarBackgroundColor: '#DEE2E6',
    sidebarForegroundColor: '#212529',
    sidebarActiveColor: '#0067ff',
    sidebarHoverColor: '#ced4da',
    cardBackgroundColor: '#ffffff',
    cardForegroundColor: '#212529',
    cardBorderColor: '#dee2e6',
    themeMedia: {},
};

export const DEFAULT_ADMIN_THEME_DARK: Omit<AdminThemeSetting, '_id'> = {
    type: 'theme',
    domain: 'admin',
    themeMode: 'dark',
    backgroundColor: '#070707',
    foregroundColor: '#f8f9fa',
    primaryTextColor: '#f8f9fa',
    secondaryTextColor: '#adb5bd',
    mutedTextColor: '#6c757d',
    highlightedTextColor: '#ffffff',
    mutedColor: '#262626',
    accentColor: '#0067ff',
    accentTextColor: '#ffffff',
    sidebarBackgroundColor: '#111111',
    sidebarForegroundColor: '#e5e5e5',
    sidebarActiveColor: '#0067ff',
    sidebarHoverColor: '#262626',
    cardBackgroundColor: '#171717',
    cardForegroundColor: '#f8f9fa',
    cardBorderColor: '#262626',
    themeMedia: {},
};

// ─── BLOG THEME SETTING ──────────────────────────────────────────────────────

export type BlogThemeSetting = BaseSetting & {
    type: 'theme';
    domain: 'blog';
    themeMode: ThemeMode;
    backgroundColor?: string;
    accentColor?: string;
    accentTextColor?: string;
    blogName?: string;
    blogDescription?: string;
    blogKeywords?: string;
    blogFooterText?: string;
    blogHeaderStyle?: 'minimal' | 'full';
    blogLogo?: import('@/lib/medias/Media.model').Media;
    blogFavicon?: import('@/lib/medias/Media.model').Media;
};

export const DEFAULT_BLOG_THEME_SETTING: Omit<BlogThemeSetting, '_id'> = {
    type: 'theme',
    domain: 'blog',
    themeMode: 'dark',
    accentColor: '#0067ff',
    accentTextColor: '#ffffff',
    backgroundColor: '#171717',
    blogHeaderStyle: 'minimal',
};

// ─── SYSTEM SETTING ──────────────────────────────────────────────────────────

export type SystemSetting = BaseSetting & {
    type: 'system';
    category: SystemCategory;

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

    // Layout Settings
    fullWidthLayout?: boolean;
};

export const DEFAULT_GENERAL_SETTINGS: Omit<SystemSetting, '_id'> = {
    type: 'system',
    category: 'general',
    siteName: 'NerdCave CMS',
    siteUrl: '',
    adminEmail: '',
    defaultLanguage: 'pt-BR',
    timezone: 'America/Sao_Paulo',
};

export const DEFAULT_CONTENT_SETTINGS: Omit<SystemSetting, '_id'> = {
    type: 'system',
    category: 'content',
    postsPerPage: 10,
    enableComments: true,
    moderateComments: true,
    enableDrafts: true,
    autoSaveDrafts: true,
    autoSaveIntervalSec: 30,
};

export const DEFAULT_UPLOAD_SETTINGS: Omit<SystemSetting, '_id'> = {
    type: 'system',
    category: 'uploads',
    maxUploadSizeMb: 10,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    imageQuality: 85,
};

export const DEFAULT_NOTIFICATION_SETTINGS: Omit<SystemSetting, '_id'> = {
    type: 'system',
    category: 'notifications',
    emailNotifications: true,
    notifyOnNewComment: true,
    notifyOnNewUser: true,
};

export const DEFAULT_SECURITY_SETTINGS: Omit<SystemSetting, '_id'> = {
    type: 'system',
    category: 'security',
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    requireEmailVerification: false,
};

export const DEFAULT_LAYOUT_SETTINGS: Omit<SystemSetting, '_id'> = {
    type: 'system',
    category: 'layout',
    fullWidthLayout: false,
};

export const DEFAULT_SYSTEM_SETTINGS_BY_CATEGORY: Record<SystemCategory, Omit<SystemSetting, '_id'>> = {
    general: DEFAULT_GENERAL_SETTINGS,
    content: DEFAULT_CONTENT_SETTINGS,
    uploads: DEFAULT_UPLOAD_SETTINGS,
    notifications: DEFAULT_NOTIFICATION_SETTINGS,
    security: DEFAULT_SECURITY_SETTINGS,
    layout: DEFAULT_LAYOUT_SETTINGS,
};

// ─── UNION TYPES ─────────────────────────────────────────────────────────────

export type ThemeSetting = AdminThemeSetting; // | BlogThemeSetting quando existir
export type Setting = ThemeSetting | SystemSetting;

