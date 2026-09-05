import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Login } from '@/pages/auth/Login';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { Catalog } from '@/pages/dashboard/Catalog';
import { Suppliers } from '@/pages/dashboard/Suppliers';
import { NotFound } from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: 'login', element: <Login /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'suppliers', element: <Suppliers /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
