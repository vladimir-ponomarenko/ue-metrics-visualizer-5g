import React, { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch';
import { useLayoutStore } from '../../store/useLayoutStore';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
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
  const [mounted, setMounted] = useState(false);
  const savedState = canvasStates[tabId] || { scale: 1, positionX: 0, positionY: 0 };
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTransformed = (ref: ReactZoomPanPinchContentRef) => {
    const { scale, positionX, positionY } = ref.instance.transformState;
    updateCanvasState(tabId, { scale, positionX, positionY });
  };

  const handleReset = () => {
      if (transformComponentRef.current) {
          transformComponentRef.current.setTransform(0, 0, 1, 500);
      }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">

      {/* Controls */}
      <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-auto">
        <ControlButton
            onClick={() => transformComponentRef.current?.zoomIn(0.2)}
            icon={<ZoomIn size={18} />}
            title="Zoom In"
        />
        <ControlButton
            onClick={() => transformComponentRef.current?.zoomOut(0.2)}
            icon={<ZoomOut size={18} />}
            title="Zoom Out"
        />
        <ControlButton
            onClick={handleReset}
            icon={<Maximize size={18} />}
            title="Reset View (0,0)"
        />
      </div>

      <TransformWrapper
        ref={transformComponentRef}
        initialScale={savedState.scale}
        initialPositionX={savedState.positionX}
        initialPositionY={savedState.positionY}
        minScale={0.2}
        maxScale={4}
        onTransformed={handleTransformed}
        centerOnInit={false}
        limitToBounds={false}
        wheel={{ step: 0.05 }}
        panning={{
            excluded: ['drag-handle', 'widget-interactive-area'],
            velocityDisabled: true
        }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperClass="w-full h-full"
          contentClass="infinite-canvas-content"
          contentStyle={{
              minWidth: '100%',
              minHeight: '100%',
              width: '100vw',
              height: '100vh',
              cursor: 'grab'
          }}
        >
          {/* BACKGROUND GRID */}
          <div className={clsx(
              "absolute top-[-5000px] left-[-5000px] right-[-5000px] bottom-[-5000px] pointer-events-none z-0",
              "opacity-40"
          )}
          style={{
              backgroundImage: `radial-gradient(${isDark ? '#757474ff' : '#000'} 1.5px, transparent 1.5px)`,
              backgroundSize: '40px 40px',
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