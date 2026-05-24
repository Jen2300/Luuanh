import { Sliders, Maximize, Palette, Settings, Type, LayoutGrid, ArrowDownRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { PSDLayer, PSDCanvas, LayerFilters } from '../types';
import VisualFilters from './VisualFilters';

interface PropertiesPanelProps {
  canvasConfig: PSDCanvas;
  layers: PSDLayer[];
  selectedId: string | null;
  onUpdateCanvas: (updates: Partial<PSDCanvas>) => void;
  onUpdateLayer: (id: string, updates: Partial<PSDLayer>) => void;
  onFitCanvasToLayers: () => void;
  onApplySmartPreset: (presetType: string) => void;
}

const FONTS = [
  { name: 'Không gian (Space Grotesk)', value: 'Space Grotesk' },
  { name: 'Kỹ thuật (Fira Code)', value: 'Fira Code' },
  { name: 'Tiêu chuẩn (Inter)', value: 'Inter' },
  { name: 'Hành chính (Arial)', value: 'Arial' },
  { name: 'Cố điển (Georgia)', value: 'Georgia' },
  { name: 'Ấn tượng (Playfair Display)', value: 'Playfair Display' },
];

const WEIGHTS = [
  { label: 'Mỏng (Light)', value: '300' },
  { label: 'Thường (Normal)', value: '400' },
  { label: 'Vừa (Medium)', value: '500' },
  { label: 'Đậm (Bold)', value: '700' },
];

export default function PropertiesPanel({
  canvasConfig,
  layers,
  selectedId,
  onUpdateCanvas,
  onUpdateLayer,
  onFitCanvasToLayers,
  onApplySmartPreset,
}: PropertiesPanelProps) {
  const activeLayer = layers.find((l) => l.id === selectedId);

  const handleCanvasPreset = (w: number, h: number) => {
    onUpdateCanvas({ width: w, height: h });
  };

  return (
    <div className="w-full sm:w-[320px] shrink-0 border-r border-slate-800 bg-slate-900 border-t sm:border-t-0 p-4 overflow-y-auto space-y-6">
      
      {/* 1. Global Document/Canvas Config */}
      <div className="space-y-3.5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-300 font-space tracking-tight">
          <Settings className="h-4 w-4 text-indigo-400" />
          <span>Thông số tài liệu PSD</span>
        </h2>
        
        {/* Dimensions info */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block mb-1">
              Chiều rộng (px)
            </label>
            <input
              type="number"
              value={canvasConfig.width}
              onChange={(e) => onUpdateCanvas({ width: Math.max(1, parseInt(e.target.value) || 0) })}
              className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-300 outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block mb-1">
              Chiều cao (px)
            </label>
            <input
              type="number"
              value={canvasConfig.height}
              onChange={(e) => onUpdateCanvas({ height: Math.max(1, parseInt(e.target.value) || 0) })}
              className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-300 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Quick fitting & Social media crops presets */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-mono font-bold text-slate-500 block">Kích thước mẫu:</span>
          <div className="grid grid-cols-2 gap-1.5 ">
            <button
              onClick={() => handleCanvasPreset(1080, 1080)}
              className="px-2 py-1.5 rounded bg-slate-950 hover:bg-slate-850 text-[10px] text-slate-300 font-medium border border-slate-850 text-left cursor-pointer transition"
            >
              1:1 Vuông (Instagram)
            </button>
            <button
              onClick={() => handleCanvasPreset(1920, 1080)}
              className="px-2 py-1.5 rounded bg-slate-950 hover:bg-slate-850 text-[10px] text-slate-300 font-medium border border-slate-850 text-left cursor-pointer transition"
            >
              16:9 Ngang (FHD Video)
            </button>
            <button
              onClick={() => handleCanvasPreset(1080, 1920)}
              className="px-2 py-1.5 rounded bg-slate-950 hover:bg-slate-850 text-[10px] text-slate-300 font-medium border border-slate-850 text-left cursor-pointer transition"
            >
              9:16 Đứng (TikTok/Stories)
            </button>
            <button
              onClick={onFitCanvasToLayers}
              className="px-2 py-1.5 rounded bg-slate-950 hover:bg-slate-850 text-[10px] text-emerald-400 font-medium border border-slate-850 hover:border-emerald-950 text-left cursor-pointer transition"
              title="Tự động căn lề canvas vừa khít ảnh lớn nhất"
            >
              Vừa khít ảnh nguồn
            </button>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-slate-800/80" />

      {/* 2. Layer Editor (Selected Layer properties) */}
      {!activeLayer ? (
        <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl bg-slate-950/20 border border-slate-850 p-4">
          <ArrowDownRight className="h-6 w-6 text-slate-600 mb-1.5 stroke-[1.5]" />
          <p className="text-xs text-slate-400 font-medium">Bảng điều khiển thông số</p>
          <p className="text-[10px] text-slate-500 mt-1 leading-normal max-w-[200px]">
            Chọn một lớp trên danh sách hoặc nhấp trực tiếp trên màn thiết kế để chỉnh sửa thêm.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider font-mono">
            {activeLayer.type === 'text' ? <Type className="h-4 w-4" /> : activeLayer.type === 'solid' ? <Palette className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
            <span>Điều chỉnh: {activeLayer.name}</span>
          </div>

          {/* Core position inputs */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
              <Maximize className="h-3.5 w-3.5 text-indigo-400" />
              <span>Kích thước & Vị trí (Tọa độ px)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-slate-500">Tọa độ X</label>
                <input
                  type="number"
                  value={activeLayer.x}
                  onChange={(e) => onUpdateLayer(activeLayer.id, { x: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded px-2 py-1 text-slate-300 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500">Tọa độ Y</label>
                <input
                  type="number"
                  value={activeLayer.y}
                  onChange={(e) => onUpdateLayer(activeLayer.id, { y: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded px-2 py-1 text-slate-300 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500">Chiều Rộng</label>
                <input
                  type="number"
                  value={activeLayer.width}
                  onChange={(e) => onUpdateLayer(activeLayer.id, { width: Math.max(1, parseInt(e.target.value) || 0) })}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded px-2 py-1 text-slate-300 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500">Chiều Cao</label>
                <input
                  type="number"
                  value={activeLayer.height}
                  onChange={(e) => onUpdateLayer(activeLayer.id, { height: Math.max(1, parseInt(e.target.value) || 0) })}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded px-2 py-1 text-slate-300 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Text parameters if of type 'text' */}
          {activeLayer.type === 'text' && activeLayer.textConfig && (
            <div className="space-y-3.5 rounded-xl border border-slate-850 bg-slate-950/30 p-3.5">
              <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Type className="h-3.5 w-3.5 text-emerald-400" />
                <span>Nội dung & Cách điệu chữ</span>
              </h3>

              <div>
                <label className="text-[10px] font-mono text-slate-500">Văn bản chữ</label>
                <textarea
                  rows={2}
                  value={activeLayer.textConfig.content}
                  onChange={(e) =>
                    onUpdateLayer(activeLayer.id, {
                      textConfig: { ...activeLayer.textConfig!, content: e.target.value },
                    })
                  }
                  className="w-full text-xs bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-200 outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-500">Cỡ chữ (px)</label>
                  <input
                    type="number"
                    min="8"
                    max="300"
                    value={activeLayer.textConfig.fontSize}
                    onChange={(e) =>
                      onUpdateLayer(activeLayer.id, {
                        textConfig: {
                          ...activeLayer.textConfig!,
                          fontSize: Math.max(8, parseInt(e.target.value) || 12),
                        },
                      })
                    }
                    className="w-full text-xs font-mono bg-slate-950 border border-slate-850 rounded px-2.5 py-1 text-slate-300 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500">Màu sắc</label>
                  <div className="flex gap-1.5 items-center bg-slate-950 p-1 border border-slate-850 rounded">
                    <input
                      type="color"
                      value={activeLayer.textConfig.color}
                      onChange={(e) =>
                        onUpdateLayer(activeLayer.id, {
                          textConfig: { ...activeLayer.textConfig!, color: e.target.value },
                        })
                      }
                      className="h-6 w-8 bg-transparent border-0 rounded cursor-pointer invent-0"
                    />
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {activeLayer.textConfig.color}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500">Kiểu phông (Font Family)</label>
                <select
                  value={activeLayer.textConfig.fontFamily}
                  onChange={(e) =>
                    onUpdateLayer(activeLayer.id, {
                      textConfig: { ...activeLayer.textConfig!, fontFamily: e.target.value },
                    })
                  }
                  className="w-full text-xs bg-slate-950 border border-slate-850 rounded px-2 py-1 text-slate-300 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {FONTS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-500">Độ dày chữ (Font Weight)</label>
                <select
                  value={activeLayer.textConfig.fontWeight}
                  onChange={(e) =>
                    onUpdateLayer(activeLayer.id, {
                      textConfig: { ...activeLayer.textConfig!, fontWeight: e.target.value },
                    })
                  }
                  className="w-full text-xs bg-slate-950 border border-slate-850 rounded px-2 py-1 text-slate-300 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {WEIGHTS.map((weight) => (
                    <option key={weight.value} value={weight.value}>
                      {weight.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Solid parameters if of type 'solid' */}
          {activeLayer.type === 'solid' && activeLayer.solidConfig && (
            <div className="space-y-3.5 rounded-xl border border-slate-855 bg-slate-950/30 p-3.5">
              <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Palette className="h-3.5 w-3.5 text-violet-400" />
                <span>Màu nền rải phẳng (Solid Fill)</span>
              </h3>
              
              <div className="flex gap-2 items-center bg-slate-950 p-2 border border-slate-850 rounded">
                <input
                  type="color"
                  value={activeLayer.solidConfig.color}
                  onChange={(e) =>
                    onUpdateLayer(activeLayer.id, {
                      solidConfig: { color: e.target.value },
                    })
                  }
                  className="h-8 w-12 bg-transparent border-0 rounded cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Mã màu:</span>
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {activeLayer.solidConfig.color}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Visual Canvas adjustment filters (for any type since design filters apply to anything in PSD rendering) */}
          <VisualFilters
            filters={activeLayer.filters || {
              grayscale: 0,
              contrast: 100,
              brightness: 100,
              blur: 0,
              sepia: 0,
              hueRotate: 0,
              invert: false,
            }}
            onChange={(newFilters) => onUpdateLayer(activeLayer.id, { filters: newFilters })}
          />

          {/* Smart Templates suggestions tab for selected layers */}
          <div className="space-y-2 rounded-xl bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-indigo-950/50 p-3.5">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Hiệu ứng nhanh (Presets)</span>
            </span>
            <p className="text-[10px] text-slate-400 leading-normal">
              Áp dụng nhanh các biến thiên hiệu ứng nghệ thuật Photoshop chuyên dụng:
            </p>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => onApplySmartPreset('vintage')}
                className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-705 text-[10px] text-slate-300 rounded cursor-pointer transition text-center font-medium"
              >
                Cổ điển (Vintage)
              </button>
              <button
                onClick={() => onApplySmartPreset('highcontrast')}
                className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-705 text-[10px] text-slate-300 rounded cursor-pointer transition text-center font-medium"
              >
                Kịch tính (Contrast)
              </button>
              <button
                onClick={() => onApplySmartPreset('blurback')}
                className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-705 text-[10px] text-slate-300 rounded cursor-pointer transition text-center font-medium"
              >
                Mờ mơ màng (Dreamy)
              </button>
              <button
                onClick={() => onApplySmartPreset('monochrome')}
                className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-705 text-[10px] text-slate-300 rounded cursor-pointer transition text-center font-medium"
              >
                Đơn sắc (Monochrome)
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
