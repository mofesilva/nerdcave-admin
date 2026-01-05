"use client";

import { useEffect, useState } from "react";
import ProfileSection from "./components/ProfileSection";
import LinkCard from "./components/LinkCard";
import SocialLinks from "./components/SocialLinks";
import * as LinkController from "@/lib/links/Link.controller";
import type { Link } from "@/lib/links/Link.model";

export default function LinksPage() {
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function fetchLinks() {
            setLoading(true);
            const allLinks = await LinkController.getMainLinks();
            console.log('Main links:', allLinks);
            if (mounted) {
                setLinks(allLinks.filter(l => l.isActive));
                setLoading(false);
            }
        }
        void fetchLinks();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="animate-in fade-in duration-500">
                    <ProfileSection />

                    {loading ? (
                        <div className="mt-8 text-center text-muted-foreground">Carregando...</div>
                    ) : (
                        <div className="mt-8 space-y-4">
                            {links.map((link) => (
                                <div key={link._id}>
                                    <LinkCard
                                        title={link.title}
                                        description={link.description}
                                        url={link.url}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-12">
                        <SocialLinks />
                    </div>

                    <footer className="mt-12 text-center text-muted-foreground text-sm pb-8">
                        <p>© 2024 Nerdcave. All rights reserved.</p>
                        <p className="mt-2">Built with Next.js & Tailwind CSS & Cappuccino Cloud</p>
                    </footer>
                </div>
            </div>
        </main>
    );
}
