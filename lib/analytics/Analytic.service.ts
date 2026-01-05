import { getAnalyticsCollection } from './Analytics.collection';
import type { Analytic } from './Analytic.model';
import { analyticFromDocument } from './Analytic.mapper';
import type { ContentStatistic, TargetType, EventType, DeviceType } from '@/types';

interface AnalyticParametersProps {
    id?: string;
    targetId?: string;
    targetType?: TargetType;
    eventType?: EventType;
    sessionId?: string;
    userAgent?: string;
    referrer?: string;
    city?: string;
    state?: string;
    country?: string;
    device?: DeviceType;
    consentGiven?: boolean;
    data?: Omit<Analytic, '_id' | 'deleted'>;
}

// ─── CRUD ────────────────────────────────────────────────────────────────────

export async function getAllAnalytics(): Promise<Analytic[]> {
    const analytics = getAnalyticsCollection();
    const result = await analytics.find({ query: { deleted: false } });
    if (result.error || !result.documents) return [];
    return result.documents.map(doc => analyticFromDocument(doc));
}

export async function getAnalyticById({ id }: AnalyticParametersProps): Promise<Analytic | null> {
    const analytics = getAnalyticsCollection();
    const result = await analytics.findById(id!);
    if (result.error || !result.document) return null;
    return analyticFromDocument(result.document);
}

export async function getAnalyticsByTarget({ targetId, targetType }: AnalyticParametersProps): Promise<Analytic[]> {
    const analytics = getAnalyticsCollection();
    const result = await analytics.find({ query: { targetId, targetType, deleted: false } });
    if (result.error || !result.documents) return [];
    return result.documents.map(doc => analyticFromDocument(doc));
}

export async function getAnalyticsByTargetType({ targetType }: AnalyticParametersProps): Promise<Analytic[]> {
    const analytics = getAnalyticsCollection();
    const result = await analytics.find({ query: { targetType, deleted: false } });
    if (result.error || !result.documents) return [];
    return result.documents.map(doc => analyticFromDocument(doc));
}

export async function createAnalytic({ data }: AnalyticParametersProps): Promise<Analytic> {
    const analytics = getAnalyticsCollection();
    const payload = {
        ...data,
        sessionId: data!.sessionId ?? crypto.randomUUID(),
        deleted: false,
    };

    const result = await analytics.insertOne(payload);
    if (result.error || !result.document) {
        throw new Error(result.errorMsg || 'Failed to create analytic');
    }
    return analyticFromDocument(result.document);
}

export async function deleteAnalytic({ id }: AnalyticParametersProps): Promise<boolean> {
    const analytics = getAnalyticsCollection();
    const result = await analytics.updateOne(id!, { deleted: true });
    return !result.error;
}

// ─── QUERIES POR TIPO ────────────────────────────────────────────────────────

export async function getArticleAnalytics(): Promise<Analytic[]> {
    return getAnalyticsByTargetType({ targetType: 'article' });
}

export async function getAlbumAnalytics(): Promise<Analytic[]> {
    return getAnalyticsByTargetType({ targetType: 'album' });
}

export async function getLinkAnalytics(): Promise<Analytic[]> {
    return getAnalyticsByTargetType({ targetType: 'link' });
}

export async function getMediaAnalytics(): Promise<Analytic[]> {
    return getAnalyticsByTargetType({ targetType: 'media' });
}

// ─── ESTATÍSTICAS ────────────────────────────────────────────────────────────

function calculateStats(analyticList: Analytic[]): ContentStatistic {
    return {
        totalViews: analyticList.filter(a => a.type === 'view').length,
        totalLikes: analyticList.filter(a => a.type === 'like').length,
        totalComents: analyticList.filter(a => a.type === 'comment').length,
        totalShares: analyticList.filter(a => a.type === 'share').length,
    };
}

export async function getArticleStats(): Promise<ContentStatistic> {
    const analyticList = await getArticleAnalytics();
    return calculateStats(analyticList);
}

export async function getAlbumStats(): Promise<ContentStatistic | null> {
    const analyticList = await getAlbumAnalytics();
    if (analyticList.length === 0) return null;
    return calculateStats(analyticList);
}

export async function getTargetStats({ targetId, targetType }: AnalyticParametersProps): Promise<ContentStatistic | null> {
    const analyticList = await getAnalyticsByTarget({ targetId, targetType });
    if (analyticList.length === 0) return null;
    return calculateStats(analyticList);
}

// ─── TRACKING ────────────────────────────────────────────────────────────────

export async function trackEvent({ targetId, targetType, eventType, sessionId, userAgent, referrer, city, state, country, device, consentGiven }: AnalyticParametersProps): Promise<Analytic> {
    return createAnalytic({
        data: {
            targetId: targetId!,
            targetType: targetType!,
            type: eventType!,
            sessionId,
            userAgent: consentGiven ? userAgent : undefined,
            referrer,
            city: consentGiven ? city : undefined,
            state: consentGiven ? state : undefined,
            country: consentGiven ? country : undefined,
            device,
            consentGiven: consentGiven ?? false,
        }
    });
}
