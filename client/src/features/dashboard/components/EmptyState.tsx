import React from 'react';
import { Inbox, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No board items found',
  message = 'Monday.com deals and work orders boards appear to be empty. Please verify your board IDs and items.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-border border-dashed bg-surface rounded-md text-center max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-surface-hover text-text-secondary flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6" />
      </div>

      <h3 className="font-display font-semibold text-sm text-text-primary">
        {title}
      </h3>

      <p className="font-sans text-xs text-text-secondary mt-1.5 leading-relaxed max-w-xs">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-brand hover:text-brand-glow hover:underline transition-colors"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
