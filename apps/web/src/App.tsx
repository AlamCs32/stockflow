import { APP_NAME } from '@stockflow/shared';
import { useGetItemsQuery } from '@/store';

export default function App() {
  const { data, error, isLoading } = useGetItemsQuery();

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
      {error ? (
        <p className="mt-2 text-destructive">Error: Failed to fetch items</p>
      ) : null}
      <ul className="mt-4 space-y-2">
        {data?.items?.map((item) => (
          <li key={item.id} className="text-foreground">
            {item.name}
          </li>
        ))}
        {isLoading ? <p className="text-muted-foreground">Loading...</p> : null}
      </ul>
    </div>
  );
}
