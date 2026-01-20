import type { AdminThemeSetting, SystemSetting } from './Settings.model';
import type { SystemCategory } from './Settings.types';
import { toCamelCaseKeys } from '../utils';

// ─── THEME SETTING MAPPER ────────────────────────────────────────────────────

export function adminThemeSettingFromDocument(doc: any): AdminThemeSetting {
    const data = toCamelCaseKeys(doc) as any;

    return {
        _id: data._id ?? '',
        type: 'theme',
        domain: 'admin',
        themeMode: data.themeMode ?? 'dark',
        backgroundColor: data.backgroundColor,
        foregroundColor: data.foregroundColor,
        accentColor: data.accentColor,
        accentTextColor: data.accentTextColor,
        primaryTextColor: data.primaryTextColor,
        secondaryTextColor: data.secondaryTextColor,
        mutedTextColor: data.mutedTextColor,
        highlightedTextColor: data.highlightedTextColor,
        mutedColor: data.mutedColor,
        sidebarBackgroundColor: data.sidebarBackgroundColor,
        sidebarForegroundColor: data.sidebarForegroundColor,
        sidebarActiveColor: data.sidebarActiveColor,
        sidebarHoverColor: data.sidebarHoverColor,
        cardBackgroundColor: data.cardBackgroundColor,
        cardBorderColor: data.cardBorderColor,
        cardForegroundColor: data.cardForegroundColor,
        themeMedia: data.themeMedia ?? {},
    };
}

// ─── SYSTEM SETTING MAPPER ───────────────────────────────────────────────────

export function systemSettingFromDocument(doc: any): SystemSetting {
    const data = toCamelCaseKeys(doc) as any;

    return {
        _id: data._id ?? '',
        type: 'system',
        category: (data.category ?? 'general') as SystemCategory,

        // General
        siteName: data.siteName,
        siteUrl: data.siteUrl,
        adminEmail: data.adminEmail,
        defaultLanguage: data.defaultLanguage,
        timezone: data.timezone,

        // Content
        postsPerPage: data.postsPerPage,
        enableComments: data.enableComments,
        moderateComments: data.moderateComments,
        enableDrafts: data.enableDrafts,
        autoSaveDrafts: data.autoSaveDrafts,
        autoSaveIntervalSec: data.autoSaveIntervalSec,

        // Uploads
        maxUploadSizeMb: data.maxUploadSizeMb,
        allowedFileTypes: data.allowedFileTypes,
        imageQuality: data.imageQuality,

        // Notifications
        emailNotifications: data.emailNotifications,
        notifyOnNewComment: data.notifyOnNewComment,
        notifyOnNewUser: data.notifyOnNewUser,

        // Security
        sessionTimeoutMinutes: data.sessionTimeoutMinutes,
        maxLoginAttempts: data.maxLoginAttempts,
        requireEmailVerification: data.requireEmailVerification,

        // Layout
        fullWidthLayout: data.fullWidthLayout,
    };
}

