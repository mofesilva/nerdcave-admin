"use client";

import { useState } from "react";
import Image from "next/image";

interface Comment {
    _id: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
    likes: number;
}

interface User {
    name: string;
    email: string;
    avatar?: string;
}

interface CommentsSectionProps {
    articleId: string;
    comments?: Comment[];
}

// Mock comments
const mockComments: Comment[] = [
    {
        _id: "c1",
        userName: "Lucas Silva",
        content: "Excelente artigo! Me ajudou muito a planejar meu setup. Já estou de olho nos componentes que vocês recomendaram.",
        createdAt: "2024-12-16T14:30:00",
        likes: 5,
    },
    {
        _id: "c2",
        userName: "Marina Costa",
        content: "Finalmente um guia completo! A parte sobre gestão de cabos foi muito útil, meu setup estava uma bagunça 😅",
        createdAt: "2024-12-16T10:15:00",
        likes: 3,
    },
    {
        _id: "c3",
        userName: "Pedro Henrique",
        content: "Vocês poderiam fazer um artigo sobre monitores ultrawide? Estou em dúvida se vale a pena.",
        createdAt: "2024-12-15T22:45:00",
        likes: 8,
    },
];

export function CommentsSection({ articleId, comments = mockComments }: CommentsSectionProps) {
    const [user, setUser] = useState<User | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form states
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [formError, setFormError] = useState("");

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return "Agora mesmo";
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays}d atrás`;
        return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
    };

    const handleCommentClick = () => {
        if (!user) {
            setShowAuthModal(true);
            setAuthMode("login");
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (authMode === "register" && !formName.trim()) {
            setFormError("Nome é obrigatório");
            return;
        }
        if (!formEmail.trim() || !formEmail.includes("@")) {
            setFormError("Email inválido");
            return;
        }
        if (!formPassword.trim() || formPassword.length < 6) {
            setFormError("Senha deve ter no mínimo 6 caracteres");
            return;
        }

        // Mock auth - em produção, isso vai para o Cappuccino
        setUser({
            name: authMode === "register" ? formName : formEmail.split("@")[0],
            email: formEmail,
        });
        setShowAuthModal(false);
        setFormName("");
        setFormEmail("");
        setFormPassword("");
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setIsSubmitting(true);
        // Mock submit - em produção, salva no Cappuccino
        await new Promise((resolve) => setTimeout(resolve, 500));
        setNewComment("");
        setIsSubmitting(false);
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="mt-12 pt-8 border-t border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-card-foreground outfit outfit-700">
                    Comentários ({comments.length})
                </h3>
                {user && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground outfit outfit-400">
                            Logado como <strong className="text-card-foreground">{user.name}</strong>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-nerdcave-purple hover:underline outfit outfit-500"
                        >
                            Sair
                        </button>
                    </div>
                )}
            </div>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmitComment} className="mb-8">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-nerdcave-purple flex items-center justify-center text-white font-semibold outfit outfit-600 flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Escreva seu comentário..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nerdcave-purple transition-colors outfit outfit-400 resize-none"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || isSubmitting}
                                    className="px-6 py-2 rounded-lg bg-nerdcave-lime text-nerdcave-dark font-semibold outfit outfit-600 hover:bg-nerdcave-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Enviando..." : "Comentar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-8 p-6 rounded-xl bg-muted/50 border border-border text-center">
                    <p className="text-muted-foreground outfit outfit-400 mb-4">
                        Faça login ou cadastre-se para comentar
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => {
                                setAuthMode("login");
                                setShowAuthModal(true);
                            }}
                            className="px-6 py-2 rounded-lg bg-nerdcave-purple text-white font-semibold outfit outfit-600 hover:bg-nerdcave-purple/90 transition-colors"
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => {
                                setAuthMode("register");
                                setShowAuthModal(true);
                            }}
                            className="px-6 py-2 rounded-lg bg-nerdcave-lime text-nerdcave-dark font-semibold outfit outfit-600 hover:bg-nerdcave-lime/90 transition-colors"
                        >
                            Cadastrar
                        </button>
                    </div>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-nerdcave-dark flex items-center justify-center text-nerdcave-light font-semibold outfit outfit-600 flex-shrink-0 overflow-hidden">
                            {comment.userAvatar ? (
                                <Image
                                    src={comment.userAvatar}
                                    alt={comment.userName}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                />
                            ) : (
                                comment.userName.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-card-foreground outfit outfit-600">
                                    {comment.userName}
                                </span>
                                <span className="text-xs text-muted-foreground outfit outfit-400">
                                    {formatDate(comment.createdAt)}
                                </span>
                            </div>
                            <p className="text-muted-foreground outfit outfit-400 leading-relaxed">
                                {comment.content}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                                <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-nerdcave-purple transition-colors outfit outfit-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {comment.likes}
                                </button>
                                <button className="text-sm text-muted-foreground hover:text-nerdcave-purple transition-colors outfit outfit-500">
                                    Responder
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-card-foreground transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-card-foreground outfit outfit-700">
                                {authMode === "login" ? "Entrar" : "Criar conta"}
                            </h2>
                            <p className="text-muted-foreground outfit outfit-400 mt-1">
                                {authMode === "login"
                                    ? "Entre para comentar e interagir"
                                    : "Cadastre-se para participar da comunidade"}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAuth} className="space-y-4">
                            {authMode === "register" && (
                                <div>
                                    <label className="block text-sm font-medium text-card-foreground outfit outfit-500 mb-1">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        placeholder="Seu nome"
                                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nerdcave-purple transition-colors outfit outfit-400"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-card-foreground outfit outfit-500 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formEmail}
                                    onChange={(e) => setFormEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nerdcave-purple transition-colors outfit outfit-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-card-foreground outfit outfit-500 mb-1">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={formPassword}
                                    onChange={(e) => setFormPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nerdcave-purple transition-colors outfit outfit-400"
                                />
                            </div>

                            {formError && (
                                <p className="text-sm text-red-500 outfit outfit-400">{formError}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg bg-nerdcave-purple text-white font-semibold outfit outfit-600 hover:bg-nerdcave-purple/90 transition-colors"
                            >
                                {authMode === "login" ? "Entrar" : "Criar conta"}
                            </button>
                        </form>

                        {/* Toggle Auth Mode */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground outfit outfit-400">
                                {authMode === "login" ? (
                                    <>
                                        Não tem conta?{" "}
                                        <button
                                            onClick={() => setAuthMode("register")}
                                            className="text-nerdcave-lime hover:underline font-medium"
                                        >
                                            Cadastre-se
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Já tem conta?{" "}
                                        <button
                                            onClick={() => setAuthMode("login")}
                                            className="text-nerdcave-lime hover:underline font-medium"
                                        >
                                            Entrar
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
