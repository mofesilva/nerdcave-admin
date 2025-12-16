'use client';

import { useEffect, useState } from "react";
import StatCard from "@/components/admin/StatCard";
import { AnalyticsController, LinksController } from "@/lib/controllers";
import { MousePointerClick, Users, TrendingUp, Globe, Download, FileText } from "lucide-react";
import type { Link } from "@/types";

interface Analytics {
  totalClicks: number;
  uniqueVisitors: number;
  topLinks: Array<{ id: string; title: string; clicks: number }>;
  clicksByDate: Array<{ date: string; clicks: number }>;
  deviceStats: { desktop: number; mobile: number; tablet: number };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [analyticsData, linkModels] = await Promise.all([
          AnalyticsController.get(),
          LinksController.getAll()
        ]);
        setAnalytics(analyticsData);
        setLinks(linkModels.map(m => m.toJSON()));
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clicks"
          value={analytics.totalClicks.toLocaleString()}
          change="+12.5% vs last period"
          icon={<MousePointerClick className="w-6 h-6" />}
          trend="up"
        />
        <StatCard
          title="Unique Visitors"
          value={analytics.uniqueVisitors.toLocaleString()}
          change="+8.2% vs last period"
          icon={<Users className="w-6 h-6" />}
          trend="up"
        />
        <StatCard
          title="Avg. Click Rate"
          value="67.5%"
          change="+3.1% vs last period"
          icon={<TrendingUp className="w-6 h-6" />}
          trend="up"
        />
        <StatCard
          title="Countries"
          value="42"
          change="+5 new countries"
          icon={<Globe className="w-6 h-6" />}
          trend="up"
        />
      </div>

      {/* Click Trends Chart */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Click Trends</h2>
            <p className="text-sm text-muted-foreground">Daily click activity over the last 7 days</p>
          </div>
          <select className="px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>

        <div className="h-80 flex items-end justify-between gap-4">
          {analytics.clicksByDate.map((day, index) => {
            const maxClicks = Math.max(...analytics.clicksByDate.map(d => d.clicks));
            const height = (day.clicks / maxClicks) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg group-hover:from-primary group-hover:to-primary/80 transition-all duration-300 cursor-pointer"
                    style={{ height: `${Math.max(height, 10)}%` }}
                  />
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-border z-10">
                    {day.clicks} clicks
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-4 border-transparent border-t-popover" />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-sm font-bold text-foreground">{day.clicks}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance by Link */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-foreground mb-6">Performance by Link</h2>
        <div className="space-y-6">
          {links.map((link) => {
            const totalClicks = analytics.totalClicks;
            const percentage = totalClicks > 0 ? ((link.clicks / totalClicks) * 100).toFixed(1) : "0";
            return (
              <div key={link._id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{link.title}</p>
                    <p className="text-sm text-muted-foreground">{link.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{link.clicks.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{percentage}%</p>
                  </div>
                </div>
                <div className="relative w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Device & Location Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Device Breakdown</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Mobile</p>
                    <p className="text-sm text-muted-foreground">iOS & Android</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-foreground">{analytics.deviceStats.mobile}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${analytics.deviceStats.mobile}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                    <span className="text-xl">💻</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Desktop</p>
                    <p className="text-sm text-muted-foreground">Windows, Mac, Linux</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-foreground">{analytics.deviceStats.desktop}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${analytics.deviceStats.desktop}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                    <span className="text-xl">📲</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tablet</p>
                    <p className="text-sm text-muted-foreground">iPad & Android tablets</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-foreground">{analytics.deviceStats.tablet}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${analytics.deviceStats.tablet}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Top Countries</h2>
          <div className="space-y-6">
            {[
              { country: 'United States', flag: '🇺🇸', visitors: 3542, percentage: 28 },
              { country: 'United Kingdom', flag: '🇬🇧', visitors: 2134, percentage: 17 },
              { country: 'Canada', flag: '🇨🇦', visitors: 1876, percentage: 15 },
              { country: 'Germany', flag: '🇩🇪', visitors: 1543, percentage: 12 },
              { country: 'Brazil', flag: '🇧🇷', visitors: 1234, percentage: 10 },
              { country: 'Others', flag: '🌍', visitors: 2271, percentage: 18 },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-2xl">{item.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{item.country}</span>
                    <span className="text-sm text-muted-foreground">{item.visitors.toLocaleString()} visitors</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-8 border border-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h3 className="text-lg font-bold mb-2 text-foreground">Export Analytics Data</h3>
            <p className="text-muted-foreground">Download your analytics data in CSV or PDF format</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-card text-foreground border border-border px-4 py-2 rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Export as CSV
            </button>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
              <Download className="w-4 h-4" />
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
