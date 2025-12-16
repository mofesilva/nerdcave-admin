'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@cappuccino/web-sdk';
import AdminLayout from './components/AdminLayout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, initializing } = useAuth();

  useEffect(() => {
    console.log('Admin layout - initializing:', initializing, 'user:', user);
    if (initializing) {
      console.log('Admin layout - still initializing');
      return;
    }
    if (!user) {
      console.log('Admin layout - no user, redirecting to login');
      router.replace('/login');
    } else {
      console.log('Admin layout - user exists, staying here');
    }
  }, [initializing, user, router]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
