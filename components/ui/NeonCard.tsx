import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GripVertical } from 'lucide-react'; 

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'accent' | 'warning';
  title?: string;
  icon?: string;
  
  dragHandleProps?: any; 
  isDragging?: boolean;
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
  icon,
  dragHandleProps,
  isDragging
}) => {
  return (
    <div className={twMerge(
      "relative bg-surface-light dark:bg-surface-dark border p-5 group transition-all duration-200 shadow-retro flex flex-col",
      
      colorMap[color],
      
      isDragging && "z-50 scale-105 opacity-90 shadow-2xl ring-2 ring-white/20 rotate-1",
      className
    )}>
      {/* Corner Brackets (декорация) */}
      <div className={clsx("absolute w-2 h-2 border-t-2 border-l-2 border-gray-400 dark:border-[#333] -top-[1px] -left-[1px] transition-all duration-300", bracketColorMap[color])} />
      <div className={clsx("absolute w-2 h-2 border-t-2 border-r-2 border-gray-400 dark:border-[#333] -top-[1px] -right-[1px] transition-all duration-300", bracketColorMap[color])} />
      <div className={clsx("absolute w-2 h-2 border-b-2 border-l-2 border-gray-400 dark:border-[#333] -bottom-[1px] -left-[1px] transition-all duration-300", bracketColorMap[color])} />
      <div className={clsx("absolute w-2 h-2 border-b-2 border-r-2 border-gray-400 dark:border-[#333] -bottom-[1px] -right-[1px] transition-all duration-300", bracketColorMap[color])} />

      {/* Header Area */}
      {(title || icon || dragHandleProps) && (
        <div 
          className={clsx(
            "flex justify-between items-start mb-4 border-b border-gray-200 dark:border-[#222] pb-2 select-none",
            dragHandleProps ? "cursor-grab active:cursor-grabbing" : ""
          )}
          {...dragHandleProps} 
        >
          <div className="flex items-center gap-2">
            {/* Иконка перетаскивания */}
            {dragHandleProps && (
              <GripVertical className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-50 group-hover:opacity-100 transition-opacity" />
            )}
            
            {title && (
              <h3 className={clsx(
                "text-sm font-mono uppercase tracking-[0.15em] transition-colors pointer-events-none",
                textMap[color]
              )}>
                {title}
              </h3>
            )}
          </div>
          
          {icon && (
            <span className={clsx(
                "material-icons text-xl transition-colors pointer-events-none",
                textMap[color]
            )}>
                {icon}
            </span>
          )}
        </div>
      )}

      {/* Content area grows to fill space */}
      <div className="flex-1 min-h-0 relative">
        {children}
      </div>
    </div>
  );
};