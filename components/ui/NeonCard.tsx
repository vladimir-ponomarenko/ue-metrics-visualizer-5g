import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'accent' | 'warning';
  title?: string;
  icon?: string;
}

const colorMap = {
  primary: 'hover:border-primary hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] dark:hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:text-primary border-gray-300 dark:border-border-dark',
  secondary: 'hover:border-secondary hover:shadow-[0_0_20px_rgba(153,0,255,0.5)] dark:hover:shadow-[0_0_20px_rgba(153,0,255,0.3)] group-hover:text-secondary border-gray-300 dark:border-border-dark',
  success: 'hover:border-success hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] dark:hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] group-hover:text-success border-gray-300 dark:border-border-dark',
  accent: 'hover:border-accent hover:shadow-[0_0_20px_rgba(255,0,68,0.5)] dark:hover:shadow-[0_0_20px_rgba(255,0,68,0.3)] group-hover:text-accent border-gray-300 dark:border-border-dark',
  warning: 'hover:border-warning hover:shadow-[0_0_20px_rgba(255,230,0,0.7)] dark:hover:shadow-[0_0_20px_rgba(255,230,0,0.3)] group-hover:text-warning border-gray-300 dark:border-border-dark',
};

const textMap = {
    primary: 'group-hover:text-primary text-gray-500 dark:text-gray-400',
    secondary: 'group-hover:text-secondary text-gray-500 dark:text-gray-400',
    success: 'group-hover:text-success text-gray-500 dark:text-gray-400',
    accent: 'group-hover:text-accent text-gray-500 dark:text-gray-400',
    warning: 'group-hover:text-warning text-gray-600 dark:text-gray-400',
};

const bracketColorMap = {
    primary: 'group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(0,240,255,0.8)] dark:group-hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]',
    secondary: 'group-hover:border-secondary group-hover:shadow-[0_0_15px_rgba(153,0,255,0.8)] dark:group-hover:shadow-[0_0_15px_rgba(153,0,255,0.5)]',
    success: 'group-hover:border-success group-hover:shadow-[0_0_15px_rgba(57,255,20,0.8)] dark:group-hover:shadow-[0_0_15px_rgba(57,255,20,0.5)]',
    accent: 'group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(255,0,68,0.8)] dark:group-hover:shadow-[0_0_15px_rgba(255,0,68,0.5)]',
    warning: 'group-hover:border-warning group-hover:shadow-[0_0_15px_rgba(255,230,0,0.9)] dark:group-hover:shadow-[0_0_15px_rgba(255,230,0,0.5)]',
};

export const NeonCard: React.FC<NeonCardProps> = ({
  children,
  className,
  color = 'primary',
  title,
  icon
}) => {
  return (
    <div className={twMerge(
      "relative bg-surface-light dark:bg-surface-dark border p-5 group transition-all duration-300 shadow-retro hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_30px_rgba(100,100,100,0.4)]",
      colorMap[color],
      className
    )}>
      {/* Corner Brackets */}
      <div className={clsx("absolute w-2 h-2 border-t-2 border-l-2 border-gray-400 dark:border-[#333] -top-[1px] -left-[1px] transition-all duration-300", bracketColorMap[color])} />
      <div className={clsx("absolute w-2 h-2 border-t-2 border-r-2 border-gray-400 dark:border-[#333] -top-[1px] -right-[1px] transition-all duration-300", bracketColorMap[color])} />
      <div className={clsx("absolute w-2 h-2 border-b-2 border-l-2 border-gray-400 dark:border-[#333] -bottom-[1px] -left-[1px] transition-all duration-300", bracketColorMap[color])} />
      <div className={clsx("absolute w-2 h-2 border-b-2 border-r-2 border-gray-400 dark:border-[#333] -bottom-[1px] -right-[1px] transition-all duration-300", bracketColorMap[color])} />

      {/* Header if Title exists */}
      {(title || icon) && (
        <div className="flex justify-between items-start mb-4 border-b border-gray-200 dark:border-[#222] pb-2">
          {title && (
            <h3 className={clsx(
              "text-sm font-mono uppercase tracking-[0.15em] transition-colors",
              textMap[color]
            )}>
              {title}
            </h3>
          )}
          {icon && (
            <span className={clsx(
                "material-icons text-xl transition-colors",
                textMap[color]
            )}>
                {icon}
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
};