export type Settings = {
    _id: string;
    primaryColor: string;
    secondaryColor?: string;
    accentColor?: string;
    cardColor?: string;
    backgroundColor?: string;
    backgroundImgUrl?: string;
    siteName?: string;
    siteDescription?: string;
    siteKeywords?: string;
};

export const DEFAULT_SETTINGS: Omit<Settings, '_id'> = {
    primaryColor: '#3b82f6',
    secondaryColor: undefined,
    accentColor: undefined,
    cardColor: undefined,
    backgroundColor: undefined,
    backgroundImgUrl: undefined,
    siteName: undefined,
    siteDescription: undefined,
    siteKeywords: undefined,
};
