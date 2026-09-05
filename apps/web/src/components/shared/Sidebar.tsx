import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector, toggleSidebar, logout } from '@/store';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/items', label: 'Items', icon: Package },
];

export function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.app.sidebarOpen);

  return (
    <aside
      className={cn(
        'glass-panel fixed left-0 top-0 z-40 h-screen transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {sidebarOpen && (
          <span className="text-lg font-bold text-text-primary">StockFlow</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleSidebar())}
          className="h-8 w-8 text-text-secondary hover:text-text-primary"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <Separator className="bg-border-subtle" />

      <nav className="mt-4 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          const link = (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand text-white'
                  : 'text-text-secondary hover:bg-neutral-bg3 hover:text-text-primary'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );

          if (!sidebarOpen) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return link;
        })}
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-2">
        <Separator className="mb-4 bg-border-subtle" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 text-text-secondary hover:text-text-primary',
                !sidebarOpen && 'justify-center px-0'
              )}
              onClick={() => dispatch(logout())}
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </TooltipTrigger>
          {!sidebarOpen && <TooltipContent side="right">Logout</TooltipContent>}
        </Tooltip>
      </div>
    </aside>
  );
}
