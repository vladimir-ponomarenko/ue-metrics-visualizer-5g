// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

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
  dragHandleProps?: { className?: string; [key: string]: any };
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
  const { className: dragHandleClass, ...restDragProps } = dragHandleProps || {};

  return (
    <div
      className={twMerge(
        "relative bg-surface-light dark:bg-surface-dark border group transition-colors duration-200 shadow-retro box-border overflow-hidden",
        colorMap[color],
        isDragging && "z-50 opacity-90 shadow-2xl",
        className
      )}
      style={{ containerType: 'size' }}
    >
      {/* Corner Brackets */}
      <div className={clsx("absolute w-2 h-2 border-t-2 border-l-2 border-gray-400 dark:border-[#333] top-0 left-0 z-40 transition-all duration-300 pointer-events-none", bracketColorMap[color])} />
      <div className={clsx("absolute w-2 h-2 border-t-2 border-r-2 border-gray-400 dark:border-[#333] top-0 right-0 z-40 transition-all duration-300 pointer-events-none", bracketColorMap[color])} />
      <div className={clsx("absolute w-2 h-2 border-b-2 border-l-2 border-gray-400 dark:border-[#333] bottom-0 left-0 z-40 transition-all duration-300 pointer-events-none", bracketColorMap[color])} />
      <div className={clsx("absolute w-2 h-2 border-b-2 border-r-2 border-gray-400 dark:border-[#333] bottom-0 right-0 z-40 transition-all duration-300 pointer-events-none", bracketColorMap[color])} />

      {/* Header Area */}
      {(title || icon || dragHandleProps) && (
        <div
          className={twMerge(
            "absolute top-0 left-0 right-0 h-8 flex justify-between items-center px-2 border-b border-gray-200 dark:border-[#222] select-none z-30 bg-inherit",
            dragHandleProps ? "cursor-grab active:cursor-grabbing" : "",
            dragHandleClass
          )}
          {...restDragProps}
        >
          <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
            {dragHandleProps && (
              <GripVertical className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
            )}

            {title && (
              <h3 className={clsx(
                "text-sm font-mono uppercase tracking-[0.1em] font-bold transition-colors truncate",
                textMap[color]
              )}>
                {title}
              </h3>
            )}
          </div>

          {icon && (
            <span className={clsx(
                "material-icons text-base transition-colors pointer-events-none ml-2",
                textMap[color]
            )}>
                {icon}
            </span>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="absolute inset-0 pt-8 pb-1 px-2 flex flex-col min-w-0 min-h-0 z-10 pointer-events-auto">
        <div className="flex-1 relative w-full h-full min-w-0 min-h-0 overflow-hidden" onMouseDown={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
};