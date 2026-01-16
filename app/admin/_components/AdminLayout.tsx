"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
    X,
    Newspaper,
    Film,
    Music,
    Palette,
    type LucideIcon,
} from "lucide-react";
import { useAuth } from '@cappuccino/web-sdk';
import { useAutoLogin } from '@/lib/contexts/AutoLoginContext';
import UserProfileCard from "./UserProfileCard";
import NavigationMenu from "./NavigationMenu";
import SidebarHeader from "./SidebarHeader";
import ThemeToggle from "./ThemeToggle";
import ScrollIndicator from "@/_components/ScrollIndicator";

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
    description?: string;
}

interface NavigationSection {
    name: string;
    icon: LucideIcon;
    description?: string;
    items: NavigationItem[];
}

type NavigationEntry = NavigationItem | NavigationSection;

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
    const [loggingOut, setLoggingOut] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [pageCanScrollDown, setPageCanScrollDown] = useState(false);
    const [pageCanScrollUp, setPageCanScrollUp] = useState(false);

    // Fecha drawer ao mudar de rota
    useEffect(() => {
        setIsDrawerOpen(false);
    }, [pathname]);

    // Fecha drawer ao pressionar ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsDrawerOpen(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Bloqueia scroll quando drawer está aberta
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isDrawerOpen]);

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
                // É uma seção, busca nos items
                const found = entry.items.find(item => pathname?.startsWith(item.href));
                if (found) return found;
            } else {
                // É um item direto
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
            {/* Sidebar Desktop */}
            <aside
                className={`hidden md:flex ${isPinned ? 'w-64' : 'w-20'
                    } sticky top-4 h-[calc(100vh-2rem)] bg-sidebar rounded-3xl text-sidebar-foreground flex-col py-6 pb-4 transition-[width] duration-300 ease-in-out shrink-0 overflow-hidden`}
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

            {/* Drawer Mobile - Overlay */}
            {isDrawerOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-[100]"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Drawer Mobile - Sidebar */}
            <aside
                className={`md:hidden fixed top-0 left-0 h-full w-72 bg-sidebar text-sidebar-foreground flex flex-col py-6 pb-4 z-[101] transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Botão fechar no topo */}
                <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-sidebar-foreground"
                    aria-label="Fechar menu"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Logo centralizada */}
                <div className="flex justify-center mb-6">
                    <SidebarHeader
                        isExpanded={true}
                        isPinned={true}
                        onTogglePin={() => { }}
                        hideToggle
                    />
                </div>

                {/* Navegação */}
                <NavigationMenu items={navigation} isExpanded={true} />

                {/* Seção inferior com usuário e logout */}
                <UserProfileCard
                    user={user ?? undefined}
                    isExpanded={true}
                    onLogout={handleLogout}
                    loggingOut={loggingOut}
                />
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="w-full mx-auto">
                    <header className="h-14 flex items-center justify-between my-4">
                        <div className="flex items-center gap-3">
                            {/* Botão hamburger mobile */}
                            <button
                                onClick={() => setIsDrawerOpen(true)}
                                className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground"
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
