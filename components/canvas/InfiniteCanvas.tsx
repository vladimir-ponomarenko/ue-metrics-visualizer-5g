import React, { useEffect, useRef } from 'react';
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
  
  const savedState = canvasStates[tabId];
  const isDark = theme === 'dark';

  useEffect(() => {
    if (transformComponentRef.current && savedState) {
      const { setTransform } = transformComponentRef.current;
      setTransform(savedState.positionX, savedState.positionY, savedState.scale);
    }
  }, [tabId]); 

  const handleTransformed = (ref: ReactZoomPanPinchContentRef) => {
    const { scale, positionX, positionY } = ref.instance.transformState;
    updateCanvasState(tabId, { scale, positionX, positionY });
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      
      {/* Controls */}
      <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2">
        <ControlButton onClick={() => transformComponentRef.current?.zoomIn()} icon={<ZoomIn size={18} />} />
        <ControlButton onClick={() => transformComponentRef.current?.zoomOut()} icon={<ZoomOut size={18} />} />
        <ControlButton onClick={() => transformComponentRef.current?.resetTransform()} icon={<Maximize size={18} />} />
      </div>

      <TransformWrapper
        ref={transformComponentRef}
        initialScale={savedState?.scale || 1}
        initialPositionX={savedState?.positionX || 0}
        initialPositionY={savedState?.positionY || 0}
        minScale={0.1}
        maxScale={4}
        onTransformed={handleTransformed}
        centerOnInit={false}
        limitToBounds={false}
        wheel={{ step: 0.1 }}
        panning={{ 
          excluded: ['drag-handle'], 
          velocityDisabled: true 
        }}
      >
        <TransformComponent
          wrapperClass="w-full h-full"
          
          contentStyle={{ width: '10000px', height: '10000px', cursor: 'grab' }}
        >
          {/* СЕТКА */}
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
          
          {/* СЛОЙ ВИДЖЕТОВ */}
          <div className="relative z-10 w-full h-full">
            {children}
          </div>
          
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

const ControlButton: React.FC<{ onClick: () => void; icon: React.ReactNode }> = ({ onClick, icon }) => (
    <button 
        onClick={onClick}
        className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 dark:border-white/20 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:border-primary dark:hover:border-primary transition-all shadow-lg rounded-sm"
    >
        {icon}
    </button>
);