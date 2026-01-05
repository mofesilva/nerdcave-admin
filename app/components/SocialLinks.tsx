"use client";

import { useEffect, useState } from "react";
import * as LinkController from "@/lib/links/Link.controller";
import type { Link } from "@/lib/links/Link.model";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Github,
    Youtube,
    Globe,
} from "lucide-react";

const iconMap: Record<string, any> = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    github: Github,
    youtube: Youtube,
    website: Globe,
};

export default function SocialLinks() {
    const [socialLinks, setSocialLinks] = useState<Link[]>([]);

    useEffect(() => {
        async function loadSocials() {
            try {
                const links = await LinkController.getSocialLinks();
                const socials = links
                    .filter((link) => link.isActive)
                    .sort((a, b) => a.order - b.order);
                setSocialLinks(socials);
            } catch (error) {
                console.error('Error loading social links:', error);
            }
        }
        loadSocials();
    }, []);

    if (socialLinks.length === 0) return null;

    return (
        <div className="flex justify-center gap-4">
            {socialLinks.map((social: any) => {
                const Icon = iconMap[social.icon] || Globe;
                return (
                    <a
                        key={social._id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center group"
                        title={social.title}
                    >
                        <Icon className="w-6 h-6" />
                    </a>
                );
            })}
        </div>
    );
}
