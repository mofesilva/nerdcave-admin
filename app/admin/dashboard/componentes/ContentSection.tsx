"use client";

import { Newspaper } from "lucide-react";
import SectionTitle from "./SectionTitle";
import RecentPosts from "./RecentPosts";
import RecentUploads from "./RecentUploads";
import type { ArticleSummary } from "@/lib/articles/Article.model";
import type { Media } from "@/lib/medias/Media.model";

interface ContentSectionProps {
    recentPosts: ArticleSummary[];
    recentMedia: Media[];
}

export default function ContentSection({
    recentPosts,
    recentMedia,
}: ContentSectionProps) {
    return (
        <section>
            <SectionTitle
                title="Conteúdo"
                description="Posts recentes e uploads"
                icon={Newspaper}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <RecentPosts posts={recentPosts} />
                <RecentUploads media={recentMedia} />
            </div>
        </section>
    );
}
