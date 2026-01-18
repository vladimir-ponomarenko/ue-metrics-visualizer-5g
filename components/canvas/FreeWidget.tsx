import React, { memo } from 'react';
import { Rnd } from 'react-rnd';
import { NeonCard } from '../ui/NeonCard';
import { useLayoutStore, WidgetLayout } from '../../store/useLayoutStore';

interface FreeWidgetProps {
  tabId: string;
  layout: WidgetLayout;
  children: React.ReactNode;
  title?: string;
  color?: 'primary' | 'secondary' | 'success' | 'accent' | 'warning';
  icon?: string;
  minWidth?: number;
  minHeight?: number;
}

export const FreeWidget: React.FC<FreeWidgetProps> = memo(({
  tabId,
  layout,
  children,
  title,
  color,
  icon,
  minWidth = 200,
  minHeight = 100
}) => {
  const { updateWidget, bringToFront } = useLayoutStore();

  const width = layout.w && layout.w > 0 ? layout.w : 300;
  const height = layout.h && layout.h > 0 ? layout.h : 200;
  const x = Number.isFinite(layout.x) ? layout.x : 50;
  const y = Number.isFinite(layout.y) ? layout.y : 50;

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      minWidth={minWidth}
      minHeight={minHeight}
      style={{ zIndex: layout.zIndex }}
      dragHandleClassName="drag-handle"
      
      onMouseDown={() => bringToFront(tabId, layout.id)}
      
      onDragStop={(e, d) => {
        updateWidget(tabId, layout.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateWidget(tabId, layout.id, {
          w: parseInt(ref.style.width),
          h: parseInt(ref.style.height),
          ...position,
        });
      }}
      
      resizeHandleClasses={{
        bottomRight: "z-50",
      }}
    >
      <div className="w-full h-full relative">
        <NeonCard
          color={color}
          title={title}
          icon={icon}
          className="w-full h-full select-none shadow-xl bg-surface-light dark:bg-surface-dark"
          dragHandleProps={{ className: "drag-handle cursor-move w-full h-full" }}
        >
          <div className="w-full h-full cursor-auto" onMouseDown={(e) => e.stopPropagation()}>
            {children}
          </div>
        </NeonCard>
      </div>
    </Rnd>
  );
});