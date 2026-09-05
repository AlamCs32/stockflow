import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/shared/Sidebar';
import { Header } from '@/components/shared/Header';
import { useAppSelector } from '@/store';

export function DashboardLayout() {
  const sidebarOpen = useAppSelector((state) => state.app.sidebarOpen);

  return (
    <div className="min-h-screen bg-neutral-bg1">
      <Sidebar />
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
