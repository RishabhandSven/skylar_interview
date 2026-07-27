import React from 'react';

interface LoadingSkeletonProps {
  variant: 'metric' | 'summary' | 'chart' | 'list';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant, count = 1 }) => {
  const shimmerClass = "animate-pulse bg-border/60 dark:bg-border/30 rounded-md";

  const renderMetric = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-5 border border-border bg-surface rounded-md h-[120px] flex flex-col justify-between">
          <div className="space-y-2">
            <div className={`h-3 w-1/3 ${shimmerClass}`} />
            <div className={`h-7 w-2/3 ${shimmerClass}`} />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className={`h-4 w-1/4 ${shimmerClass}`} />
            <div className={`h-6 w-1/3 ${shimmerClass}`} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSummary = () => (
    <div className="p-6 border border-border bg-surface rounded-md h-full space-y-4">
      <div className="flex items-center gap-2">
        <div className={`h-5 w-5 rounded-full ${shimmerClass}`} />
        <div className={`h-4 w-1/4 ${shimmerClass}`} />
      </div>
      <div className="space-y-2">
        <div className={`h-3 w-full ${shimmerClass}`} />
        <div className={`h-3 w-full ${shimmerClass}`} />
        <div className={`h-3 w-[90%] ${shimmerClass}`} />
        <div className={`h-3 w-[95%] ${shimmerClass}`} />
        <div className={`h-3 w-[80%] ${shimmerClass}`} />
      </div>
    </div>
  );

  const renderChart = () => (
    <div className="p-6 border border-border bg-surface rounded-md h-[300px] flex flex-col justify-between">
      <div className={`h-4 w-1/4 ${shimmerClass}`} />
      <div className="flex items-end justify-between h-[200px] px-4">
        <div className={`h-[40%] w-[10%] ${shimmerClass}`} />
        <div className={`h-[75%] w-[10%] ${shimmerClass}`} />
        <div className={`h-[60%] w-[10%] ${shimmerClass}`} />
        <div className={`h-[90%] w-[10%] ${shimmerClass}`} />
        <div className={`h-[50%] w-[10%] ${shimmerClass}`} />
        <div className={`h-[80%] w-[10%] ${shimmerClass}`} />
      </div>
    </div>
  );

  const renderList = () => (
    <div className="p-6 border border-border bg-surface rounded-md h-full space-y-4">
      <div className={`h-4 w-1/3 ${shimmerClass}`} />
      <div className="space-y-3 mt-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex gap-3 items-center">
            <div className={`w-2 h-2 rounded-full ${shimmerClass}`} />
            <div className="flex-1 space-y-1.5">
              <div className={`h-3.5 w-1/3 ${shimmerClass}`} />
              <div className={`h-2.5 w-2/3 ${shimmerClass}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  switch (variant) {
    case 'metric':
      return renderMetric();
    case 'summary':
      return renderSummary();
    case 'chart':
      return renderChart();
    default:
      return renderList();
  }
};
