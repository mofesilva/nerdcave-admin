export interface TopLink {
    linkId: string;
    title: string;
    clicks: number;
}

export interface ClicksByDate {
    date: string;
    clicks: number;
}

export interface DeviceStats {
    mobile: number;
    desktop: number;
    tablet: number;
}

export interface Analytics {
    totalClicks: number;
    uniqueVisitors: number;
    topLinks: TopLink[];
    clicksByDate: ClicksByDate[];
    deviceStats: DeviceStats;
}
