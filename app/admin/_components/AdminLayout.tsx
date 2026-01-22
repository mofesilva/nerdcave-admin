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
    LogOut,
} from "lucide-react";
import { useAuth } from '@cappuccino/web-sdk';
import { useAutoLogin } from '@/lib/contexts/AutoLoginContext';
import { useSystemSettings } from '@/lib/contexts/SystemSettingsContext';
import PageHeader from "./PageHeader";
import FloatingScrollIndicators from "./FloatingScrollIndicators";
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

// Rotas ocultas (não aparecem na navegação mas são reconhecidas pelo sistema)
const hiddenRoutes: NavigationItem[] = [
    { name: 'Escrever', href: '/admin/compose', icon: FileText, description: 'Escreva seu post' },
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
        // Primeiro verifica rotas ocultas
        const hiddenRoute = hiddenRoutes.find(route => pathname?.startsWith(route.href));
        if (hiddenRoute) return hiddenRoute;
        
        // Depois verifica navegação principal
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
                isPinned={isPinned}
                onTogglePin={() => setIsPinned(!isPinned)}
                isDrawerOpen={isDrawerOpen}
                onCloseDrawer={handleCloseDrawer}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <div className={`mx-auto p-4 ${!fullWidthLayout ? 'w-full xl:w-2/3' : 'w-full'}`}>
                    <PageHeader
                        pageTitle={pageTitle}
                        pageDescription={pageDescription}
                        onMenuClick={() => setIsDrawerOpen(true)}
                        onLogout={handleLogout}
                        loggingOut={loggingOut}
                    />

                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
            <FloatingScrollIndicators
                canScrollUp={pageCanScrollUp}
                canScrollDown={pageCanScrollDown}
            />
        </div>
    );
}
