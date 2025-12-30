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
    FolderTree,
    Tag,
    Image,
    Images,
    FileText,
    type LucideIcon,
} from "lucide-react";
import { useAuth } from '@cappuccino/web-sdk';
import { useAutoLogin } from '@/lib/contexts/AutoLoginContext';
import UserProfileCard from "./UserProfileCard";
import NavigationMenu from "./NavigationMenu";
import SidebarHeader from "./SidebarHeader";
import ThemeToggle from "./ThemeToggle";

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
    description?: string;
}

const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, description: 'Bem vindo ao admin para gerenciar o hub Nerdcave Studio' },
    { name: 'Posts', href: '/admin/posts', icon: FileText, description: 'Gerencie seus artigos e publicações' },
    { name: 'Links', href: '/admin/links', icon: LinkIcon, description: 'Organize e personalize sua presença digital' },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree, description: 'Organize seu conteúdo em categorias' },
    { name: 'Tags', href: '/admin/tags', icon: Tag, description: 'Gerencie as tags do seu conteúdo' },
    { name: 'Albums', href: '/admin/albums', icon: Images, description: 'Gerencie suas galerias de fotos' },
    { name: 'Media', href: '/admin/media', icon: Image, description: 'Gerencie suas imagens' },
    { name: 'Profile', href: '/admin/profile', icon: User, description: 'Manage your profile information' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, description: 'Acompanhe suas métricas' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, description: 'Manage your application settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const { loginAsGuest } = useAutoLogin();
    const [loggingOut, setLoggingOut] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    // Pega o título e descrição da página baseado na rota atual
    const currentPage = navigation.find(item => pathname?.startsWith(item.href));
    const pageTitle = currentPage?.name || 'Admin';
    const pageDescription = currentPage?.description || '';

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            if (user?._id) {
                await signOut(user._id);
            }
            // Faz login como visitante após logout
            await loginAsGuest();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex p-4 gap-4">
            <aside
                className={`${isPinned ? 'w-64' : 'w-20'
                    } sticky top-4 h-[calc(100vh-2rem)] bg-sidebar rounded-3xl text-sidebar-foreground flex flex-col py-6 pb-4 transition-[width] duration-300 ease-in-out shrink-0 overflow-hidden`}
            >
                {/* Header com logo */}
                <SidebarHeader
                    isExpanded={isPinned}
                    isPinned={isPinned}
                    onTogglePin={() => setIsPinned(!isPinned)}
                />

                {/* Navegação */}
                <NavigationMenu items={navigation} isExpanded={isPinned} />

                {/* Seção inferior com usuário e logout */}
                <UserProfileCard
                    user={user ?? undefined}
                    isExpanded={isPinned}
                    onLogout={handleLogout}
                    loggingOut={loggingOut}
                />
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="w-full mx-auto">
                    <header className="h-14 flex items-center justify-between my-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{pageTitle}</h1>
                            {pageDescription && (
                                <p className="text-muted-foreground text-md">{pageDescription}</p>
                            )}
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
