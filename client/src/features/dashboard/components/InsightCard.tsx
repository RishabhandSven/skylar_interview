import { AlertTriangle, TrendingUp } from 'lucide-react';

export interface InsightItem {
  id: string;
  title: string;
  description: string;
  level?: 'critical' | 'moderate' | 'low';
}

interface InsightCardProps {
  type: 'risk' | 'opportunity';
  items: InsightItem[];
}

export const InsightCard: React.FC<InsightCardProps> = ({ type, items }) => {
  const isRisk = type === 'risk';

  const getHeaderIcon = () => {
    return isRisk ? (
      <AlertTriangle className="w-5 h-5 text-danger" />
    ) : (
      <TrendingUp className="w-5 h-5 text-success" />
    );
  };

  const getHeaderTitle = () => {
    return isRisk ? 'Identified Risks & Slippages' : 'Growth & Optimizations';
  };

  const getLevelBadge = (level?: string) => {
    if (!level) return null;
    switch (level) {
      case 'critical':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger/15 text-danger uppercase tracking-wider">Critical</span>;
      case 'moderate':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/15 text-warning uppercase tracking-wider">Moderate</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand/15 text-brand uppercase tracking-wider">Minor</span>;
    }
  };

  return (
    <div className="p-6 border border-border bg-surface rounded-md shadow-sm h-auto min-h-0 w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
        {getHeaderIcon()}
        <h4 className="font-display font-semibold text-sm tracking-wide text-text-primary uppercase">
          {getHeaderTitle()}
        </h4>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-text-secondary">
          <p className="text-sm">No items identified by AI</p>
        </div>
      ) : (
        <ul className="space-y-4 flex-1">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3 min-h-0">
              <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isRisk ? 'bg-danger' : 'bg-success'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h5 className="font-sans font-semibold text-sm text-text-primary break-words">
                    {item.title}
                  </h5>
                  {isRisk && getLevelBadge(item.level)}
                </div>
                <p className="font-sans text-xs text-text-secondary mt-1 leading-relaxed break-words whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
