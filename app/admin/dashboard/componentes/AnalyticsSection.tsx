"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import SectionTitle from "./SectionTitle";
import TrafficChart from "./TrafficChart";
import DeviceStats from "./DeviceStats";
import TopPosts from "./TopPosts";
import TopLinks from "./TopLinks";
import type { ArticleSummary } from "@/lib/articles/Article.model";

interface AnalyticsSectionProps {
    clicksByDate: Array<{ date: string; clicks: number }>;
    deviceStats: { desktop: number; mobile: number; tablet: number };
    totalClicks: number;
    topPosts: ArticleSummary[];
    topLinks: Array<{ linkId: string; title: string; clicks: number }>;
}

export default function AnalyticsSection({
    clicksByDate,
    deviceStats,
    totalClicks,
    topPosts,
    topLinks,
}: AnalyticsSectionProps) {
    const [expanded, setExpanded] = useState(true);

    return (
        <section>
            <SectionTitle
                title="Analytics"
                description="Tráfego, dispositivos e performance"
                icon={BarChart3}
                collapsible
                expanded={expanded}
                onExpandedChange={setExpanded}
            />
            {expanded && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <TrafficChart data={clicksByDate} />
                        <DeviceStats
                            desktop={deviceStats.desktop}
                            mobile={deviceStats.mobile}
                            tablet={deviceStats.tablet}
                            totalClicks={totalClicks}
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
                        <TopPosts posts={topPosts} />
                        <TopLinks links={topLinks} />
                    </div>
                </>
            )}
        </section>
    );
}
