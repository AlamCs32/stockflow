import { Package, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { StatCard } from '@/components/shared';
import { PageTransition } from '@/components/shared';

const stats = [
  { title: 'Total items', value: '0', icon: Package, change: 'No items yet', changeType: 'neutral' as const },
  { title: 'Low stock', value: '0', icon: AlertTriangle, change: 'All good', changeType: 'positive' as const },
  { title: 'Inward today', value: '0', icon: TrendingUp, change: 'Start adding stock', changeType: 'neutral' as const },
  { title: 'Outward today', value: '0', icon: BarChart3, change: 'No activity', changeType: 'neutral' as const },
];

export function Dashboard() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              changeType={stat.changeType}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
