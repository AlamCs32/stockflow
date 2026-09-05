import { useEffect, useState } from 'react';
import type { Item } from '@stockflow/shared';
import { APP_NAME } from '@stockflow/shared';

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/items')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setItems(data.items ?? []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
      {error ? (
        <p className="mt-2 text-destructive">Error: {error}</p>
      ) : null}
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="text-foreground">
            {item.name}
          </li>
        ))}
        {!error && items.length === 0 ? <p className="text-muted-foreground">Loading...</p> : null}
      </ul>
    </div>
  );
}
