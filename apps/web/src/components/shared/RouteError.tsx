import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RouteError() {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} — ${error.statusText}`;
    message = error.data?.message || 'Page not found or unavailable';
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <AlertCircle className="mb-4 h-12 w-12 text-status-error" />
      <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
      <p className="mt-2 max-w-md text-center text-sm text-text-secondary">{message}</p>
      <Button variant="outline" className="mt-6" asChild>
        <Link to="/dashboard">
          <Home className="mr-2 h-4 w-4" />
          Go to Dashboard
        </Link>
      </Button>
    </div>
  );
}
