'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@cappuccino/web-sdk';
import Image from 'next/image';
import Button from '@/_components/Button';
import { useSettings } from '@/lib/contexts/SettingsContext';
import { getMediaUrl } from '@/lib/medias/Media.controller';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, user, initializing } = useAuth();
  const { loginLogo } = useSettings();

  // URL da logo: usa do banco se existir, senão usa fallback
  const logoUrl = loginLogo?.fileName
    ? getMediaUrl({ fileName: loginLogo.fileName })
    : '/images/logos/nerdcave-white.png';

  // Carregar credenciais salvas se existirem
  useEffect(() => {
    const savedLogin = localStorage.getItem('nerdcave_saved_login');
    if (savedLogin) {
      setLogin(savedLogin);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn({ login, password });

      if (result.error) {
        throw new Error(result.errorMsg ?? 'Falha no login. Verifique suas credenciais.');
      }

      // Salvar ou limpar credenciais baseado no checkbox
      if (rememberMe) {
        localStorage.setItem('nerdcave_saved_login', login);
      } else {
        localStorage.removeItem('nerdcave_saved_login');
      }

      console.log('Login success! User:', result.document);

      // Redirecionar direto após login bem sucedido
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: 'url(/images/background/nerdcave-background-dark-blue.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-sm w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-md shadow-2xl p-6 border border-white/20">
          {/* Logo/Header */}
          <div className="text-center mb-5">
            <Image
              src={logoUrl}
              alt="Logo"
              width={160}
              height={64}
              className="mx-auto mb-2"
              priority
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-200 mb-1.5">
                Usuário
              </label>
              <input
                id="login"
                name="login_field"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                placeholder="seu_usuario"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1.5">
                Senha
              </label>
              <input
                id="password"
                name="password_field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-nerdcave-purple focus:ring-nerdcave-purple focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-300 cursor-pointer select-none">
                Lembrar meu usuário
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || initializing}
              loading={loading}
              size="md"
              bgColor="bg-nerdcave-purple"
              textColor="text-white"
              className="w-full"
            >
              Entrar
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <a href="/" className=" text-nerdcave-light hover:text-nerdcave-lime text-sm transition-colors">
              ← Voltar para o site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
