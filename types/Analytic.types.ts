// export interface TopLink {
//     linkId: string;
//     title: string;
//     clicks: number;
// }

// export interface ClicksByDate {
//     date: string;
//     clicks: number;
// }

// export interface DeviceStats {
//     mobile: number;
//     desktop: number;
//     tablet: number;
// }

// export interface Analytics {
//     totalClicks: number;
//     uniqueVisitors: number;
//     topLinks: TopLink[];
//     clicksByDate: ClicksByDate[];
//     deviceStats: DeviceStats;
// }
export type EventType = 'view' | 'click' | 'like' | 'share' | 'comment';
export type TargetType = 'article' | 'album' | 'link' | 'media';
export type DeviceType = 'mobile' | 'desktop' | 'tablet';
export type ContentStatistic = {
    totalClicks?: number;
    totalViews?: number;
    totalLikes?: number;
    totalComents?: number;
    totalShares?: number;
    deviceBreakdown?: Record<DeviceType, number>;
    geoLocationBreakdown?: Record<string, number>;
}
