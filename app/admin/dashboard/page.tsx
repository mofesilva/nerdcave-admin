'use client';

import { useEffect, useState, useMemo } from "react";
import { FileText, Image as ImageIcon, FolderOpen, Link2, Eye, Users, Star, Target } from "lucide-react";
import type { Link } from "@/lib/links/Link.model";
import type { Article } from "@/lib/articles/Article.model";
import type { Album } from "@/lib/albums/Album.model";
import type { Media } from "@/lib/medias/Media.model";
import * as LinksController from "@/lib/links/Link.controller";
import * as ArticlesController from "@/lib/articles/Article.controller";
import * as AlbumsController from "@/lib/albums/Album.controller";
import * as MediaController from "@/lib/medias/Media.controller";
import * as CategoriesController from "@/lib/categories/Category.controller";

import WelcomeBanner from "./componentes/WelcomeBanner";
import StatCard from "./componentes/StatCard";
import QuickStat from "./componentes/QuickStat";
import TrafficChart from "./componentes/TrafficChart";
import DeviceStats from "./componentes/DeviceStats";
import RecentPosts from "./componentes/RecentPosts";
import TopPosts from "./componentes/TopPosts";
import TopLinks from "./componentes/TopLinks";
import SectionSeparator from "./componentes/SectionSeparator";
import RecentUploads from "./componentes/RecentUploads";
import QuickActions from "./componentes/QuickActions";
import { BarChart3, Newspaper, Link as LinkIcon, Activity } from "lucide-react";

interface Analytics {
  totalClicks: number;
  uniqueVisitors: number;
  topLinks: Array<{ linkId: string; title: string; clicks: number }>;
  clicksByDate: Array<{ date: string; clicks: number }>;
  deviceStats: { desktop: number; mobile: number; tablet: number };
}

interface DashboardData {
  analytics: Analytics | null;
  links: Link[];
  articles: Article[];
  albums: Album[];
  media: Media[];
  recentMedia: Media[];
  totalCategories: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    analytics: null,
    links: [],
    articles: [],
    albums: [],
    media: [],
    recentMedia: [],
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [links, articles, albums, media, recentMedia, categories] = await Promise.all([
          LinksController.getAllLinks(),
          ArticlesController.getAllArticles(),
          AlbumsController.getAllAlbumsController(),
          MediaController.getAllMedias(),
          MediaController.getRecentMedias(5),
          CategoriesController.getAllCategories()
        ]);
        setData({
          analytics: null, // TODO: Implement analytics
          links,
          articles,
          albums,
          media,
          recentMedia,
          totalCategories: categories.length
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Computed stats
  const stats = useMemo(() => {

    //TODO: Buscar essas informações direto do banco de dados ao invés de usar filter aqui
    const activeLinks = data.links.filter(l => l.isActive).length;
    const publishedPosts = data.articles.filter(a => a.status === 'published').length;
    const draftPosts = data.articles.filter(a => a.status === 'draft').length;
    const featuredPosts = data.articles.filter(a => a.isFeatured).length;
    const publicAlbums = data.albums.filter(a => a.status === 'published').length;
    // TODO: Views agora vem de article_views collection - implementar agregação
    const totalViews = 0;

    return {
      activeLinks,
      publishedPosts,
      draftPosts,
      featuredPosts,
      publicAlbums,
      totalViews,
      totalMedia: data.media.length
    };
  }, [data]);

  // Recent posts
  const recentPosts = useMemo(() => {
    return [...data.articles]
      .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
      .slice(0, 5);
  }, [data.articles]);

  // Top performing posts - TODO: Buscar views da collection article_views
  const topPosts = useMemo(() => {
    return [...data.articles]
      .filter(a => a.status === 'published')
      .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
      .slice(0, 5);
  }, [data.articles]);

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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-3">
      {/* Seção: Visão Geral */}
      <SectionSeparator 
        title="Visão Geral" 
        description="Resumo do seu hub"
        icon={Activity}
      />
      {/* <QuickActions /> */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard
          icon={FileText}
          label="Posts"
          value={data.articles.length}
          sublabel={`${stats.publishedPosts} publicados`}
          href="/admin/posts"
        />
        <StatCard
          icon={Eye}
          label="Views"
          value={formatNumber(stats.totalViews)}
          trend="+12%"
        />
        <StatCard
          icon={Link2}
          label="Links"
          value={data.links.length}
          sublabel={`${stats.activeLinks} ativos`}
          href="/admin/links"
        />
        <StatCard
          icon={FolderOpen}
          label="Álbuns"
          value={data.albums.length}
          sublabel={`${stats.publicAlbums} públicos`}
          href="/admin/albums"
        />
        <StatCard
          icon={ImageIcon}
          label="Mídia"
          value={stats.totalMedia}
          sublabel="arquivos"
          href="/admin/media"
        />
        <StatCard
          icon={Users}
          label="Visitantes"
          value={formatNumber(data.analytics?.uniqueVisitors || 0)}
          trend="+8%"
        />
      </div>

      {/* Seção: Conteúdo */}
      <SectionSeparator 
        title="Conteúdo" 
        description="Posts recentes e uploads"
        icon={Newspaper}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RecentPosts posts={recentPosts} />
        <RecentUploads media={data.recentMedia} />
      </div>

      {/* Seção: Analytics */}
      <SectionSeparator 
        title="Analytics" 
        description="Tráfego, dispositivos e performance"
        icon={BarChart3}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <TrafficChart data={data.analytics?.clicksByDate || []} />
        <DeviceStats
          desktop={data.analytics?.deviceStats.desktop || 0}
          mobile={data.analytics?.deviceStats.mobile || 0}
          tablet={data.analytics?.deviceStats.tablet || 0}
          totalClicks={data.analytics?.totalClicks || 0}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
        <TopPosts posts={topPosts} />
        <TopLinks links={data.analytics?.topLinks || []} />
      </div>
    </div>
  );
}
