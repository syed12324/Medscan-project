'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Microscope,
  Users,
  FileText,
  Settings,
  Stethoscope,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/analysis', label: 'Analysis', icon: Microscope },
  { href: '/dashboard/patients', label: 'Patients', icon: Users },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
];

export function TopNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 mr-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Stethoscope size={20} />
        </div>
        <span className="font-headline text-lg font-semibold">
          MediScan AI
        </span>
      </Link>

      {/* Navigation Items */}
      <div className="flex items-center space-x-1">
        {menuItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon size={16} />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}