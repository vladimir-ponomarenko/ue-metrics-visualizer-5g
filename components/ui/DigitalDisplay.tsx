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
  const sizeMap = {
    sm: '15cqh',
    md: '25cqh',
    lg: '35cqh',
    xl: '45cqh'
  };

  const fontSize = sizeMap[size] || '30cqh';

  return (
    <div className="flex flex-col justify-center h-full w-full">
      {label && (
        <span
          className="text-gray-500 font-mono uppercase tracking-wider mb-auto"
          style={{ fontSize: '10cqh', lineHeight: '1' }}
        >
          {label}
        </span>
      )}

      <div className="flex items-baseline gap-[1cqw]">
        <span
          className={clsx(
            "font-mono font-bold tracking-tighter drop-shadow-md leading-none",
            color
          )}
          style={{ fontSize: fontSize }}
        >
          {value}
        </span>

        {unit && (
          <span
            className={clsx(
              "font-mono font-bold border border-current px-[0.5cqw] rounded-sm opacity-70",
              color
            )}
            style={{ fontSize: '12cqh', lineHeight: '1.2' }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};