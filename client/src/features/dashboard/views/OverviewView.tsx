import { MetricCard } from '../components/MetricCard';
import { ExecutiveSummaryCard } from '../components/ExecutiveSummaryCard';
import { InsightCard } from '../components/InsightCard';
import type { InsightItem } from '../components/InsightCard';
import { RecommendationCard } from '../components/RecommendationCard';
import type { RecommendationItem } from '../components/RecommendationCard';
import { BusinessHealthGauge } from '../components/BusinessHealthGauge';
import { Sparkles, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const mockRisks: InsightItem[] = [
  { id: 'r1', title: 'Work Order slippage on integration tests', description: 'Priority A tasks on Monday.com board have slipped deadline by 4 days due to resource constraints.', level: 'critical' },
  { id: 'r2', title: 'At-risk pipeline deal with Hub Ltd', description: 'Expected close date shifted twice. Value is $450k; current status is stagnant at negotiation.', level: 'moderate' },
];

const mockOpportunities: InsightItem[] = [
  { id: 'o1', title: 'Upsell opportunity with TechCorp', description: 'High completion rate on current work orders makes this account highly receptive to new service contracts.' },
  { id: 'o2', title: 'Contract closure velocity increase', description: 'Streamlined approval flow on Monday.com deals has accelerated closing velocity by 18%.' },
];

const mockRecommendations: RecommendationItem[] = [
  { id: 'rec1', title: 'Reallocate 2 engineers to testing phase', description: 'Bypasses the backlog on the Work Orders board and resolves the critical slippage.', priority: 'high', actionLabel: 'Manage Board' },
  { id: 'rec2', title: 'Trigger automated follow-up for Hub Ltd deal', description: 'Sends client alert through Monday.com triggers to accelerate negotiation.', priority: 'medium', actionLabel: 'Open Deal' },
];

export const OverviewView: React.FC = () => {
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
            AI Insight: Pipeline is strong, watch integration testing bottlenecks.
          </span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch">
        <MetricCard
          title="Total Deals Value"
          value="$12,450,000"
          trend="up"
          trendValue="14.2%"
          changeText="vs last month"
          sparklineData={[40, 48, 45, 52, 60, 58, 65]}
        />
        <MetricCard
          title="Deals Won Ratio"
          value="68.4%"
          trend="up"
          trendValue="3.1%"
          changeText="vs target"
          sparklineData={[60, 62, 65, 63, 67, 66, 68.4]}
        />
        <MetricCard
          title="Work Order Completion"
          value="82.1%"
          trend="neutral"
          trendValue="0.0%"
          changeText="stable"
          sparklineData={[80, 81, 82, 80, 81, 82, 82.1]}
        />
        <MetricCard
          title="Overdue Tasks"
          value="3 Tasks"
          trend="down"
          trendValue="50%"
          changeText="improved"
          sparklineData={[6, 5, 4, 5, 3, 4, 3]}
        />
      </div>

      {/* Main Grid: AI Analytics & Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start auto-rows-auto">
        {/* Left Column: AI Executive Overview & Action recommendations (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6 w-full min-w-0">
          <ExecutiveSummaryCard
            summary="Business health is overall robust with total sales pipeline at $12.4M and a strong deals won ratio of 68.4%. However, operational friction is building within integration review workflows, where 3 critical high-priority work orders are currently overdue. This backlog threatens the expected close date of several upcoming key deals, most notably the $450k contract with Hub Ltd."
          />
          <RecommendationCard items={mockRecommendations} />
        </div>

        {/* Right Column: Health Gauge & Recent Board Operations */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full min-w-0">
          <BusinessHealthGauge percentage={85} />
          
          {/* Recent Alerts Feed */}
          <div className="p-4 sm:p-5 border border-border bg-surface rounded-md shadow-sm w-full min-w-0">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-border">
              <Bell className="w-4 h-4 text-brand shrink-0" />
              <h4 className="font-display font-semibold text-xs tracking-wide text-text-secondary uppercase">
                Recent Board Operations
              </h4>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start justify-between gap-3 text-xs min-w-0">
                <span className="text-text-primary font-medium break-words leading-relaxed min-w-0">WorkOrder #302 overdue status</span>
                <span className="text-[10px] text-danger bg-danger/10 px-1.5 py-0.5 rounded font-semibold shrink-0 whitespace-nowrap">Alert</span>
              </li>
              <li className="flex items-start justify-between gap-3 text-xs min-w-0">
                <span className="text-text-primary font-medium break-words leading-relaxed min-w-0">Deal TechCorp changed to Won</span>
                <span className="text-[10px] text-success bg-success/10 px-1.5 py-0.5 rounded font-semibold shrink-0 whitespace-nowrap">Update</span>
              </li>
              <li className="flex items-start justify-between gap-3 text-xs min-w-0">
                <span className="text-text-primary font-medium break-words leading-relaxed min-w-0">Workspace sync initiated</span>
                <span className="text-[10px] text-text-secondary bg-border px-1.5 py-0.5 rounded font-semibold shrink-0 whitespace-nowrap">System</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Risks & Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
        <InsightCard type="risk" items={mockRisks} />
        <InsightCard type="opportunity" items={mockOpportunities} />
      </div>
    </motion.div>
  );
};
