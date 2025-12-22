"use client";

import { User, LogOut } from "lucide-react";

interface UserProfileCardProps {
    user?: {
        name?: string;
        email?: string;
    };
    isExpanded: boolean;
    onLogout: () => void;
    loggingOut?: boolean;
}

export default function UserProfileCard({
    user,
    isExpanded,
    onLogout,
    loggingOut = false
}: UserProfileCardProps) {
    return (
        <div className="mt-auto w-full px-3">
            <div className="bg-zinc-800 rounded-2xl border border-zinc-700 overflow-hidden">
                {/* User info */}
                <div
                    className="flex items-center h-14"
                    title={!isExpanded ? (user?.name || user?.email) : undefined}
                >
                    <div className="w-14 h-14 flex items-center justify-center shrink-0">
                        <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">
                            {user?.name ? (
                                <span className="text-sm font-bold uppercase text-white">
                                    {user.name.charAt(0)}
                                </span>
                            ) : (
                                <User className="w-5 h-5 text-white" />
                            )}
                        </div>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 pr-3 ${isExpanded ? 'flex-1 opacity-100' : 'w-0 opacity-0'
                        }`}>
                        <p className="text-sm font-medium truncate whitespace-nowrap text-white">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-zinc-400 truncate whitespace-nowrap">
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* Logout button */}
                <button
                    onClick={onLogout}
                    disabled={loggingOut}
                    title={!isExpanded ? "Sair da conta" : undefined}
                    className="w-full h-11 flex items-center hover:bg-red-600 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                    <div className="w-14 h-11 flex items-center justify-center shrink-0">
                        <LogOut className={`w-5 h-5 ${loggingOut ? 'animate-spin' : ''}`} />
                    </div>
                    <div className={`flex overflow-hidden transition-all duration-300 ${isExpanded ? 'flex-1 opacity-100' : 'w-0 opacity-0'
                        }`}>
                        <span className="text-sm font-medium whitespace-nowrap">Sair</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
