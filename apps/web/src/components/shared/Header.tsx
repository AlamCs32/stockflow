import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

export default function Header() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-6">
      <div />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-xs">
            0
          </Badge>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
        {user && (
          <span className="text-sm font-medium">{user.name}</span>
        )}
      </div>
    </header>
  );
}
