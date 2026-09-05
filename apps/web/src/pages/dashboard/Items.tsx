import { Package } from 'lucide-react';
import { useGetItemsQuery } from '@/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/shared';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState, ErrorState, PageTransition } from '@/components/shared';

export function Items() {
  const { data, isLoading, error, refetch } = useGetItemsQuery();

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Items</h1>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full glass-card" />
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Items</h1>
          <ErrorState
            title="Could not load items"
            message="Something went wrong while fetching your inventory. Check your connection and try again."
            onRetry={refetch}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Items</h1>

        {data?.items?.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No items yet"
            description="Add your first item to start tracking inventory across channels."
          />
        ) : (
          <div className="glass-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border-subtle">
                  <TableHead className="text-text-secondary">Name</TableHead>
                  <TableHead className="text-text-secondary">SKU</TableHead>
                  <TableHead className="text-text-secondary">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items?.map((item) => (
                  <TableRow key={item.id} className="border-border-subtle">
                    <TableCell className="font-medium text-text-primary">{item.name}</TableCell>
                    <TableCell className="text-text-muted">—</TableCell>
                    <TableCell>
                      <Badge variant="success">Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
