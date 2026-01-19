// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

import React, { memo, useState, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
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
  const { updateWidget, bringToFront, restoreWidgetToDrawer, canvasStates } = useLayoutStore();
  const currentScale = canvasStates[tabId]?.scale || 1;
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const rndRef = useRef<Rnd>(null);

  const defaultPosition = {
    x: Number.isFinite(layout.x) ? layout.x : 0,
    y: Number.isFinite(layout.y) ? layout.y : 0,
    width: layout.w && layout.w > 0 ? layout.w : 300,
    height: layout.h && layout.h > 0 ? layout.h : 200,
  };

  /* --- Drag Handlers --- */
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    bringToFront(tabId, layout.id);

    if (rndRef.current) {
        const el = rndRef.current.getSelfElement();
        if (el) {
            const rect = el.getBoundingClientRect();
            setDragPos({ x: rect.left, y: rect.top, w: rect.width, h: rect.height });
        }
    }
  }, [bringToFront, tabId, layout.id]);

  const handleDrag = useCallback((e: any) => {
    if (rndRef.current) {
        const el = rndRef.current.getSelfElement();
        if (el) {
            const rect = el.getBoundingClientRect();
            setDragPos({ x: rect.left, y: rect.top, w: rect.width, h: rect.height });
        }
    }

    const windowHeight = window.innerHeight;
    if (e.clientY > windowHeight - 200) {
        setIsHoveringDelete(true);
    } else {
        setIsHoveringDelete(false);
    }
  }, []);

  const handleDragStop = useCallback((e: any, d: any) => {
    setIsDragging(false);
    const windowHeight = window.innerHeight;
    if (e.clientY > windowHeight - 200) {
        let targetIndex = 0;
        const drawerContainer = document.getElementById('metrics-drawer-container');
        if (drawerContainer) {
            const rect = drawerContainer.getBoundingClientRect();
            const scrollLeft = drawerContainer.scrollLeft;
            const mouseXInContainer = e.clientX - rect.left + scrollLeft;
            const startOffset = 32;
            const itemSlotWidth = 192 + 24;
            const rawIndex = Math.floor((mouseXInContainer - startOffset) / itemSlotWidth);
            targetIndex = Math.max(0, rawIndex);
        }
        restoreWidgetToDrawer(tabId, layout.id, targetIndex);
    } else {
        setIsHoveringDelete(false);
        updateWidget(tabId, layout.id, { x: d.x, y: d.y });
    }
  }, [updateWidget, restoreWidgetToDrawer, tabId, layout.id]);

  /* --- Resize Handlers (In-Place, No Portal) --- */
  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
    bringToFront(tabId, layout.id);
  }, [bringToFront, tabId, layout.id]);

  const handleResizeStop = useCallback((e: any, dir: any, ref: HTMLElement, delta: any, position: any) => {
    setIsResizing(false);
    updateWidget(tabId, layout.id, {
      w: parseInt(ref.style.width),
      h: parseInt(ref.style.height),
      ...position,
    });
  }, [updateWidget, tabId, layout.id]);

  return (
    <>
      <Rnd
        ref={rndRef}
        default={defaultPosition}
        minWidth={minWidth}
        minHeight={minHeight}
        scale={currentScale}
        style={{
          zIndex: layout.zIndex,
          opacity: isDragging ? 0 : 1
        }}
        className="widget-interactive-area pointer-events-auto"
        dragHandleClassName="drag-handle"
        enableUserSelectHack={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        resizeHandleClasses={{ bottomRight: "z-50" }}
      >
        <div className="w-full h-full">
          <NeonCard
            color={color}
            title={title}
            icon={icon}
            className={clsx(
                "w-full h-full shadow-xl bg-surface-light dark:bg-surface-dark",
                (isDragging || isResizing) && "pointer-events-none"
            )}
            dragHandleProps={{ className: "drag-handle" }}
          >
            <WidgetContent>{children}</WidgetContent>
          </NeonCard>
        </div>
      </Rnd>

      {/* PORTAL for Dragging */}
      {isDragging && ReactDOM.createPortal(
        <div
            style={{
                position: 'fixed',
                left: dragPos.x,
                top: dragPos.y,
                width: dragPos.w,
                height: dragPos.h,
                zIndex: 9999,
                pointerEvents: 'none'
            }}
            className={clsx(
                "transition-transform duration-75 origin-center",
                isHoveringDelete ? "scale-90 opacity-70 grayscale" : "scale-[1.02]"
            )}
        >
             <NeonCard
                color={color}
                title={title}
                icon={icon}
                isDragging={true}
                className="w-full h-full shadow-2xl bg-surface-light dark:bg-surface-dark border-2 border-primary/50"
            >
                <div className="w-full h-full opacity-90">
                    <WidgetContent>{children}</WidgetContent>
                </div>
            </NeonCard>

            {isHoveringDelete && (
                <div className="absolute inset-0 z-50 flex items-center justify-center">
                    <div className="bg-red-600 text-white font-bold font-mono px-4 py-2 rounded shadow-lg border border-white">
                        DOCK HERE
                    </div>
                </div>
            )}
        </div>,
        document.body
      )}
    </>
  );
});