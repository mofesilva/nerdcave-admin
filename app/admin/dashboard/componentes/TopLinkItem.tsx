"use client";

import React from "react";

export type TopLink = { linkId: string; title: string; clicks: number };

interface TopLinkItemProps {
    link: TopLink;
    index: number;
    maxClicks: number;
}

export default function TopLinkItem({ link, index, maxClicks }: TopLinkItemProps) {
    return (
        <div
            key={link.linkId}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer group"
        >
            <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base ${index === 0 ? "bg-primary group-hover:bg-secondary text-primary-foreground group-hover:text-secondary-foreground" : index === 1 ? "bg-neutral-800 text-white" : "bg-neutral-200 text-neutral-700"
                    }`}
                aria-hidden
            >
                {index + 1}
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary-foreground truncate group-hover:text-primary-foreground transition-colors">{link.title}</p>
                <p className="text-sm text-neutral-500 group-hover:text-secondary font-medium">{link.clicks} clicks</p>
            </div>

            <div className="w-24">
                <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary-foreground h-full rounded-full" style={{ width: `${(link.clicks / maxClicks) * 100}%` }} />
                </div>
            </div>
        </div>
    );
}
