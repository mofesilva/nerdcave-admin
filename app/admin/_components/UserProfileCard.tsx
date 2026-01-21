"use client";

import { User } from "lucide-react";

interface UserProfileCardProps {
    user?: {
        name?: string;
        email?: string;
    };
    isExpanded: boolean;
}

export default function UserProfileCard({
    user,
    isExpanded,
}: UserProfileCardProps) {
    return (
        <div className="mt-auto w-full px-2 2xl:px-3">
            <div className="bg-primary rounded-md overflow-hidden">
                {/* User info */}
                <div
                    className="flex items-center h-10 2xl:h-14"
                    title={!isExpanded ? (user?.name || user?.email) : undefined}
                >
                    <div className="w-10 2xl:w-14 h-10 2xl:h-14 flex items-center justify-center shrink-0">
                        <div className="w-7 h-7 2xl:w-10 2xl:h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                            {user?.name ? (
                                <span className="text-xs 2xl:text-sm font-bold uppercase text-primary-foreground">
                                    {user.name.charAt(0)}
                                </span>
                            ) : (
                                <User className="w-4 h-4 2xl:w-5 2xl:h-5 text-primary-foreground" />
                            )}
                        </div>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 pr-3 ${isExpanded ? 'flex-1 opacity-100' : 'w-0 opacity-0'
                        }`}>
                        <p className="text-xs 2xl:text-sm font-medium truncate whitespace-nowrap text-primary-foreground">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-[10px] 2xl:text-xs text-primary-foreground/70 truncate whitespace-nowrap">
                            {user?.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
