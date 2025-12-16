"use client";

import React from "react";

interface SidebarHeaderProps {
    isExpanded: boolean;
}

export default function SidebarHeader({ isExpanded }: SidebarHeaderProps) {
    return (
        <div className="mb-8 h-10 flex items-center">
            <div className="w-20 flex items-center justify-center shrink-0">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xl">N</span>
                </div>
            </div>
            <div
                className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'w-40 opacity-100' : 'w-0 opacity-0'
                    }`}
            >
                <span className="text-lg font-bold whitespace-nowrap">NerdCave</span>
            </div>
        </div>
    );
}
