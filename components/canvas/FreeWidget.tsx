import React, { memo, useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { NeonCard } from '../ui/NeonCard';
import { useLayoutStore, WidgetLayout } from '../../store/useLayoutStore';
import clsx from 'clsx';

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

const WidgetContent = memo(({ children }: { children: React.ReactNode }) => (
  <>{children}</>
));

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
  const { updateWidget, bringToFront, canvasStates } = useLayoutStore();
  const currentScale = canvasStates[tabId]?.scale || 1;
  const [isInteracting, setIsInteracting] = useState(false);

  const defaultPosition = {
    x: Number.isFinite(layout.x) ? layout.x : 0,
    y: Number.isFinite(layout.y) ? layout.y : 0,
    width: layout.w && layout.w > 0 ? layout.w : 300,
    height: layout.h && layout.h > 0 ? layout.h : 200,
  };

  const handleDragStart = useCallback(() => {
    setIsInteracting(true);
    bringToFront(tabId, layout.id);
  }, [bringToFront, tabId, layout.id]);

  const handleDragStop = useCallback((e: any, d: any) => {
    setIsInteracting(false);
    updateWidget(tabId, layout.id, { x: d.x, y: d.y });
  }, [updateWidget, tabId, layout.id]);

  const handleResizeStart = useCallback(() => {
    setIsInteracting(true);
    bringToFront(tabId, layout.id);
  }, [bringToFront, tabId, layout.id]);

  const handleResizeStop = useCallback((e: any, dir: any, ref: HTMLElement, delta: any, position: any) => {
    setIsInteracting(false);
    updateWidget(tabId, layout.id, {
      w: parseInt(ref.style.width),
      h: parseInt(ref.style.height),
      ...position,
    });
  }, [updateWidget, tabId, layout.id]);

  return (
    <Rnd
      default={defaultPosition}
      minWidth={minWidth}
      minHeight={minHeight}
      scale={currentScale}
      style={{
        zIndex: layout.zIndex,
      }}
      className="widget-interactive-area pointer-events-auto"
      dragHandleClassName="drag-handle"
      enableUserSelectHack={false}

      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}

      resizeHandleClasses={{
        bottomRight: "z-50",
      }}
    >
      <div className="w-full h-full">
        <NeonCard
          color={color}
          title={title}
          icon={icon}
          isDragging={isInteracting}
          className="w-full h-full shadow-xl bg-surface-light dark:bg-surface-dark"
          dragHandleProps={{
            className: "drag-handle"
          }}
        >
          <div className={clsx("w-full h-full transition-opacity duration-150", isInteracting && "opacity-50 pointer-events-none")}>
             <WidgetContent>{children}</WidgetContent>
          </div>
        </NeonCard>
      </div>
    </Rnd>
  );
});