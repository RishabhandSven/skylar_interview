import { memo } from 'react';
import { ChartCard } from '../components/ChartCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { motion } from 'framer-motion';
import { useInsights } from '../../../hooks/useInsights';
import { getErrorMessage, getErrorTitle } from '../../../services/api';

export const AnalyticsView = memo(function AnalyticsView() {
  const { parsed, isLoading, isError, error, refetch, isFetching } = useInsights();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4 sm:space-y-6 min-w-0"
      >
        <LoadingSkeleton variant="chart" />
        <LoadingSkeleton variant="list" />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title={getErrorTitle(error)}
        message={getErrorMessage(error)}
        onRetry={() => refetch()}
      />
    );
  }

  if (!parsed || parsed.isEmpty) {
    return (
      <EmptyState
        title="No analytics data available"
        message="Insights have not been generated yet. Sync to pull the latest Monday.com analytics."
        actionLabel="Retry"
        onAction={() => refetch()}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 sm:space-y-6 min-w-0"
    >
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-xl text-text-primary">
          Deep-Dive Business Analytics
        </h2>
        <p className="font-sans text-xs text-text-secondary mt-1">
          Historical and predictive trend charts for sales pipelines and closure metrics.
        </p>
        {isFetching && (
          <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mt-2">
            Refreshing analytics...
          </p>
        )}
      </div>

      {/* Chart Panel */}
      <ChartCard data={parsed.chartData} />

      {/* Deals Table Card */}
      <div className="p-4 sm:p-6 border border-border bg-surface rounded-md shadow-sm w-full min-w-0">
        <h4 className="font-display font-semibold text-xs tracking-wide text-text-secondary uppercase mb-4">
          Pipeline Deals Catalog
        </h4>
        {parsed.deals.length === 0 ? (
          <EmptyState
            title="No deals catalogued"
            message="Deal references were not detected in the current AI insight response."
          />
        ) : (
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full min-w-[640px] text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-border text-text-secondary pb-2">
                  <th className="py-2.5 font-semibold">Deal Name</th>
                  <th className="py-2.5 font-semibold">Value</th>
                  <th className="py-2.5 font-semibold">Target Close Date</th>
                  <th className="py-2.5 font-semibold">Sales Stage</th>
                  <th className="py-2.5 font-semibold">Risk State</th>
                </tr>
              </thead>
              <tbody>
                {parsed.deals.map((deal) => (
                  <tr key={deal.id} className="border-b border-border hover:bg-surface-hover/50 transition-colors">
                    <td className="py-3 font-medium text-text-primary">{deal.name}</td>
                    <td className="py-3 text-text-primary font-semibold">{deal.value}</td>
                    <td className="py-3 text-text-secondary">{deal.date}</td>
                    <td className="py-3 text-text-secondary">{deal.stage}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        deal.status === 'Won' ? 'bg-success/10 text-success' :
                        deal.status === 'At Risk' ? 'bg-danger/10 text-danger' :
                        'bg-brand/10 text-brand'
                      }`}>
                        {deal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
});
