"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  User, 
  BarChart3, 
  Settings,
  LogOut 
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Links', href: '/admin/links', icon: LinkIcon },
  { name: 'Profile', href: '/admin/profile', icon: User },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-slate-800">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
              🤓
            </div>
            <div>
              <h1 className="font-bold text-lg">Nerdcave</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-400">admin@nerdcave.com</p>
              </div>
              <button 
                className="text-gray-400 hover:text-white"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-8 py-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {navigation.find(item => item.href === pathname)?.name || 'Admin'}
            </h2>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
