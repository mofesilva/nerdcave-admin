import { LinksController } from './Links.controller';
import type { Analytics } from '@/types';

export class AnalyticsController {
    static async get(): Promise<Analytics> {
        const links = await LinksController.getAll();
        const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

        const topLinks = [...links]
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5)
            .map(link => ({
                linkId: link._id,
                title: link.title,
                clicks: link.clicks,
            }));

        const clicksByDate = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
                date: date.toISOString().split('T')[0],
                clicks: Math.floor(Math.random() * 500) + 200,
            };
        });

        return {
            totalClicks,
            uniqueVisitors: Math.floor(totalClicks * 0.7),
            topLinks,
            clicksByDate,
            deviceStats: {
                mobile: 60,
                desktop: 30,
                tablet: 10,
            },
        };
    }
}
