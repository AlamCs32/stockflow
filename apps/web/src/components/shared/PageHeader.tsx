import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  actionLabel,
  onAction,
  actionDisabled,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">{title}</h1>
        {description && <p className="text-text-secondary">{description}</p>}
      </div>
      {action ?? (
        actionLabel && (
          <Button onClick={onAction} disabled={actionDisabled}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
