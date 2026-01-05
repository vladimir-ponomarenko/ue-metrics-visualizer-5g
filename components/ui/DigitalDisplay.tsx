import React from 'react';
import clsx from 'clsx';

interface DigitalDisplayProps {
  value: number | string;
  label?: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string; // Text color class
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({
  value,
  label,
  unit,
  size = 'lg',
  color = 'text-white'
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className="flex flex-col">
      {label && <span className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">{label}</span>}
      <div className="flex items-baseline gap-2">
        <span className={clsx(
          "font-mono font-bold tracking-tighter drop-shadow-md",
          sizeClasses[size],
          color
        )}>
          {value}
        </span>
        {unit && (
          <span className={clsx(
            "text-xs font-mono font-bold border border-white/20 px-1 rounded-sm",
            color.replace('text-', 'text-opacity-70 text-')
          )}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};