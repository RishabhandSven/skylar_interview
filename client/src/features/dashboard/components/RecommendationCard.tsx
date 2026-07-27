import React from 'react';
import { Lightbulb, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  actionUrl?: string;
}

interface RecommendationCardProps {
  items: RecommendationItem[];
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ items }) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand/15 text-brand uppercase tracking-wider">High Impact</span>;
      case 'medium':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success uppercase tracking-wider">Medium Impact</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-border text-text-secondary uppercase tracking-wider">Low Impact</span>;
    }
  };

  return (
    <div className="p-6 border border-border bg-surface rounded-md shadow-sm h-auto min-h-0 w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
        <Lightbulb className="w-5 h-5 text-warning" />
        <h4 className="font-display font-semibold text-sm tracking-wide text-text-primary uppercase">
          AI Action Recommendations
        </h4>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-text-secondary">
          <p className="text-sm">No action recommendations available</p>
        </div>
      ) : (
        <div className="space-y-4 flex-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-border bg-background rounded-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-h-0"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h5 className="font-sans font-semibold text-sm text-text-primary break-words">
                    {item.title}
                  </h5>
                  {getPriorityBadge(item.priority)}
                </div>
                <p className="font-sans text-xs text-text-secondary mt-1 leading-relaxed break-words whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              {item.actionLabel && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-brand text-white font-medium text-xs shadow-sm hover:shadow-brand-glow transition-all self-start md:self-auto"
                >
                  <span>{item.actionLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
