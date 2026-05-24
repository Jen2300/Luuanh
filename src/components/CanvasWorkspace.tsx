import React, { useEffect, useRef, useState, MouseEvent as ReactMouseEvent } from 'react';
import { Move, Maximize2, Type, Square, Sliders, AlertCircle, Minus, Plus } from 'lucide-react';
import { PSDLayer, PSDCanvas, LayerFilters } from '../types';

interface CanvasWorkspaceProps {
  canvasConfig: PSDCanvas;
  layers: PSDLayer[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<PSDLayer>) => void;
}

export default function CanvasWorkspace({
  canvasConfig,
  layers,
  selectedId,
  onSelect,
  onUpdateLayer,
}: CanvasWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 600, height: 400 });
  const [manualZoom, setManualZoom] = useState<number | null>(null);

  // Drag and resize tracking state
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ mouseX: 0, mouseY: 0, layerX: 0, layerY: 0 });
  const [resizeStart, setResizeStart] = useState({
    mouseX: 0,
    mouseY: 0,
    layerW: 0,
    layerH: 0,
    layerX: 0,
    layerY: 0,
    aspectRatio: 1,
  });

  // Calculate fitting scale automatically
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 40;
      const w = rect.width - padding;
      const h = rect.height - padding;
      
      setContainerSize({ width: rect.width, height: rect.height });

      if (manualZoom === null) {
        // Calculate auto fit zoom scale standard factor
        const scaleX = w / canvasConfig.width;
        const scaleY = h / canvasConfig.height;
        const fitScale = Math.min(scaleX, scaleY, 1.2); // Cap auto zoom at 120%
        setScale(Math.max(0.1, fitScale));
      } else {
        setScale(manualZoom);
      }
    };

    updateSize();

    // Use ResizeObserver for perfect subpixel matching
    const observer = new ResizeObserver(() => updateSize());
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [canvasConfig, manualZoom]);

  const activeLayer = layers.find((l) => l.id === selectedId);

  // Helper to build CSS filter string from filters config
  const getFilterStyle = (filters?: LayerFilters) => {
    if (!filters) return '';
    const { grayscale, contrast, brightness, blur, sepia, hueRotate, invert } = filters;
    return [
      grayscale > 0 ? `grayscale(${grayscale}%)` : '',
      contrast !== 100 ? `contrast(${contrast}%)` : '',
      brightness !== 100 ? `brightness(${brightness}%)` : '',
      blur > 0 ? `blur(${blur}px)` : '',
      sepia > 0 ? `sepia(${sepia}%)` : '',
      hueRotate > 0 ? `hue-rotate(${hueRotate}deg)` : '',
      invert ? 'invert(100%)' : '',
    ]
      .filter(Boolean)
      .join(' ');
  };

  // Drag Event Handlers
  const handleLayerMouseDown = (e: ReactMouseEvent, layer: PSDLayer) => {
    e.stopPropagation();
    onSelect(layer.id);

    if (!layer.visible) return;

    setIsDragging(true);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      layerX: layer.x,
      layerY: layer.y,
    });
  };

  const handleResizeMouseDown = (e: ReactMouseEvent, layer: PSDLayer) => {
    e.stopPropagation();
    
    setIsResizing(true);
    const aspect = layer.originalWidth && layer.originalHeight 
      ? layer.originalWidth / layer.originalHeight 
      : layer.width / layer.height;

    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      layerW: layer.width,
      layerH: layer.height,
      layerX: layer.x,
      layerY: layer.y,
      aspectRatio: aspect,
    });
  };

  // Global Mouse Move and Mouse Up capture
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && activeLayer) {
        const deltaX = (e.clientX - dragStart.mouseX) / scale;
        const deltaY = (e.clientY - dragStart.mouseY) / scale;
        
        onUpdateLayer(activeLayer.id, {
          x: Math.round(dragStart.layerX + deltaX),
          y: Math.round(dragStart.layerY + deltaY),
        });
      }

      if (isResizing && activeLayer) {
        const deltaX = (e.clientX - resizeStart.mouseX) / scale;
        
        // Calculate new dimensions
        let newWidth = Math.max(10, resizeStart.layerW + deltaX);
        let newHeight = Math.max(10, resizeStart.layerH + (deltaX / resizeStart.aspectRatio));

        // Optional keys hook structure or default locked aspect ratio for image
        if (activeLayer.type !== 'image') {
          // Freely stretch text/solid containers
          const deltaY = (e.clientY - resizeStart.mouseY) / scale;
          newHeight = Math.max(10, resizeStart.layerH + deltaY);
        }

        onUpdateLayer(activeLayer.id, {
          width: Math.round(newWidth),
          height: Math.round(newHeight),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, scale, activeLayer, onUpdateLayer]);

  // Document Checkerboard Grid Background CSS inline
  const checkeredBg = {
    backgroundImage: `
      linear-gradient(45deg, #1e293b 25%, transparent 25%),
      linear-gradient(-45deg, #1e293b 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #1e293b 75%),
      linear-gradient(-45deg, transparent 75%, #1e293b 75%)
    `,
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
    backgroundColor: '#0f172a',
  };

  const handleZoomIn = () => {
    setManualZoom((prev) => {
      const curr = prev === null ? scale : prev;
      return Math.min(4, Math.round((curr + 0.1) * 10) / 10);
    });
  };

  const handleZoomOut = () => {
    setManualZoom((prev) => {
      const curr = prev === null ? scale : prev;
      return Math.max(0.1, Math.round((curr - 0.1) * 10) / 10);
    });
  };

  const handleZoomFit = () => {
    setManualZoom(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 p-4 relative overflow-hidden select-none min-h-[300px]">
      
      {/* Zoom / View Controller */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-1.5 shadow-lg">
        <button
          onClick={handleZoomOut}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Thu nhỏ"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-xs font-mono font-semibold text-slate-300 px-1 min-w-[50px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Phóng to"
        >
          <Plus className="h-4 w-4" />
        </button>
        <div className="h-4 w-[1px] bg-slate-800 mx-1" />
        <button
          onClick={handleZoomFit}
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-2 py-0.5 rounded hover:bg-indigo-950/40 transition cursor-pointer"
        >
          Tự động vừa khít
        </button>
      </div>

      <div className="absolute top-4 right-4 z-40 hidden md:flex items-center gap-1.5 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-400">
        <AlertCircle className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
        <span>Kéo để di chuyển • Kéo góc dưới cùng bên phải để thay đổi kích thước</span>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        onClick={() => onSelect(null)}
        className="flex-1 w-full h-full flex items-center justify-center p-6 overflow-auto"
      >
        {/* Scaled viewport container representing the actual PSD document dimensions */}
        <div
          id="psdDocumentBounds"
          style={{
            width: canvasConfig.width * scale,
            height: canvasConfig.height * scale,
            ...checkeredBg,
          }}
          className="relative shadow-2xl border-2 border-slate-800 transition-[width,height] duration-200"
        >
          {/* Render individual layers */}
          {layers.map((layer) => {
            if (!layer.visible) return null;

            const isSelected = layer.id === selectedId;
            const styleFilters = getFilterStyle(layer.filters);

            // Layer translation to absolute layout
            const layerStyle: React.CSSProperties = {
              position: 'absolute',
              left: layer.x * scale,
              top: layer.y * scale,
              width: layer.width * scale,
              height: layer.height * scale,
              opacity: layer.opacity,
              mixBlendMode: layer.blendMode as any,
              pointerEvents: isDragging || isResizing ? (isSelected ? 'auto' : 'none') : 'auto',
            };

            return (
              <div
                key={layer.id}
                style={layerStyle}
                onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                className={`group absolute cursor-move origin-top-left transition-[outline,shadow] duration-75 ${
                  isSelected ? 'outline-2 outline-dashed outline-indigo-500 z-30' : 'hover:outline-1 hover:outline-slate-500/50'
                }`}
              >
                {/* Visual Content layer type: Image */}
                {layer.type === 'image' && layer.imageSrc && (
                  <img
                    src={layer.imageSrc}
                    alt={layer.name}
                    referrerPolicy="no-referrer"
                    style={{ filter: styleFilters }}
                    className="w-full h-full object-fill select-none"
                    draggable={false}
                  />
                )}

                {/* Visual Content layer type: Solid Color */}
                {layer.type === 'solid' && layer.solidConfig && (
                  <div
                    style={{
                      backgroundColor: layer.solidConfig.color,
                      filter: styleFilters,
                    }}
                    className="w-full h-full"
                  />
                )}

                {/* Visual Content layer type: Text */}
                {layer.type === 'text' && layer.textConfig && (
                  <div
                    style={{
                      color: layer.textConfig.color,
                      fontSize: layer.textConfig.fontSize * scale,
                      fontFamily: layer.textConfig.fontFamily,
                      fontWeight: layer.textConfig.fontWeight,
                      filter: styleFilters,
                    }}
                    className="w-full h-full flex flex-col items-center justify-center text-center font-sans tracking-tight break-words select-none leading-normal p-1 overflow-hidden"
                  >
                    {layer.textConfig.content.split('\n').map((line, i) => (
                      <span key={i}>{line}</span>
                    ))}
                  </div>
                )}

                {/* Selection border and Corner Resize Handle (only visible for selected item) */}
                {isSelected && (
                  <>
                    {/* Corner resize handle at bottom right */}
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, layer)}
                      className="absolute bottom-[-6px] right-[-6px] h-3 w-3 rounded-full bg-indigo-500 border-2 border-white hover:scale-125 hover:bg-sky-400 cursor-se-resize shadow-md z-40 transition-transform flex items-center justify-center"
                      title="Kéo giãn kích thước"
                    >
                      <Maximize2 className="h-1.5 w-1.5 text-white stroke-[3px] hidden" />
                    </div>

                    {/* Left Top tag helper */}
                    <div className="absolute top-[-22px] left-[-2px] bg-indigo-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow z-40">
                      {layer.name} ({layer.width}x{layer.height} F:{layer.blendMode})
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
