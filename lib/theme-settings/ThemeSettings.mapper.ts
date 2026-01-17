import { ThemeSettings } from './ThemeSettings.model';
import { toCamelCaseKeys } from '../utils';

export function themeSettingsFromDocument(doc: any): ThemeSettings {
    // Converte todas as chaves de snake_case para camelCase recursivamente
    const data = toCamelCaseKeys(doc) as any;

    return {
        _id: data._id ?? '',
        themeType: data.themeType ?? 'admin',
        accentColor: data.accentColor,
        accentTextColor: data.accentTextColor,
        backgroundColor: data.backgroundColor,
        backgroundImgUrl: data.backgroundImgUrl,
        blogName: data.blogName,
        blogDescription: data.blogDescription,
        blogKeywords: data.blogKeywords,
        loginPageLogo: data.loginPageLogo,
        sideBarLogoDark: data.sideBarLogoDark,
        sideBarLogoLight: data.sideBarLogoLight,
        // Admin theme colors - Light
        backgroundLight: data.backgroundLight,
        sidebarBackgroundLight: data.sidebarBackgroundLight,
        textColorLight: data.textColorLight,
        cardColorLight: data.cardColorLight,
        // Admin theme colors - Dark
        backgroundDark: data.backgroundDark,
        sidebarBackgroundDark: data.sidebarBackgroundDark,
        textColorDark: data.textColorDark,
        cardColorDark: data.cardColorDark,
        // Admin favicon
        adminFavicon: data.adminFavicon,
        // Blog specific
        blogLogo: data.blogLogo,
        blogFavicon: data.blogFavicon,
        blogHeaderStyle: data.blogHeaderStyle,
        blogFooterText: data.blogFooterText,
    };
}
