import type { Media } from "@/lib/medias/Media.model";
import type { TiptapContent } from "@/types/TiptapContent.types";
import { PostStatus } from "../../types/Article.types";

/** Informações do autor do artigo */
export type ArticleAuthor = {
    name: string;
    photo?: string; // URL da foto do usuário (futuro: vem de DBUser.informations.photo)
}

export type Article = {
    _id: string;
    title: string;
    slug: string;
    /** Conteúdo estruturado JSON do Tiptap */
    content: TiptapContent | null;
    coverMedia?: Media;
    category?: string;
    tags: string[];
    author?: ArticleAuthor;
    status: PostStatus;
    publishedAt?: string;
    scheduledAt?: string;
    readingTime: number;
    isFeatured: boolean;
    seoTitle?: string;
    seoDescription?: string;
    deleted: boolean;
    createdAt?: string;
    updatedAt?: string;
    updatedBy?: string;
}

/** Versão resumida do Article para listagens (dashboard, cards) */
export type ArticleSummary = {
    _id: string;
    title: string;
    slug: string;
    status: PostStatus;
    publishedAt?: string;
    coverMedia?: Media;
    category?: string;
}
