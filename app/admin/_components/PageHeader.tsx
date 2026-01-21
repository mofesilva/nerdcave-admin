import { Menu, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import IconContainer from "@/_components/IconContainer";
import PageTitle from "./PageTitle";

interface PageHeaderProps {
    pageTitle: string;
    pageDescription?: string;
    onMenuClick: () => void;
    onLogout: () => void;
    loggingOut: boolean;
}

export default function PageHeader({
    pageTitle,
    pageDescription,
    onMenuClick,
    onLogout,
    loggingOut,
}: PageHeaderProps) {
    return (
        <header className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-md hover:bg-muted text-foreground"
                    aria-label="Abrir menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <PageTitle title={pageTitle} description={pageDescription} />
            </div>
            <div className="flex items-center gap-4 sm:gap-3">
                <ThemeToggle />
                <button
                    onClick={onLogout}
                    disabled={loggingOut}
                    title="Sair da conta"
                    className="cursor-pointer"
                >
                    <IconContainer
                        icon={LogOut}
                        size="md"
                        className={loggingOut ? 'opacity-50' : ''}
                    />
                </button>
            </div>
        </header>
    );
}
