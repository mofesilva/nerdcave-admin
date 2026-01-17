import { Media } from "@/lib/medias/Media.model";

export type ThemeType = 'admin' | 'blog';

export type ThemeSettings = {
    _id: string;
    themeType: ThemeType;
    accentColor?: string;
    accentTextColor?: string;
    backgroundColor?: string;
    backgroundImgUrl?: string;
    blogName?: string;
    blogDescription?: string;
    blogKeywords?: string;
    loginPageLogo?: Media;
    sideBarLogoDark?: Media;
    sideBarLogoLight?: Media;
    
    // Admin theme colors - Light
    backgroundLight?: string;
    sidebarBackgroundLight?: string;
    textColorLight?: string;
    cardColorLight?: string;
    
    // Admin theme colors - Dark
    backgroundDark?: string;
    sidebarBackgroundDark?: string;
    textColorDark?: string;
    cardColorDark?: string;
    
    // Admin favicon
    adminFavicon?: Media;
    
    // Blog specific
    blogLogo?: Media;
    blogFavicon?: Media;
    blogHeaderStyle?: 'minimal' | 'full';
    blogFooterText?: string;
};

export const DEFAULT_ADMIN_THEME_SETTINGS: Omit<ThemeSettings, '_id'> = {
    themeType: 'admin',
    accentColor: undefined,
    accentTextColor: undefined,
    backgroundColor: undefined,
    backgroundImgUrl: undefined,
    blogName: undefined,
    blogDescription: undefined,
    blogKeywords: undefined,
    loginPageLogo: undefined,
    sideBarLogoDark: undefined,
    sideBarLogoLight: undefined,
    // Theme colors - Light (CSS defaults)
    backgroundLight: undefined,
    sidebarBackgroundLight: undefined,
    textColorLight: undefined,
    cardColorLight: undefined,
    // Theme colors - Dark (CSS defaults)
    backgroundDark: undefined,
    sidebarBackgroundDark: undefined,
    textColorDark: undefined,
    cardColorDark: undefined,
    // Admin favicon
    adminFavicon: undefined,
};

export const DEFAULT_BLOG_THEME_SETTINGS: Omit<ThemeSettings, '_id'> = {
    themeType: 'blog',
    accentColor: '#0067ff',
    accentTextColor: '#ffffff',
    backgroundColor: '#171717',
    blogName: 'Meu Blog',
    blogDescription: 'Descrição do blog',
    blogKeywords: '',
    blogLogo: undefined,
    blogFavicon: undefined,
    blogHeaderStyle: 'minimal',
    blogFooterText: '© 2026 Todos os direitos reservados',
};
