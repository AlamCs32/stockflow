import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-bg1 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary">StockFlow</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Multi-channel inventory management
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
