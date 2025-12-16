"use client";

import React from "react";
import TopLinkItem, { TopLink } from "./TopLinkItem";

interface TopLinksProps {
    topLinks: TopLink[];
}

export default function TopLinks({ topLinks }: TopLinksProps) {
    const maxClicks = topLinks?.[0]?.clicks || 1;

    return (
        <div className="bg-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-primary-foreground mb-5">Top Links</h3>
            <div className="space-y-4">
                {topLinks.map((link, index) => (
                    <TopLinkItem key={link.linkId} link={link} index={index} maxClicks={maxClicks} />
                ))}
            </div>
        </div>
    );
}
