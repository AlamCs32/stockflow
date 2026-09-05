import { forwardRef } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, id, containerClassName, className, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <Label htmlFor={inputId} className={error ? 'text-status-error' : 'text-text-secondary'}>
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'glass-input flex h-10 w-full rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-status-error focus:border-status-error',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-status-error">{error}</p>}
        {hint && !error && <p className="text-sm text-text-muted">{hint}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
