'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@cappuccino/web-sdk';
import AdminLayout from './_components/AdminLayout';
import { MediaPickerProvider } from '@/lib/contexts/MediaPickerContext';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, initializing } = useAuth();

  const hasAccess = user?.role?.toLowerCase() === 'admin';

  useEffect(() => {
    if (initializing) return;

    if (!hasAccess) {
      router.replace('/login');
    }
  }, [initializing, hasAccess, router]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Redirecionando...</div>
      </div>
    );
  }

  return (
    <MediaPickerProvider>
      <AdminLayout>{children}</AdminLayout>
    </MediaPickerProvider>
  );
}
