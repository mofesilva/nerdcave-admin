"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
    Menu,
    Newspaper,
    Film,
    Music,
    Palette,
} from "lucide-react";
import { useAuth } from '@cappuccino/web-sdk';
import { useAutoLogin } from '@/lib/contexts/AutoLoginContext';
import { useSystemSettings } from '@/lib/contexts/SystemSettingsContext';
import ThemeToggle from "./ThemeToggle";
import ScrollIndicator from "@/_components/ScrollIndicator";
import Sidebar, { type NavigationEntry, type NavigationItem } from "./Sidebar";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navigation: NavigationEntry[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, description: 'Bem vindo ao admin para gerenciar o hub Nerdcave Studio' },
    {
        name: 'Blog',
        icon: Newspaper,
        description: 'Gerencie seu conteúdo',
        items: [
            { name: 'Posts', href: '/admin/posts', icon: FileText, description: 'Gerencie seus artigos e publicações' },
            { name: 'Categorias', href: '/admin/categories', icon: FolderTree, description: 'Organize seu conteúdo em categorias' },
            { name: 'Tags', href: '/admin/tags', icon: Tag, description: 'Gerencie as tags do seu conteúdo' },
        ]
    },
    {
        name: 'Mídia',
        icon: Image,
        description: 'Gerencie seus arquivos',
        items: [
            { name: 'Galeria', href: '/admin/media', icon: Image, description: 'Gerencie suas imagens' },
            { name: 'Álbuns', href: '/admin/albums', icon: Images, description: 'Gerencie suas galerias de fotos' },
            { name: 'Vídeos', href: '/admin/videos', icon: Film, description: 'Gerencie seus vídeos' },
            { name: 'Áudios', href: '/admin/audios', icon: Music, description: 'Gerencie seus arquivos de áudio' },
        ]
    },
    { name: 'Links', href: '/admin/links', icon: LinkIcon, description: 'Organize e personalize sua presença digital' },
    { name: 'Perfil', href: '/admin/profile', icon: User, description: 'Gerencie suas informações de perfil' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, description: 'Acompanhe suas métricas' },
    { name: 'Tema', href: '/admin/theme', icon: Palette, description: 'Personalize a aparência do painel e site' },
    { name: 'Configurações', href: '/admin/settings', icon: Settings, description: 'Gerencie as configurações do sistema' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const { loginAsGuest } = useAutoLogin();
    const { fullWidthLayout } = useSystemSettings();
    const [loggingOut, setLoggingOut] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [pageCanScrollDown, setPageCanScrollDown] = useState(false);
    const [pageCanScrollUp, setPageCanScrollUp] = useState(false);

    // Verifica scroll da página (window)
    useEffect(() => {
        const checkPageScroll = () => {
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const hasMoreBelow = scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 10;
            const hasMoreAbove = scrollTop > 10;
            setPageCanScrollDown(hasMoreBelow);
            setPageCanScrollUp(hasMoreAbove);
        };

        const timeout = setTimeout(checkPageScroll, 100);
        window.addEventListener('scroll', checkPageScroll);
        window.addEventListener('resize', checkPageScroll);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('scroll', checkPageScroll);
            window.removeEventListener('resize', checkPageScroll);
        };
    }, [pathname]);

    // Pega o título e descrição da página baseado na rota atual
    const findCurrentPage = (): NavigationItem | undefined => {
        for (const entry of navigation) {
            if ('items' in entry) {
                const found = entry.items.find(item => pathname?.startsWith(item.href));
                if (found) return found;
            } else {
                if (pathname?.startsWith(entry.href)) return entry;
            }
        }
        return undefined;
    };
    const currentPage = findCurrentPage();
    const pageTitle = currentPage?.name || 'Admin';
    const pageDescription = currentPage?.description || '';

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            if (user?._id) {
                await signOut(user._id);
            }
            await loginAsGuest();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoggingOut(false);
        }
    };

    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <Sidebar
                navigation={navigation}
                user={user ?? undefined}
                onLogout={handleLogout}
                loggingOut={loggingOut}
                isPinned={isPinned}
                onTogglePin={() => setIsPinned(!isPinned)}
                isDrawerOpen={isDrawerOpen}
                onCloseDrawer={handleCloseDrawer}
            />

            <div className={`flex-1 flex flex-col min-w-0 ${isPinned ? 'md:ml-64' : 'md:ml-20'} transition-[margin] duration-300 ease-in-out`}>
                <div className={`mx-auto p-4 ${!fullWidthLayout ? 'w-full xl:w-2/3' : 'w-full'}`}>
                    <header className="h-14 flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {/* Botão hamburger mobile */}
                            <button
                                onClick={() => setIsDrawerOpen(true)}
                                className="md:hidden p-2 rounded-md hover:bg-muted text-foreground"
                                aria-label="Abrir menu"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{pageTitle}</h1>
                                {pageDescription && (
                                    <p className="text-muted-foreground text-sm md:text-md hidden sm:block">{pageDescription}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                        </div>
                    </header>

                    <main className="flex-1">
                        <div className="w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* Scroll indicators fixos na tela */}
            {pageCanScrollUp && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 md:left-[calc(50%+2.5rem)]">
                    <ScrollIndicator direction="up" fixed />
                </div>
            )}
            {pageCanScrollDown && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:left-[calc(50%+2.5rem)]">
                    <ScrollIndicator direction="down" fixed />
                </div>
            )}
        </div>
    );
}
