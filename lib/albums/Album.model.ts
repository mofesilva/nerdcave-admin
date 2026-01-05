import type { Media } from "@/lib/medias/Media.model";
import type { Tag } from "@/lib/tags/Tag.model";

type AlbumStatus = 'draft' | 'published';

export type Album = {
    _id: string;
    title: string;
    slug: string;
    description: string;
    coverMedia?: Media;  // ID do Media que é a capa
    medias: Media[];     // IDs dos Media neste álbum (ordem)
    categoryId: string;
    tags: Tag[];
    status: AlbumStatus;
    deleted: boolean;
}


