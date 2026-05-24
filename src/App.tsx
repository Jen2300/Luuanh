import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  Info,
  HelpCircle,
  Undo2,
  Trash2,
  FileDown,
  Layers,
  ArrowRight,
  Settings,
  AlertCircle,
  Eye,
  Github
} from 'lucide-react';
import { PSDCanvas, PSDLayer, LayerFilters, BlendMode } from './types';
import Header from './components/Header';
import CanvasWorkspace from './components/CanvasWorkspace';
import LayerControls from './components/LayerControls';
import PropertiesPanel from './components/PropertiesPanel';
import { exportPSD } from './utils/psdHelper';

// Stable standalone ID generator compatible with non-secure iframe context
const createId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString().slice(-4);

// Beautiful abstract canvas base-image generator for demo illustration purposes
function generatePlaceholderArt(width: number, height: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Luxury background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0f172a'); // slate-900 / dark sapphire
  grad.addColorStop(0.4, '#1e1b4b'); // indigo-950
  grad.addColorStop(1, '#2e1065'); // purple-950
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Ambient neon highlights
  ctx.fillStyle = 'rgba(99, 102, 241, 0.18)'; // transparent indigo glowing circle
  ctx.beginPath();
  ctx.arc(width * 0.35, height * 0.45, Math.min(width, height) * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(14, 165, 233, 0.14)'; // transparent sky blue crescent
  ctx.beginPath();
  ctx.arc(width * 0.75, height * 0.65, Math.min(width, height) * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // Subtle space dust elements
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.arc(rx, ry, Math.random() * 2 + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/png');
}

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [canvasConfig, setCanvasConfig] = useState<PSDCanvas>({
    width: 800,
    height: 600,
    name: 'Thietke-LayerStudio',
  });
  const [fileName, setFileName] = useState('Thietke-LayerStudio.psd');
  const [layers, setLayers] = useState<PSDLayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Export progress
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Display toast info helper
  const triggerAlert = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  // Bootstrap exquisite interactive demo layers on load
  useEffect(() => {
    const defaultW = 800;
    const defaultH = 600;
    const placeholderUrl = generatePlaceholderArt(defaultW, defaultH);

    const initialLayers: PSDLayer[] = [
      {
        id: createId(),
        name: 'Chữ tiêu đề (Header)',
        type: 'text',
        x: 100,
        y: 160,
        width: 600,
        height: 120,
        opacity: 0.95,
        visible: true,
        blendMode: 'normal',
        textConfig: {
          content: 'THIẾT KẾ PSD LỚP\nStudio Chuyên Nghiệp',
          fontSize: 42,
          color: '#ffffff',
          fontFamily: 'Space Grotesk',
          fontWeight: '700',
        },
        filters: {
          grayscale: 0,
          contrast: 105,
          brightness: 110,
          blur: 0,
          sepia: 0,
          hueRotate: 0,
          invert: false,
        },
      },
      {
        id: createId(),
        name: 'Chữ chú thích (Caption)',
        type: 'text',
        x: 150,
        y: 310,
        width: 500,
        height: 80,
        opacity: 0.85,
        visible: true,
        blendMode: 'normal',
        textConfig: {
          content: 'Trình soạn thảo & chuyển đổi tập tin layer tối ưu',
          fontSize: 18,
          color: '#38bdf8', // sky-400
          fontFamily: 'Inter',
          fontWeight: '500',
        },
        filters: {
          grayscale: 0,
          contrast: 100,
          brightness: 100,
          blur: 0,
          sepia: 0,
          hueRotate: 0,
          invert: false,
        },
      },
      {
        id: createId(),
        name: 'Hòa trộn tím (Overlay Fill)',
        type: 'solid',
        x: 150,
        y: 100,
        width: 500,
        height: 380,
        opacity: 0.35,
        visible: true,
        blendMode: 'overlay',
        solidConfig: {
          color: '#6366f1', // indigo
        },
        filters: {
          grayscale: 0,
          contrast: 100,
          brightness: 100,
          blur: 0,
          sepia: 0,
          hueRotate: 0,
          invert: false,
        },
      },
      {
        id: createId(),
        name: 'Hình nền gốc (Cosmic Dust)',
        type: 'image',
        x: 0,
        y: 0,
        width: defaultW,
        height: defaultH,
        opacity: 1,
        visible: true,
        blendMode: 'normal',
        imageSrc: placeholderUrl,
        originalWidth: defaultW,
        originalHeight: defaultH,
        filters: {
          grayscale: 0,
          contrast: 100,
          brightness: 100,
          blur: 0,
          sepia: 0,
          hueRotate: 0,
          invert: false,
        },
      },
    ];

    setLayers(initialLayers);
    setSelectedId(initialLayers[0].id);
    triggerAlert('Đã khởi tạo bản vẽ mẫu! Bạn có thể chỉnh sửa thử hoặc kéo thả ảnh mới vào đây.', 'success');
  }, []);

  // Update canvas bounds configurations
  const handleUpdateCanvas = (updates: Partial<PSDCanvas>) => {
    setCanvasConfig((prev) => ({ ...prev, ...updates }));
  };

  // Sync filename
  const handleFileNameChange = (name: string) => {
    setFileName(name);
  };

  // Trigger file selection
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // File import processor
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const img = new Image();
        img.src = src;
        img.onload = () => {
          // Calculate sensible placement: fit/center relative to current canvas or standard import size
          let w = img.width;
          let h = img.height;

          // Scale down giant images so they are comfortable on initial import
          if (w > canvasConfig.width || h > canvasConfig.height) {
            const ratio = Math.min(canvasConfig.width / w, canvasConfig.height / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }

          // Center layer
          const x = Math.round((canvasConfig.width - w) / 2);
          const y = Math.round((canvasConfig.height - h) / 2);

          const newLayer: PSDLayer = {
            id: createId(),
            name: file.name.replace(/\.[^/.]+$/, ''), // sanitize extension
            type: 'image',
            imageSrc: src,
            x,
            y,
            width: w,
            height: h,
            originalWidth: img.width,
            originalHeight: img.height,
            opacity: 1,
            visible: true,
            blendMode: 'normal',
            filters: {
              grayscale: 0,
              contrast: 100,
              brightness: 100,
              blur: 0,
              sepia: 0,
              hueRotate: 0,
              invert: false,
            },
          };

          // Append to layers
          setLayers((prev) => [newLayer, ...prev]);
          setSelectedId(newLayer.id);
          triggerAlert(`Đã nhập lớp ảnh "${newLayer.name}" thành công!`, 'success');
        };
      };
      reader.readAsDataURL(file);
    });

    // Reset file input value so we can upload same files again
    e.target.value = '';
  };

  // Layer state single update helper (supports nested state modification neatly)
  const handleUpdateLayer = (id: string, updates: Partial<PSDLayer>) => {
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id !== id) return layer;

        // Merge updates
        const merged = { ...layer, ...updates };
        
        // Handle nested configs to prevent overrides
        if (updates.filters) {
          merged.filters = { ...layer.filters!, ...updates.filters };
        }
        if (updates.textConfig) {
          merged.textConfig = { ...layer.textConfig!, ...updates.textConfig };
        }
        if (updates.solidConfig) {
          merged.solidConfig = { ...layer.solidConfig!, ...updates.solidConfig };
        }

        return merged;
      })
    );
  };

  // Deletion logic
  const handleDeleteLayer = (id: string) => {
    const layerToDelete = layers.find((l) => l.id === id);
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
    if (layerToDelete) {
      triggerAlert(`Đã xóa lớp "${layerToDelete.name}"`, 'info');
    }
  };

  // Layer ordering mover (index swap helper)
  const handleMoveLayer = (id: string, direction: 'up' | 'down') => {
    const index = layers.findIndex((l) => l.id === id);
    if (index === -1) return;

    const newLayers = [...layers];
    if (direction === 'up' && index > 0) {
      // Swap with preceding index
      const temp = newLayers[index];
      newLayers[index] = newLayers[index - 1];
      newLayers[index - 1] = temp;
      setLayers(newLayers);
    } else if (direction === 'down' && index < newLayers.length - 1) {
      // Swap with subsequent index
      const temp = newLayers[index];
      newLayers[index] = newLayers[index + 1];
      newLayers[index + 1] = temp;
      setLayers(newLayers);
    }
  };

  // Add fresh placeholder templates according to user clicks
  const handleAddLayer = (type: 'image' | 'text' | 'solid') => {
    if (type === 'image') {
      triggerImageUpload();
      return;
    }

    let newLayer: PSDLayer;

    if (type === 'text') {
      newLayer = {
        id: createId(),
        name: `Lớp Chữ ${layers.filter((l) => l.type === 'text').length + 1}`,
        type: 'text',
        x: Math.round((canvasConfig.width - 400) / 2),
        y: Math.round((canvasConfig.height - 100) / 2),
        width: 400,
        height: 100,
        opacity: 1,
        visible: true,
        blendMode: 'normal',
        textConfig: {
          content: 'Nội dung chữ mới',
          fontSize: 32,
          color: '#34d399', // emerald-400
          fontFamily: 'Inter',
          fontWeight: '700',
        },
        filters: {
          grayscale: 0,
          contrast: 100,
          brightness: 100,
          blur: 0,
          sepia: 0,
          hueRotate: 0,
          invert: false,
        },
      };
    } else {
      // Solid
      newLayer = {
        id: createId(),
        name: `Màu Phủ ${layers.filter((l) => l.type === 'solid').length + 1}`,
        type: 'solid',
        x: 80,
        y: 80,
        width: Math.round(canvasConfig.width - 160),
        height: Math.round(canvasConfig.height - 160),
        opacity: 0.5,
        visible: true,
        blendMode: 'normal',
        solidConfig: {
          color: '#ec4899', // pink-500
        },
        filters: {
          grayscale: 0,
          contrast: 100,
          brightness: 100,
          blur: 0,
          sepia: 0,
          hueRotate: 0,
          invert: false,
        },
      };
    }

    setLayers((prev) => [newLayer, ...prev]);
    setSelectedId(newLayer.id);
    triggerAlert(`Đã thêm ${type === 'text' ? 'lớp chữ' : 'lớp màu nền'}! Bạn có thể kéo thả di chuyển trên bản vẽ.`, 'success');
  };

  // Automatically expand document dimension bounds to perfectly wrap largest image layer imported
  const handleFitCanvasToLayers = () => {
    const imgLayers = layers.filter((l) => l.type === 'image');
    if (imgLayers.length === 0) {
      triggerAlert('Chưa có lớp ảnh nào để lấy kích thước tham chiếu!', 'error');
      return;
    }

    // Find the layer with the largest area
    const largest = imgLayers.reduce((max, layer) => {
      const area = layer.width * layer.height;
      const maxArea = max.width * max.height;
      return area > maxArea ? layer : max;
    }, imgLayers[0]);

    setCanvasConfig((prev) => ({
      ...prev,
      width: largest.width,
      height: largest.height,
    }));
    triggerAlert(`Đã thu nhỏ/gấp rộng kích thước tài liệu vừa khít với lớp "${largest.name}" (${largest.width}x${largest.height}px)`, 'success');
  };

  // Preset Filters Quick application
  const handleApplySmartPreset = (presetType: string) => {
    if (!selectedId) return;

    let filterUpdates: Partial<LayerFilters> = {};
    let otherUpdates: Partial<PSDLayer> = {};

    switch (presetType) {
      case 'vintage':
        filterUpdates = {
          sepia: 60,
          contrast: 110,
          brightness: 95,
          hueRotate: 18,
          grayscale: 0,
          blur: 0,
          invert: false,
        };
        break;
      case 'highcontrast':
        filterUpdates = {
          contrast: 160,
          brightness: 115,
          grayscale: 0,
          blur: 0,
          sepia: 0,
          invert: false,
        };
        break;
      case 'blurback':
        filterUpdates = {
          blur: 5,
          contrast: 90,
          brightness: 95,
        };
        break;
      case 'monochrome':
        filterUpdates = {
          grayscale: 100,
          contrast: 140,
          brightness: 105,
          sepia: 0,
          blur: 0,
          invert: false,
        };
        break;
      default:
        break;
    }

    const activeLayer = layers.find(l => l.id === selectedId);
    if (!activeLayer) return;

    const currentFilters = activeLayer.filters || {
      grayscale: 0,
      contrast: 100,
      brightness: 100,
      blur: 0,
      sepia: 0,
      hueRotate: 0,
      invert: false,
    };

    const mergedFilters: LayerFilters = {
      ...currentFilters,
      ...filterUpdates,
    };

    handleUpdateLayer(selectedId, { filters: mergedFilters, ...otherUpdates });
    triggerAlert(`Đã áp dụng hiệu ứng mẫu nhanh!`, 'success');
  };

  // Trigger export sequence to download the real Adobe Photoshop PSD
  const handleExportPSD = async () => {
    if (layers.length === 0) {
      triggerAlert('Bản vẽ trống! Hãy thêm ít nhất 1 lớp trước khi xuất file PSD.', 'error');
      return;
    }

    setIsExporting(true);
    setExportProgress(10);

    try {
      const blob = await exportPSD(canvasConfig, layers, (percent) => {
        setExportProgress(percent);
      });

      // Construct browser anchor downloader triggers
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const cleanFileName = fileName.trim().endsWith('.psd') ? fileName.trim() : `${fileName.trim()}.psd`;
      link.download = cleanFileName;
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      triggerAlert(`Xuất tập tin PSD "${cleanFileName}" thành công!`, 'success');
    } catch (err) {
      console.error(err);
      triggerAlert('Có lỗi xảy ra khi đóng gói PSD. Vui lòng thử lại!', 'error');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Drag and drop images handlers directly to Workspace
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Create raw event structure mimic for handling
      const mockEvent = {
        target: {
          files: files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileImport(mockEvent);
    }
  };

  return (
    <div 
      className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      
      {/* Hidden File Input for images picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* App Header topbar bar */}
      <Header
        fileName={fileName}
        onChangeFileName={handleFileNameChange}
        onExport={handleExportPSD}
        isExporting={isExporting}
        exportProgress={exportProgress}
      />

      {/* Main workspace layout content viewport */}
      <main className="flex-1 flex flex-col sm:flex-row overflow-hidden relative">
        
        {/* Left Side: Parameters adjustments sidebar */}
        <PropertiesPanel
          canvasConfig={canvasConfig}
          layers={layers}
          selectedId={selectedId}
          onUpdateCanvas={handleUpdateCanvas}
          onUpdateLayer={handleUpdateLayer}
          onFitCanvasToLayers={handleFitCanvasToLayers}
          onApplySmartPreset={handleApplySmartPreset}
        />

        {/* Center: Interactive canvas designer space */}
        <CanvasWorkspace
          canvasConfig={canvasConfig}
          layers={layers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdateLayer={handleUpdateLayer}
        />

        {/* Right Side: Layers structure manager */}
        <LayerControls
          layers={layers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdateLayer={handleUpdateLayer}
          onDeleteLayer={handleDeleteLayer}
          onMoveLayer={handleMoveLayer}
          onAddLayer={handleAddLayer}
        />

      </main>

      {/* Floating Status Toast Info Alerts */}
      {alertMessage && (
        <div 
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl max-w-sm animate-bounce text-xs font-semibold ${
            alertMessage.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-300' 
              : alertMessage.type === 'error'
              ? 'bg-rose-950/95 border-rose-500/80 text-rose-300'
              : 'bg-slate-900/90 border-slate-700 text-slate-200'
          }`}
        >
          {alertMessage.type === 'success' && <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />}
          {alertMessage.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />}
          {alertMessage.type === 'info' && <Info className="h-4 w-4 shrink-0 text-sky-400" />}
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Elegant Bottom Status Credit bar */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-slate-500 shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Trình vẽ: HTML Canvas Engine + AgPsd Compiler (Pure Client)</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 grayscale opacity-50 hover:opacity-100 transition cursor-pointer">
          <span>Hỗ trợ kéo thả ảnh trực tiếp lên màn hình</span>
        </div>
      </footer>

    </div>
  );
}
