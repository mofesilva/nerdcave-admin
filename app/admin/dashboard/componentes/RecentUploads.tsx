"use client";

import Link from "next/link";
import { ImageIcon, Upload } from "lucide-react";
import CardTitleSection from "@/_components/CardTitleSection";
import SkeletonImage from "@/_components/SkeletonImage";
import type { Media } from "@/lib/medias/Media.model";
import * as MediaController from "@/lib/medias/Media.controller";

interface RecentUploadsProps {
    media: Media[];
}

export default function RecentUploads({ media }: RecentUploadsProps) {
    return (
        <div className="bg-card rounded-md border border-border p-6">
            <CardTitleSection
                title="Uploads Recentes"
                subtitle="Últimas imagens adicionadas"
                trailing={
                    <Link
                        href="/admin/media"
                        className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
                    >
                        Ver todos
                        <span className="text-xs">↗</span>
                    </Link>
                }
            />

            {media.length > 0 ? (
                <div className="grid grid-cols-5 gap-2">
                    {media.map((item) => (
                        <Link
                            key={item._id}
                            href={`/admin/media?selected=${item._id}`}
                            className="relative aspect-square rounded-md overflow-hidden group"
                        >
                            <SkeletonImage
                                src={MediaController.getMediaUrl({ fileName: item.fileName })}
                                alt={item.title || item.fileName}
                                fill
                                sizes="(max-width: 768px) 20vw, 100px"
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum upload ainda</p>
                </div>
            )}
        </div>
    );
}
