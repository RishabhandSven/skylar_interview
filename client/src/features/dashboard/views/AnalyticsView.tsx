import { ChartCard } from '../components/ChartCard';
import { motion } from 'framer-motion';

const mockDeals = [
  { id: 'd1', name: 'TechCorp Enterprise License', value: '$850,000', stage: 'Negotiation', date: '2026-08-15', status: 'Open' },
  { id: 'd2', name: 'Hub Ltd Integration Contract', value: '$450,000', stage: 'Proposal Sent', date: '2026-09-01', status: 'At Risk' },
  { id: 'd3', name: 'Acme Corp SLA Expansion', value: '$120,000', stage: 'Contract Signed', date: '2026-07-20', status: 'Won' },
  { id: 'd4', name: 'Globex Cloud Migration', value: '$1,200,000', stage: 'Discovery', date: '2026-11-30', status: 'Open' },
];

export const AnalyticsView: React.FC = () => {
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
      </div>

      {/* Chart Panel */}
      <ChartCard />

      {/* Deals Table Card */}
      <div className="p-4 sm:p-6 border border-border bg-surface rounded-md shadow-sm w-full min-w-0">
        <h4 className="font-display font-semibold text-xs tracking-wide text-text-secondary uppercase mb-4">
          Pipeline Deals Catalog
        </h4>
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
              {mockDeals.map((deal) => (
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
      </div>
    </motion.div>
  );
};
