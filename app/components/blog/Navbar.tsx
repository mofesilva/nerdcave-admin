"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
    { href: "/", label: "The Hub" },
    { href: "/artigos", label: "Artigos" },
    { href: "/galeria", label: "Galeria" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if we're on the homepage to apply transparent navbar
    const isHomePage = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            // On homepage, become solid after scrolling past the hero (75vh - some offset)
            const scrollThreshold = isHomePage ? window.innerHeight * 0.75 - 80 : 50;
            setIsScrolled(window.scrollY > scrollThreshold);
        };

        // Run on mount to set initial state
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHomePage]);

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };

    // Determine navbar background based on page and scroll state
    const getNavbarBackground = () => {
        if (isScrolled) {
            return "bg-nerdcave-dark shadow-lg shadow-nerdcave-dark/50";
        }
        if (isHomePage) {
            return "bg-transparent";
        }
        return "bg-nerdcave-dark";
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarBackground()}`}
        >
            <div className="max-w-6xl mx-auto">
                <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-18" : "h-24"
                    }`}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <div className={`relative transition-all duration-300 ${isScrolled ? "w-12 h-12" : "w-16 h-16"
                            }`}>
                            <Image
                                src="/images/logos/nerdcave-green.png"
                                alt="Nerdcave"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 text-sm font-medium outfit outfit-500 transition-colors ${isActive(link.href)
                                    ? "text-nerdcave-lime"
                                    : "text-nerdcave-light/70 hover:text-nerdcave-light"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-nerdcave-light/70 hover:text-nerdcave-light transition-colors"
                        aria-label="Menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-64 pb-4" : "max-h-0"
                        }`}
                >
                    <div className="flex flex-col border-t border-nerdcave-purple/20 pt-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`px-2 py-3 text-sm font-medium outfit outfit-500 transition-colors ${isActive(link.href)
                                    ? "text-nerdcave-lime"
                                    : "text-nerdcave-light/70"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/links"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="mt-2 px-4 py-2.5 text-sm font-medium bg-nerdcave-purple text-nerdcave-light rounded-lg text-center outfit outfit-500"
                        >
                            Links
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
