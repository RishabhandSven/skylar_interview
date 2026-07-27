import { memo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartPoint } from '../../../types/insights';
import { EmptyState } from './EmptyState';

interface ChartCardProps {
  data: ChartPoint[];
}

export const ChartCard = memo(function ChartCard({ data }: ChartCardProps) {
  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1_000_000) {
      return `$${(tickItem / 1_000_000).toFixed(1)}M`;
    }
    if (tickItem >= 1_000) {
      return `$${(tickItem / 1_000).toFixed(0)}K`;
    }
    return `$${tickItem}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTooltip = (value: any) => {
    return [`$${Number(value).toLocaleString()}`, 'Pipeline Value'] as [string, string];
  };

  if (data.length === 0) {
    return (
      <div className="p-4 sm:p-6 border border-border bg-surface rounded-md shadow-sm min-h-[280px] flex flex-col w-full min-w-0">
        <h4 className="font-display font-semibold text-xs tracking-wide text-text-secondary uppercase mb-4 shrink-0">
          Pipeline Growth Curve
        </h4>
        <EmptyState
          title="No chart data available"
          message="Pipeline metrics were not detected in the current AI insight response."
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 border border-border bg-surface rounded-md shadow-sm min-h-[280px] flex flex-col w-full min-w-0">
      <h4 className="font-display font-semibold text-xs tracking-wide text-text-secondary uppercase mb-4 shrink-0">
        Pipeline Growth Curve
      </h4>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="var(--text-secondary)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--text-secondary)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '11px',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--brand)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
