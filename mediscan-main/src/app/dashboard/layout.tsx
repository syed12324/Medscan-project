import { AppHeader } from '@/components/layout/app-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
