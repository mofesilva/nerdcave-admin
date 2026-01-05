"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth, useApiClient } from "@cappuccino/web-sdk";

interface AutoLoginContextType {
    isReady: boolean;
    isGuest: boolean;
    error: string | null;
    loginAsGuest: () => Promise<void>;
}

const AutoLoginContext = createContext<AutoLoginContextType | undefined>(undefined);

// Credenciais do visitante
const GUEST_NAME = "Visitante";
// ID da role "Visitante" do banco de dados
const GUEST_ROLE_ID = process.env.NEXT_PUBLIC_GUEST_ROLE_ID || "6939e8f8e8f659ea26bb2e2b";

// Gerar senha única por sessão do navegador
function getOrCreateGuestCredentials(): { login: string; password: string; email: string } {
    if (typeof window === "undefined") {
        return { login: "guest-ssr", password: "guest-ssr", email: "guest-ssr@nerdcave.app" };
    }

    let credentials = sessionStorage.getItem("guest_credentials");
    if (!credentials) {
        // Gera credenciais únicas para esta sessão
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 10);
        const newCredentials = {
            login: `visitante_${timestamp}_${random}`,
            password: `pwd_${timestamp}_${random}`,
            email: `visitante_${timestamp}_${random}@nerdcave.app`,
        };
        sessionStorage.setItem("guest_credentials", JSON.stringify(newCredentials));
        return newCredentials;
    }
    return JSON.parse(credentials);
}

export function AutoLoginProvider({ children }: { children: ReactNode }) {
    const { user, initializing, signIn } = useAuth();
    const apiClient = useApiClient();

    const [isReady, setIsReady] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attemptedLogin, setAttemptedLogin] = useState(false);

    const performGuestLogin = useCallback(async (force = false) => {
        if ((attemptedLogin && !force) || !apiClient) return;
        setAttemptedLogin(true);
        setIsReady(false);
        setError(null);

        // Limpa credenciais antigas se for forçado (após logout)
        if (force) {
            sessionStorage.removeItem("guest_credentials");
        }

        const credentials = getOrCreateGuestCredentials();

        try {
            // Primeiro tenta fazer login (caso o usuário já exista no banco)
            console.log("[AutoLogin] Tentando login com visitante existente...", credentials.login);
            const loginResult = await signIn({ login: credentials.login, password: credentials.password });

            if (!loginResult.error) {
                console.log("[AutoLogin] Login do visitante bem-sucedido");
                setIsGuest(true);
                setIsReady(true);
                return;
            }

            // Login falhou - usuário não existe, vamos criar
            console.log("[AutoLogin] Visitante não existe, criando novo usuário...");

            const createResult = await apiClient.request<{ _id: string }>('/dbusers', {
                method: 'POST',
                body: JSON.stringify({
                    name: GUEST_NAME,
                    email: credentials.email,
                    login: credentials.login,
                    password: credentials.password,
                    role_id: GUEST_ROLE_ID,
                }),
            });

            if (createResult.error) {
                console.error("[AutoLogin] Falha ao criar visitante:", createResult.errorMsg);
                sessionStorage.removeItem("guest_credentials");
                setError(createResult.errorMsg || "Falha ao criar usuário visitante");
                setIsReady(true);
                return;
            }

            console.log("[AutoLogin] Usuário visitante criado, fazendo login...");

            // Agora faz login com o novo usuário
            const newLoginResult = await signIn({ login: credentials.login, password: credentials.password });

            if (!newLoginResult.error) {
                console.log("[AutoLogin] Login do visitante bem-sucedido");
                setIsGuest(true);
                setIsReady(true);
            } else {
                console.error("[AutoLogin] Falha no login após criar usuário:", newLoginResult.errorMsg);
                setError(newLoginResult.errorMsg || "Falha ao fazer login após criar usuário");
                setIsReady(true);
            }
        } catch (err) {
            console.error("[AutoLogin] Erro no processo de auto-login:", err);
            setError("Erro ao fazer login automático");
            setIsReady(true);
        }
    }, [signIn, attemptedLogin, apiClient]);

    const loginAsGuest = useCallback(async () => {
        await performGuestLogin(true);
    }, [performGuestLogin]);

    useEffect(() => {
        if (initializing) return;

        if (user) {
            // Usuário já logado (admin ou visitante)
            console.log("[AutoLogin] Usuário já logado:", user.login);
            setIsGuest(user.login?.startsWith("visitante_") || false);
            setIsReady(true);
        } else {
            // Nenhum usuário logado, criar e fazer login como visitante
            performGuestLogin();
        }
    }, [initializing, user, performGuestLogin]);

    return (
        <AutoLoginContext.Provider value={{ isReady, isGuest, error, loginAsGuest }}>
            {children}
        </AutoLoginContext.Provider>
    );
}

export function useAutoLogin() {
    const context = useContext(AutoLoginContext);
    if (context === undefined) {
        throw new Error("useAutoLogin must be used within an AutoLoginProvider");
    }
    return context;
}
