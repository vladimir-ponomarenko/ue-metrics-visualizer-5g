import React, { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch';
import { useLayoutStore } from '../../store/useLayoutStore';
import { ZoomIn, ZoomOut, Maximize, Lock } from 'lucide-react';
import clsx from 'clsx';
import { useTelemetryStore } from '../../store/useTelemetryStore';

interface InfiniteCanvasProps {
  tabId: string;
  children: React.ReactNode;
}

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ tabId, children }) => {
  const { canvasStates, updateCanvasState } = useLayoutStore();
  const { theme } = useTelemetryStore();
  const transformComponentRef = useRef<ReactZoomPanPinchContentRef>(null);
  const [mounted,SxMounted] = useState(false);

  const savedState = canvasStates[tabId] || { scale: 1, positionX: 0, positionY: 0 };
  const isDark = theme === 'dark';

  useEffect(() => {
    SxMounted(true);
  }, []);

  const handleTransformed = (ref: ReactZoomPanPinchContentRef) => {
    const { scale, positionX, positionY } = ref.instance.transformState;

    updateCanvasState(tabId, { scale, positionX, positionY });
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">

      {/* Controls */}
      <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2">
        <ControlButton
            onClick={() => transformComponentRef.current?.zoomIn()}
            icon={<ZoomIn size={18} />}
            title="Zoom In"
        />
        <ControlButton
            onClick={() => transformComponentRef.current?.zoomOut()}
            icon={<ZoomOut size={18} />}
            title="Zoom Out"
        />
        <ControlButton
            onClick={() => transformComponentRef.current?.resetTransform()}
            icon={<Maximize size={18} />}
            title="Fit to Screen"
        />
      </div>

      <TransformWrapper
        ref={transformComponentRef}
        initialScale={savedState.scale}
        initialPositionX={savedState.positionX}
        initialPositionY={savedState.positionY}
        minScale={0.2}
        maxScale={3}
        onTransformed={handleTransformed}
        centerOnInit={!canvasStates[tabId]}
        limitToBounds={false}
        wheel={{ step: 0.05 }}
        panning={{
            excluded: ['drag-handle', 'recharts-surface'],
            velocityDisabled: true
        }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperClass="w-full h-full"
          contentClass="infinite-canvas-content"
          contentStyle={{ width: '5000px', height: '5000px', cursor: 'grab' }}
        >
          {/* BACKGROUND GRID */}
          <div className={clsx(
              "absolute inset-0 pointer-events-none z-0",
              isDark ? "opacity-20" : "opacity-10"
          )}
          style={{
              backgroundImage: `radial-gradient(${isDark ? '#aaa' : '#000'} 1.5px, transparent 1.5px)`,
              backgroundSize: '40px 40px',
              width: '100%',
              height: '100%'
          }}
          />

          {/* WIDGET LAYER */}
          <div className="relative z-10 w-full h-full">
            {mounted && children}
          </div>

        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

const ControlButton: React.FC<{ onClick: () => void; icon: React.ReactNode, title: string }> = ({ onClick, icon, title }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        title={title}
        className="w-10 h-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:border-primary dark:hover:border-primary transition-all shadow-lg rounded-sm"
    >
        {icon}
    </button>
);