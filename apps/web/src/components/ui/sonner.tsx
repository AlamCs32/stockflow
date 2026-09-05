import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner, toast as sonnerToast, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

function toast(title: string, options?: { description?: string; duration?: number }) {
  return sonnerToast(title, options);
}

toast.success = (title: string, options?: { description?: string; duration?: number }) => {
  return sonnerToast.success(title, options);
};

toast.error = (title: string, options?: { description?: string; duration?: number }) => {
  return sonnerToast.error(title, options);
};

toast.warning = (title: string, options?: { description?: string; duration?: number }) => {
  return sonnerToast.warning(title, options);
};

toast.info = (title: string, options?: { description?: string; duration?: number }) => {
  return sonnerToast.info(title, options);
};

toast.loading = (title: string, options?: { description?: string }) => {
  return sonnerToast.loading(title, options);
};

toast.promise = <T,>(
  promise: Promise<T>,
  options: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  },
) => {
  return sonnerToast.promise(promise, options);
};

toast.dismiss = (toastId?: string | number) => {
  return sonnerToast.dismiss(toastId);
};

export { Toaster, toast };
