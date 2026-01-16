import { getServerClient } from '@/lib/cappuccino/server';

export interface SignInCredentials {
    email: string;
    password: string;
}

export interface SignInResult {
    success: boolean;
    user?: {
        token?: string;
        refresh_token?: string;
        [key: string]: unknown;
    };
    error?: string;
}

export interface CurrentUserResult {
    success: boolean;
    user?: Record<string, unknown>;
    error?: string;
}

/**
 * Realiza login do usuário via Cappuccino AuthManager.
 */
export async function signIn(credentials: SignInCredentials): Promise<SignInResult> {
    const { email, password } = credentials;

    if (!email || !password) {
        return { success: false, error: 'Email e senha são obrigatórios' };
    }

    try {
        const { authManager } = await getServerClient();

        const result = await authManager.signIn({
            login: email,
            password,
        });

        if (!result || result.error) {
            return {
                success: false,
                error: result?.errorMsg || 'Credenciais inválidas'
            };
        }

        return {
            success: true,
            user: result.document as SignInResult['user'],
        };
    } catch (error) {
        console.error('Auth Service - signIn error:', error);
        return { success: false, error: 'Erro interno ao processar login' };
    }
}

/**
 * Busca o usuário atual autenticado via token dos cookies.
 */
export async function getCurrentUser(): Promise<CurrentUserResult> {
    try {
        const { apiClient } = await getServerClient();
        const result = await apiClient.get('/dbauth/me');

        if (!result || result.error) {
            return { success: false, error: 'Usuário não encontrado' };
        }

        return {
            success: true,
            user: result.document as Record<string, unknown>,
        };
    } catch (error) {
        console.error('Auth Service - getCurrentUser error:', error);
        return { success: false, error: 'Erro ao buscar usuário' };
    }
}
