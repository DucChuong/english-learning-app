'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Home, BookOpen, BarChart3, Settings, LogOut, FileText } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/topics', label: 'Topics', icon: BookOpen },
    { href: '/sentences', label: 'Sentences', icon: FileText },
    { href: '/progress', label: 'Progress', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-primary">
            📚 EnglishApp
          </Link>

          <div className="hidden md:flex gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Button
                  key={link.href}
                  asChild
                  variant={isActive ? 'secondary' : 'ghost'}
                >
                  <Link href={link.href} className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Button
                  key={link.href}
                  asChild
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="icon"
                >
                  <Link href={link.href}>
                    <Icon className="w-5 h-5" />
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Sign Out Button */}
          {session && (
            <Button
              onClick={() => signOut({ callbackUrl: '/login' })}
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
