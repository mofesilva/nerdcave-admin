import { Settings, SettingsCategory } from './Settings.model';
import { toCamelCaseKeys } from '../utils';

export function settingsFromDocument(doc: any): Settings {
    const data = toCamelCaseKeys(doc) as any;

    return {
        _id: data._id ?? '',
        category: (data.category ?? 'general') as SettingsCategory,

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
