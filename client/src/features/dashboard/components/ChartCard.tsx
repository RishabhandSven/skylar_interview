import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Jan', value: 4000000 },
  { name: 'Feb', value: 5000000 },
  { name: 'Mar', value: 4500000 },
  { name: 'Apr', value: 6000000 },
  { name: 'May', value: 7500000 },
  { name: 'Jun', value: 8500000 },
  { name: 'Jul', value: 10000000 },
];

export const ChartCard: React.FC = () => {
  const formatYAxis = (tickItem: number) => {
    return `$${(tickItem / 1000000).toFixed(1)}M`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTooltip = (value: any) => {
    return [`$${Number(value).toLocaleString()}`, 'Pipeline Value'] as [string, string];
  };

  return (
    <div className="p-4 sm:p-6 border border-border bg-surface rounded-md shadow-sm min-h-[280px] flex flex-col w-full min-w-0">
      <h4 className="font-display font-semibold text-xs tracking-wide text-text-secondary uppercase mb-4 shrink-0">
        Pipeline Growth Curve
      </h4>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
};
