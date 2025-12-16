"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Link as LinkIcon,
    User,
    BarChart3,
    Settings,
    Search,
    ChevronRight,
    ChevronLeft,
    Sun,
    Moon,
    FolderTree,
    Tag,
    Image,
    Images,
    type LucideIcon,
} from "lucide-react";
import { useAuth } from '@cappuccino/web-sdk';
import UserProfileCard from "./UserProfileCard";
import NavigationMenu from "./NavigationMenu";
import SidebarHeader from "./SidebarHeader";
import { useTheme } from '../../ThemeProvider';

interface AdminLayoutProps {
    children: React.ReactNode;
    user?: any;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Links', href: '/admin/links', icon: LinkIcon },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Tags', href: '/admin/tags', icon: Tag },
    { name: 'Albums', href: '/admin/albums', icon: Images },
    { name: 'Media', href: '/admin/media', icon: Image },
    { name: 'Profile', href: '/admin/profile', icon: User },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children, user }: AdminLayoutProps) {
    const router = useRouter();
    const { signOut } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            if (user?.id) {
                await signOut(user.id);
            }
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex p-4 gap-4">
            <aside
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={`${isExpanded ? 'w-64' : 'w-20'
                    } bg-sidebar rounded-3xl text-sidebar-foreground flex flex-col py-6 pb-4 transition-[width] duration-300 ease-in-out shrink-0 overflow-hidden`}
            >
                {/* Header com logo */}
                <SidebarHeader isExpanded={isExpanded} />

                {/* Navegação */}
                <NavigationMenu items={navigation} isExpanded={isExpanded} />

                {/* Seção inferior com usuário e logout */}
                <UserProfileCard
                    user={user}
                    isExpanded={isExpanded}
                    onLogout={handleLogout}
                    loggingOut={loggingOut}
                />
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="h-14 flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-2.5 w-80">
                            <Search className="w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search something..."
                                className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Theme toggle */}
                            <ThemeToggle />


                        </div>
                    </header>

                    <main className="flex-1 overflow-auto">
                        <div className="w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

    const toggle = () => setTheme(isDark ? 'light' : 'dark');

    return (
        <button
            role="switch"
            aria-checked={isDark}
            onClick={toggle}
            title={isDark ? 'Switch to light' : 'Switch to dark'}
            className="relative w-20 h-10 rounded-2xl transition-all focus:outline-none cursor-pointer"
        >
            {/* background */}
            <span className="absolute inset-0 rounded-2xl bg-card transition-colors" />

            {/* knob abaixo dos ícones */}
            <span
                className={`absolute top-1 w-8 h-8 bg-primary rounded-xl shadow-lg transition-all ${isDark ? 'right-1' : 'left-1'}`}
            />

            {/* ícones acima do knob */}
            <Sun className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-opacity z-10 ${isDark ? 'text-foreground opacity-50' : 'text-background opacity-100'}`} />
            <Moon className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-opacity z-10 ${isDark ? 'text-foreground opacity-100' : 'text-foreground opacity-50'}`} />
        </button>
    );
}
