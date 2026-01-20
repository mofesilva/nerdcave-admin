"use client";

import { FileText, Eye, Link2, FolderOpen, Image as ImageIcon, Users, Activity } from "lucide-react";
import StatCard from "./StatCard";
import SectionTitle from "./SectionTitle";
import { formatNumber } from "@/lib/utils";
import type { LinkStats } from "@/lib/links/Link.controller";
import type { ArticleStats } from "@/lib/articles/Article.controller";
import type { AlbumStats } from "@/lib/albums/Album.controller";

interface StatsSectionProps {
    links: LinkStats;
    articles: ArticleStats;
    albums: AlbumStats;
    totalMedia: number;
    uniqueVisitors?: number;
}

export default function StatsSection({
    links,
    articles,
    albums,
    totalMedia,
    uniqueVisitors = 0,
}: StatsSectionProps) {
    return (
        <section>
            <SectionTitle
                title="Visão Geral"
                description="Resumo do seu hub"
                icon={Activity}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <StatCard
                    icon={FileText}
                    label="Posts"
                    value={articles.total}
                    sublabel={`${articles.published} publicados`}
                    href="/admin/posts"
                />
                <StatCard
                    icon={Eye}
                    label="Views"
                    value={formatNumber(0)}
                    trend="+12%"
                />
                <StatCard
                    icon={Link2}
                    label="Links"
                    value={links.total}
                    sublabel={`${links.active} ativos`}
                    href="/admin/links"
                />
                <StatCard
                    icon={FolderOpen}
                    label="Álbuns"
                    value={albums.total}
                    sublabel={`${albums.published} públicos`}
                    href="/admin/albums"
                />
                <StatCard
                    icon={ImageIcon}
                    label="Mídia"
                    value={totalMedia}
                    sublabel="arquivos"
                    href="/admin/media"
                />
                <StatCard
                    icon={Users}
                    label="Visitantes"
                    value={formatNumber(uniqueVisitors)}
                    trend="+8%"
                />
            </div>
        </section>
    );
}