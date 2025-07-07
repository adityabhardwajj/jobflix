import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

const Progress: React.FC<ProgressBarProps> = ({ value, className }) => {
  return (
    <div className={`w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className || ''}`}>
      <div
        className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
};

export { Progress }; 