import { Settings } from './Settings.model';
import { toCamelCaseKeys } from '../utils';

export function settingsFromDocument(doc: any): Settings {
    // Converte todas as chaves de snake_case para camelCase recursivamente
    const data = toCamelCaseKeys(doc) as any;

    return {
        _id: data._id ?? '',
        primaryColor: data.primaryColor ?? '#3b82f6',
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        cardColor: data.cardColor,
        backgroundColor: data.backgroundColor,
        backgroundImgUrl: data.backgroundImgUrl,
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        siteKeywords: data.siteKeywords,
    };
}
