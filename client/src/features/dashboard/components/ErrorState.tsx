import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load business intelligence data',
  message = 'A downstream service connection error occurred. Please verify your Monday.com and Gemini credentials and try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-danger/20 bg-danger/5 rounded-md text-center max-w-xl mx-auto my-12">
      <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      
      <h3 className="font-display font-bold text-lg text-text-primary">
        {title}
      </h3>
      
      <p className="font-sans text-xs text-text-secondary mt-2 leading-relaxed max-w-sm">
        {message}
      </p>

      {onRetry && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 mt-6 rounded-md bg-danger text-white font-medium text-xs shadow-sm hover:bg-danger/90 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </motion.button>
      )}
    </div>
  );
};
