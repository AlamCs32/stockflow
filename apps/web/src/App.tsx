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
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>{APP_NAME}</h1>
      {error ? <p style={{ color: 'crimson' }}>Error: {error}</p> : null}
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
        {!error && items.length === 0 ? <p>Loading...</p> : null}
      </ul>
    </div>
  );
}
