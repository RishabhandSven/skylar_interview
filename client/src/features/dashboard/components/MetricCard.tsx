import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  changeText?: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue?: string;
  sparklineData: number[];
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  changeText,
  trend,
  trendValue,
  sparklineData,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-success" />;
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-danger" />;
      default:
        return <Minus className="w-4 h-4 text-text-secondary" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success bg-success/10';
      case 'down':
        return 'text-danger bg-danger/10';
      default:
        return 'text-text-secondary bg-border';
    }
  };

  // Convert sparkline numerical array to SVG coordinates
  const getSparklinePath = () => {
    const width = 120;
    const height = 40;
    const padding = 2;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;

    const points = sparklineData.map((val, index) => {
      const x = (index / (sparklineData.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((val - min) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="p-5 border border-border bg-surface rounded-md shadow-sm hover:shadow-md flex flex-col h-full min-h-[140px] w-full min-w-0 relative"
    >
      <div className="min-w-0">
        <p className="font-display font-medium text-xs text-text-secondary uppercase tracking-wider">
          {title}
        </p>
        <h3 className="font-display font-bold text-xl sm:text-2xl mt-2 text-text-primary leading-tight break-words">
          {value}
        </h3>
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        {/* Trend Indicator */}
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {trendValue && (
            <span className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${getTrendColor()}`}>
              {getTrendIcon()}
              {trendValue}
            </span>
          )}
          {changeText && (
            <span className="text-xs text-text-secondary">
              {changeText}
            </span>
          )}
        </div>

        {/* Sparkline Visualization */}
        <svg className="w-[100px] h-[35px] shrink-0 self-end" viewBox="0 0 120 40">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            d={getSparklinePath()}
            fill="none"
            stroke={trend === 'down' ? 'var(--danger)' : 'var(--success)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.div>
  );
};
