'use client';

import { useEffect, useState } from "react";
import { StatsCard } from "./componentes/StatsCard";
import { DeviceStats } from "./componentes/DeviceStats";
import { ClickTrends } from "./componentes/ClickTrends";
import TopLinks from "./componentes/TopLinks";
import { AnalyticsController, LinksController } from "@/lib/controllers";
import { MousePointerClick, Users, Eye, TrendingUp, Plus, User } from "lucide-react";
import { LinkModel } from "@/lib/models/Link.model";
import LinkNext from "next/link";

interface Analytics {
  totalClicks: number;
  uniqueVisitors: number;
  topLinks: Array<{ linkId: string; title: string; clicks: number }>;
  clicksByDate: Array<{ date: string; clicks: number }>;
  deviceStats: { desktop: number; mobile: number; tablet: number };
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [links, setLinks] = useState<LinkModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [analyticsData, linkModels] = await Promise.all([
          AnalyticsController.get(),
          LinksController.getAll()
        ]);
        setAnalytics(analyticsData);
        setLinks(linkModels);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-zinc-400 animate-pulse">Carregando...</div>
      </div>
    );
  }

  const activeLinks = links.filter(link => link.isActive).length;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-secondary-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-base mt-2">Visão geral do seu Link Tree</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Clicks"
          value={analytics.totalClicks}
          change="+12.5%"
          icon={<MousePointerClick className="w-6 h-6" />}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />

        <StatsCard
          title="Visitantes Unicos"
          value={analytics.uniqueVisitors}
          change="+8.2%"
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Links Ativos"
          value={activeLinks}
          icon={<TrendingUp className="w-6 h-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatsCard
          title="Total Views"
          value="1M+"
          change="+15.3%"
          icon={<Eye className="w-6 h-6" />}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Links */}
        <TopLinks topLinks={analytics.topLinks} />

        <DeviceStats
          mobile={analytics.deviceStats.mobile}
          desktop={analytics.deviceStats.desktop}
          tablet={analytics.deviceStats.tablet}
        />
      </div>

      {/* Click Trends */}
      <ClickTrends data={analytics.clicksByDate} />

      {/* Quick Actions removed - moved to side navigation */}
    </div>
  );
}
