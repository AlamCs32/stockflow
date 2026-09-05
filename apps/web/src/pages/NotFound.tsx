import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <div className="space-y-2 text-center">
        <h1 className="text-6xl font-bold text-text-primary">404</h1>
        <p className="text-lg text-text-secondary">
          This page doesn't exist or has been moved.
        </p>
      </div>
      <Button asChild>
        <Link to="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
