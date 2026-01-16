"use client";

import Link from "next/link";
import { Link2, ExternalLink } from "lucide-react";
import CardTitleSection from "@/_components/CardTitleSection";

interface TopLink {
    linkId: string;
    title: string;
    clicks: number;
}

interface TopLinksProps {
    links: TopLink[];
}

export default function TopLinks({ links }: TopLinksProps) {
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    return (
        <div className="bg-card rounded-md border border-border p-6">
            <CardTitleSection
                title="Links Mais Clicados"
                subtitle="Performance dos seus links"
                trailing={
                    <Link href="/admin/links" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                        Gerenciar <ExternalLink className="w-3 h-3" />
                    </Link>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {links.slice(0, 6).map((link, index) => (
                    <div
                        key={link.linkId}
                        className="flex items-center gap-3 p-4 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                            <Link2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{link.title}</p>
                            <p className="text-sm text-muted-foreground">{formatNumber(link.clicks)} cliques</p>
                        </div>
                        {index === 0 && (
                            <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                #1
                            </div>
                        )}
                    </div>
                ))}
                {links.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                        <Link2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhum clique registrado ainda</p>
                    </div>
                )}
            </div>
        </div>
    );
}
