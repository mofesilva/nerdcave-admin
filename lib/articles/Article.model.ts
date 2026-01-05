import type { Media } from "@/lib/medias/Media.model";
import { PostStatus } from "../../types/Article.types";

export type Article = {
    _id: string;
    title: string;
    slug: string;
    content: string;
    coverMedia?: Media;
    category?: string;
    tags: string[];
    author?: string;
    status: PostStatus;
    publishedAt?: string;
    scheduledAt?: string;
    readingTime: number;
    isFeatured: boolean;
    seoTitle?: string;
    seoDescription?: string;
    deleted: boolean;
}
