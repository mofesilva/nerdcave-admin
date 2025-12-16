"use client";

import { useEffect, useState } from "react";
import ProfileSection from "./components/ProfileSection";
import LinkCard from "./components/LinkCard";
import SocialLinks from "./components/SocialLinks";
import { LinksController } from "@/lib/controllers";
import type { Link } from "@/types";

export default function Home() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchLinks() {
      setLoading(true);
      const models = await LinksController.getAll();
      console.log('Models:', models);
      if (mounted) {
        const allLinks = models.map(m => m.toJSON());
        console.log('All links:', allLinks);
        const mainLinks = allLinks.filter(l => l.type === 'main');
        console.log('Main links:', mainLinks);
        setLinks(mainLinks);
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
                    gradient={link.gradient}
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
