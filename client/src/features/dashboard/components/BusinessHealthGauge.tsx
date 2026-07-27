import React from 'react';
import { motion } from 'framer-motion';

interface BusinessHealthGaugeProps {
  percentage: number;
  label?: string;
}

export const BusinessHealthGauge: React.FC<BusinessHealthGaugeProps> = ({
  percentage,
  label = 'Operational Health',
}) => {
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="p-6 border border-border bg-surface rounded-md shadow-sm flex flex-col items-center w-full min-w-0">
      <h4 className="font-display font-semibold text-xs tracking-wide text-text-secondary uppercase mb-4 self-start">
        {label}
      </h4>

      <div className="relative w-[150px] h-[150px] flex items-center justify-center">
        {/* SVG Circle Gauge */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 150 150">
          {/* Background Track */}
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          {/* Active Radial Progress */}
          <motion.circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="var(--brand)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-display font-bold text-3xl text-text-primary leading-none"
          >
            {percentage}%
          </motion.span>
          <span className="text-[10px] text-text-secondary uppercase font-semibold tracking-wider mt-1.5">
            Completion
          </span>
        </div>
      </div>

      <p className="text-xs text-text-secondary mt-4 text-center leading-normal">
        Based on work orders status and deal closure velocity.
      </p>
    </div>
  );
};
