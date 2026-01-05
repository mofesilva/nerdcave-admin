import { Analytic } from './Analytic.model';
import { toCamelCaseKeys } from '../utils';

export function analyticFromDocument(doc: any): Analytic {
    // Converte todas as chaves de snake_case para camelCase recursivamente
    const data = toCamelCaseKeys(doc) as any;

    return {
        _id: data._id ?? '',
        targetId: data.targetId ?? '',
        targetType: data.targetType ?? '',
        type: data.type ?? '',
        sessionId: data.sessionId,
        userAgent: data.userAgent,
        referrer: data.referrer,
        city: data.city,
        state: data.state,
        country: data.country,
        device: data.device,
        consentGiven: data.consentGiven ?? false,
        deleted: data.deleted ?? false,
    }
}