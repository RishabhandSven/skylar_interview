import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ExecutiveSummaryCardProps {
  summary: string;
  onExploreAction?: () => void;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  summary,
  onExploreAction,
}) => {
  return (
    <div className="p-6 border border-border bg-surface rounded-md shadow-sm relative overflow-hidden flex flex-col justify-between h-auto min-h-0 w-full">
      {/* Decorative Brand Top Banner */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand via-success to-brand" />

      <div>
        <div className="flex items-center gap-2 text-brand mb-4">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <h4 className="font-display font-semibold text-sm tracking-wide uppercase">
            AI Executive Overview
          </h4>
        </div>
        <p className="font-sans text-sm text-text-primary leading-relaxed whitespace-pre-wrap break-words">
          {summary}
        </p>
      </div>

      {onExploreAction && (
        <div className="flex justify-end mt-6">
          <button
            onClick={onExploreAction}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-glow hover:underline transition-colors"
          >
            Explore deep-dive metrics
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
