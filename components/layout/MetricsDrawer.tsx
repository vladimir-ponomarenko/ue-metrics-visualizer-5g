// SPDX-License-Identifier: MIT
// Copyright (c) 2026 vladimir-ponomarenko

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronUp, ChevronDown, LayoutGrid } from 'lucide-react';
import clsx from 'clsx';

import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  MeasuringStrategy,
} from '@dnd-kit/core';

import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import { NeonCard } from '../ui/NeonCard';
import { OVERVIEW_WIDGETS } from '../../config/overviewWidgets';
import { useLayoutStore } from '../../store/useLayoutStore';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { AppTab } from '../../types';

/* ===================== Sortable Widget ===================== */

const SortableWidget = ({ widget }: { widget: any }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-48 h-32 shrink-0"
    >
      <NeonCard
        title={widget.title}
        color={widget.color}
        className="h-full bg-surface-light dark:bg-[#111]"
        dragHandleProps={{
          ...attributes,
          ...listeners,
          className:
            'cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-[#222]',
        }}
      >
        {widget.renderPreview()}
      </NeonCard>
    </div>
  );
};

/* ===================== MetricsDrawer ===================== */

export const MetricsDrawer: React.FC = () => {
  const {
    widgets,
    drawerSortOrder,
    setDrawerOrder,
    isDrawerOpen,
    setDrawerOpen,
    addWidget,
    canvasStates,
  } = useLayoutStore();

  const { isSidebarCollapsed } = useTelemetryStore();
  const currentWidgets = widgets[AppTab.OVERVIEW] || {};
  const canvasState = canvasStates[AppTab.OVERVIEW] ?? {
    scale: 1,
    positionX: 0,
    positionY: 0,
  };

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const availableWidgets = OVERVIEW_WIDGETS;
  const availableIds = Object.keys(availableWidgets).filter(
    (id) => !currentWidgets[id]
  );

  const sortedIds = drawerSortOrder.filter((id) =>
    availableIds.includes(id)
  );

  availableIds.forEach((id) => {
    if (!sortedIds.includes(id)) {
      sortedIds.push(id);
    }
  });

  /* ===================== DnD Handlers ===================== */

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const widget = availableWidgets[active.id as string];
    let addedToCanvas = false;
    const rect = active.rect.current.translated;

    if (rect) {
      const { top, left } = rect;
      const windowHeight = window.innerHeight;
      if (top < windowHeight - 220) {
        const sidebarOffset = isSidebarCollapsed ? 48 : 288;
        const x =
          (left - sidebarOffset - canvasState.positionX) /
          canvasState.scale;
        const y =
          (top - canvasState.positionY) /
          canvasState.scale;

        addWidget(AppTab.OVERVIEW, {
          id: widget.id,
          x,
          y,
          w: widget.defaultW,
          h: widget.defaultH,
          zIndex: 100,
        });

        setDrawerOrder(
          sortedIds.filter((id) => id !== active.id)
        );

        addedToCanvas = true;
      }
    }

    if (!addedToCanvas && over && active.id !== over.id) {
      const oldIndex = sortedIds.indexOf(active.id as string);
      const newIndex = sortedIds.indexOf(over.id as string);
      setDrawerOrder(arrayMove(sortedIds, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  const activeWidget = activeId
    ? availableWidgets[activeId]
    : null;

  /* ===================== Render ===================== */

  return (
    <div
      className={clsx(
        'fixed bottom-0 right-0 z-[60] flex flex-col items-center transition-all duration-300',
        isSidebarCollapsed ? 'left-12' : 'left-72',
        isDrawerOpen
          ? 'translate-y-0'
          : 'translate-y-[calc(100%-2rem)]'
      )}
    >
      {/* ---------- Toggle Button ---------- */}

      <button
        onClick={() => setDrawerOpen(!isDrawerOpen)}
        className="h-8 px-8 bg-surface-light dark:bg-[#0A0A0A]
                   border-t border-x border-gray-300 dark:border-[#333]
                   rounded-t-lg flex items-center gap-2 text-xs
                   font-mono text-gray-500 hover:text-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10"
      >
        <LayoutGrid size={14} />
        <span className="tracking-widest font-bold">
          METRICS DOCK
        </span>
        {isDrawerOpen ? (
          <ChevronDown size={14} />
        ) : (
          <ChevronUp size={14} />
        )}
      </button>

      {/* ---------- Drawer Body ---------- */}

      <div className="w-full h-48 bg-surface-light/95 dark:bg-[#050505]/95 backdrop-blur-md border-t border-gray-300 dark:border-[#333] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] overflow-hidden">
        <div id="metrics-drawer-container" className="h-full overflow-x-auto scrollbar-thin">
          <div className="h-full flex items-center px-8 gap-6 min-w-max">
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              measuring={{
                droppable: {
                  strategy: MeasuringStrategy.Always,
                },
              }}
            >
              <SortableContext
                items={sortedIds}
                strategy={horizontalListSortingStrategy}
              >
                {sortedIds.length === 0 ? (
                  <div className="text-gray-400 font-mono italic">
                    // ALL METRICS ACTIVE //
                  </div>
                ) : (
                  sortedIds.map((id) => (
                    <SortableWidget
                      key={id}
                      widget={availableWidgets[id]}
                    />
                  ))
                )}
              </SortableContext>

              {/* ---------- DragOverlay PORTAL ---------- */}

              {createPortal(
                <DragOverlay dropAnimation={null}>
                  {activeWidget ? (
                    <div className="w-48 h-32 pointer-events-none">
                      <NeonCard
                        title={activeWidget.title}
                        color={activeWidget.color}
                        className="h-full bg-surface-light dark:bg-[#111]
                                   border-primary shadow-[0_10px_30px_rgba(0,240,255,0.35)]"
                      >
                        {activeWidget.renderPreview()}
                      </NeonCard>
                    </div>
                  ) : null}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
};