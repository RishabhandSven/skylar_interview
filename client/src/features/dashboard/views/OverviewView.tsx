import { memo } from 'react';
import { MetricCard } from '../components/MetricCard';
import { ExecutiveSummaryCard } from '../components/ExecutiveSummaryCard';
import { InsightCard } from '../components/InsightCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { BusinessHealthGauge } from '../components/BusinessHealthGauge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { Sparkles, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInsights } from '../../../hooks/useInsights';
import { getErrorMessage, getErrorTitle } from '../../../services/api';

export const OverviewView = memo(function OverviewView() {
  const { parsed, isLoading, isError, error, refetch, isFetching } = useInsights();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4 sm:space-y-6 min-w-0"
      >
        <LoadingSkeleton variant="metric" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <LoadingSkeleton variant="summary" />
            <LoadingSkeleton variant="list" />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <LoadingSkeleton variant="summary" />
            <LoadingSkeleton variant="list" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <LoadingSkeleton variant="list" />
          <LoadingSkeleton variant="list" />
        </div>
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
        title="No insights available"
        message="The backend returned an empty insight response. Verify Monday.com board data and Gemini configuration."
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
      {/* Greetings Header & AI banner */}
      <div className="p-4 sm:p-5 border border-border bg-gradient-to-r from-surface to-surface-hover rounded-md shadow-sm relative overflow-hidden flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-display font-bold text-lg sm:text-xl text-text-primary">
            Executive Control Panel
          </h2>
          <p className="font-sans text-xs text-text-secondary mt-1 leading-relaxed">
            Real-time synthesis of Monday.com operations and Sales telemetry.
          </p>
        </div>
        <div className="flex items-start gap-2 px-3 py-2 rounded-md border border-brand/20 bg-brand/5 text-xs text-brand font-medium w-full lg:w-auto lg:max-w-md xl:max-w-lg shrink-0">
          <Sparkles className="w-4 h-4 text-brand animate-pulse shrink-0 mt-0.5" />
          <span className="break-words leading-relaxed">
            AI Insight: {parsed.aiBannerSnippet}
          </span>
        </div>
      </div>

      {isFetching && (
        <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
          Refreshing insights...
        </p>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch">
        {parsed.metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            trendValue={metric.trendValue}
            changeText={metric.changeText}
            sparklineData={metric.sparklineData}
          />
        ))}
      </div>

      {/* Main Grid: AI Analytics & Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start auto-rows-auto">
        {/* Left Column: AI Executive Overview & Action recommendations (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6 w-full min-w-0">
          <ExecutiveSummaryCard summary={parsed.executiveSummary} />
          <RecommendationCard items={parsed.recommendations} />
        </div>

        {/* Right Column: Health Gauge & Recent Board Operations */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full min-w-0">
          <BusinessHealthGauge percentage={parsed.healthPercentage} />

          {/* Recent Alerts Feed */}
          <div className="p-4 sm:p-5 border border-border bg-surface rounded-md shadow-sm w-full min-w-0">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border">
              <Bell className="w-4 h-4 text-brand shrink-0" />
              <h4 className="font-display font-semibold text-xs tracking-wide text-text-secondary uppercase">
                Recent Board Operations
              </h4>
            </div>
            {parsed.alerts.length === 0 ? (
              <p className="text-xs text-text-secondary">No recent alerts identified by AI.</p>
            ) : (
              <ul className="space-y-3">
                {parsed.alerts.map((alert) => (
                  <li key={alert.id} className="flex items-start justify-between gap-3 text-xs min-w-0">
                    <span className="text-text-primary font-medium break-words leading-relaxed min-w-0">
                      {alert.label}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0 whitespace-nowrap ${
                        alert.type === 'Alert'
                          ? 'text-danger bg-danger/10'
                          : alert.type === 'Update'
                            ? 'text-success bg-success/10'
                            : 'text-text-secondary bg-border'
                      }`}
                    >
                      {alert.type}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Risks & Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
        <InsightCard type="risk" items={parsed.risks} />
        <InsightCard type="opportunity" items={parsed.opportunities} />
      </div>
    </motion.div>
  );
});
