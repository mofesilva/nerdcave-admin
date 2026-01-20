'use client';

import { useEffect, useState } from "react";
import type { ArticleSummary } from "@/lib/articles/Article.model";
import type { Media } from "@/lib/medias/Media.model";
import type { LinkStats } from "@/lib/links/Link.controller";
import type { ArticleStats } from "@/lib/articles/Article.controller";
import type { AlbumStats } from "@/lib/albums/Album.controller";
import * as LinksController from "@/lib/links/Link.controller";
import * as ArticlesController from "@/lib/articles/Article.controller";
import * as AlbumsController from "@/lib/albums/Album.controller";
import * as MediaController from "@/lib/medias/Media.controller";
import * as CategoriesController from "@/lib/categories/Category.controller";
import StatsSection from "./componentes/StatsSection";
import ContentSection from "./componentes/ContentSection";
import AnalyticsSection from "./componentes/AnalyticsSection";

interface Analytics {
  totalClicks: number;
  uniqueVisitors: number;
  topLinks: Array<{ linkId: string; title: string; clicks: number }>;
  clicksByDate: Array<{ date: string; clicks: number }>;
  deviceStats: { desktop: number; mobile: number; tablet: number };
}

interface DashboardStats {
  links: LinkStats;
  articles: ArticleStats;
  albums: AlbumStats;
  totalMedia: number;
  totalCategories: number;
}

interface DashboardData {
  analytics: Analytics | null;
  stats: DashboardStats;
  recentArticles: ArticleSummary[];
  topPublishedArticles: ArticleSummary[];
  recentMedia: Media[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    analytics: null,
    stats: {
      links: { total: 0, active: 0 },
      articles: { total: 0, published: 0, draft: 0, featured: 0 },
      albums: { total: 0, published: 0 },
      totalMedia: 0,
      totalCategories: 0,
    },
    recentArticles: [],
    topPublishedArticles: [],
    recentMedia: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Busca stats agregadas em paralelo (1 query por domínio)
        const [
          linkStats,
          articleStats,
          albumStats,
          totalMedia,
          totalCategories,
          recentArticles,
          topPublishedArticles,
          recentMedia,
        ] = await Promise.all([
          LinksController.getLinkStats(),
          ArticlesController.getArticleStats(),
          AlbumsController.getAlbumStatsController(),
          MediaController.countMedias(),
          CategoriesController.countCategories(),
          ArticlesController.getRecentArticles(5),
          ArticlesController.getRecentPublishedArticles(5),
          MediaController.getRecentMedias(5),
        ]);

        setData({
          analytics: null, // TODO: Implement analytics
          stats: {
            links: linkStats,
            articles: articleStats,
            albums: albumStats,
            totalMedia,
            totalCategories,
          },
          recentArticles,
          topPublishedArticles,
          recentMedia,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsSection
        links={data.stats.links}
        articles={data.stats.articles}
        albums={data.stats.albums}
        totalMedia={data.stats.totalMedia}
        uniqueVisitors={data.analytics?.uniqueVisitors}
      />
      <ContentSection
        recentPosts={data.recentArticles}
        recentMedia={data.recentMedia}
      />
      <AnalyticsSection
        clicksByDate={data.analytics?.clicksByDate || []}
        deviceStats={data.analytics?.deviceStats || { desktop: 0, mobile: 0, tablet: 0 }}
        totalClicks={data.analytics?.totalClicks || 0}
        topPosts={data.topPublishedArticles}
        topLinks={data.analytics?.topLinks || []}
      />
    </div>
  );
}
