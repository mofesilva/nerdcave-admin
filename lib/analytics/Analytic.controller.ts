import * as AnalyticService from './Analytic.service';
import type { Analytic } from './Analytic.model';
import type { ContentStatistic, TargetType, EventType, DeviceType } from '@/types';

interface AnalyticControllerProps {
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
    return AnalyticService.getAllAnalytics();
}

export async function getAnalyticById({ id }: AnalyticControllerProps): Promise<Analytic | null> {
    return AnalyticService.getAnalyticById({ id });
}

export async function createAnalytic({ data }: AnalyticControllerProps): Promise<Analytic> {
    return AnalyticService.createAnalytic({ data });
}

export async function deleteAnalytic({ id }: AnalyticControllerProps): Promise<boolean> {
    return AnalyticService.deleteAnalytic({ id });
}

// ─── QUERIES POR TIPO ────────────────────────────────────────────────────────

export async function getArticleAnalytics(): Promise<Analytic[]> {
    return AnalyticService.getArticleAnalytics();
}

export async function getAlbumAnalytics(): Promise<Analytic[]> {
    return AnalyticService.getAlbumAnalytics();
}

export async function getLinkAnalytics(): Promise<Analytic[]> {
    return AnalyticService.getLinkAnalytics();
}

export async function getMediaAnalytics(): Promise<Analytic[]> {
    return AnalyticService.getMediaAnalytics();
}

// ─── ESTATÍSTICAS ────────────────────────────────────────────────────────────

export async function getArticleStats(): Promise<ContentStatistic> {
    return AnalyticService.getArticleStats();
}

export async function getAlbumStats(): Promise<ContentStatistic | null> {
    return AnalyticService.getAlbumStats();
}

export async function getTargetStats({ targetId, targetType }: AnalyticControllerProps): Promise<ContentStatistic | null> {
    return AnalyticService.getTargetStats({ targetId, targetType });
}

// ─── TRACKING ────────────────────────────────────────────────────────────────

export async function trackEvent({ targetId, targetType, eventType, sessionId, userAgent, referrer, city, state, country, device, consentGiven }: AnalyticControllerProps): Promise<Analytic> {
    return AnalyticService.trackEvent({ targetId, targetType, eventType, sessionId, userAgent, referrer, city, state, country, device, consentGiven });
}