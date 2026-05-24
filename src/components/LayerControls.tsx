import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit2,
  Check,
  Type,
  Square,
  Image as ImageIcon,
  Plus,
  Layers,
  Sparkles,
  Sliders,
  Settings,
  Grid
} from 'lucide-react';
import { PSDLayer, BlendMode } from '../types';

interface LayerControlsProps {
  layers: PSDLayer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<PSDLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onAddLayer: (type: 'image' | 'text' | 'solid') => void;
}

const BLEND_MODES: { label: string; value: BlendMode }[] = [
  { label: 'Normal (Bình thường)', value: 'normal' },
  { label: 'Multiply (Nhân bản/Tối)', value: 'multiply' },
  { label: 'Screen (Màn hình/Sáng)', value: 'screen' },
  { label: 'Overlay (Chồng phủ)', value: 'overlay' },
  { label: 'Soft Light (Sáng mềm)', value: 'soft-light' },
  { label: 'Hard Light (Sáng mạnh)', value: 'hard-light' },
  { label: 'Color Dodge (Sáng màu)', value: 'color-dodge' },
  { label: 'Color Burn (Tối màu)', value: 'color-burn' },
  { label: 'Darken (Làm tối)', value: 'darken' },
  { label: 'Lighten (Làm sáng)', value: 'lighten' },
  { label: 'Difference (Khác biệt)', value: 'difference' },
  { label: 'Exclusion (Loại trừ)', value: 'exclusion' },
  { label: 'Hue (Sắc độ)', value: 'hue' },
  { label: 'Saturation (Độ bão hòa)', value: 'saturation' },
  { label: 'Color (Màu sắc)', value: 'color' },
  { label: 'Luminosity (Độ sáng)', value: 'luminosity' },
];

export default function LayerControls({
  layers,
  selectedId,
  onSelect,
  onUpdateLayer,
  onDeleteLayer,
  onMoveLayer,
  onAddLayer,
}: LayerControlsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const finishRename = (id: string) => {
    if (editName.trim()) {
      onUpdateLayer(id, { name: editName.trim() });
    }
    setEditingId(null);
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="h-4 w-4 text-emerald-400" />;
      case 'solid':
        return <Square className="h-4 w-4 text-violet-400 fill-violet-400/20" />;
      default:
        return <ImageIcon className="h-4 w-4 text-sky-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 w-full sm:w-[380px] shrink-0">
      
      {/* Tab Header 1: Quick Add Controls */}
      <div className="p-4 border-b border-slate-800">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-300 font-space tracking-tight mb-3">
          <Plus className="h-4 w-4 text-indigo-400" />
          <span>Thêm lớp mới</span>
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {/* Add Image Layer */}
          <button
            onClick={() => onAddLayer('image')}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-900 transition text-center cursor-pointer"
          >
            <ImageIcon className="h-5 w-5 mb-1.5 text-sky-400" />
            <span className="text-[11px] font-medium font-sans">Thêm Ảnh</span>
          </button>

          {/* Add Text Layer */}
          <button
            onClick={() => onAddLayer('text')}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-900 transition text-center cursor-pointer"
          >
            <Type className="h-5 w-5 mb-1.5 text-emerald-400" />
            <span className="text-[11px] font-medium font-sans">Thêm Chữ</span>
          </button>

          {/* Add Solid Layer */}
          <button
            onClick={() => onAddLayer('solid')}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-900 transition text-center cursor-pointer"
          >
            <Square className="h-5 w-5 mb-1.5 text-violet-400" />
            <span className="text-[11px] font-medium font-sans">Nền màu</span>
          </button>
        </div>
      </div>

      {/* Layers Hierarchy */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-300 font-space tracking-tight">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>Danh sách lớp ({layers.length})</span>
          </h2>
          <span className="text-[10px] bg-slate-950 text-slate-500 font-mono px-1.5 py-0.5 rounded border border-slate-850">
            Từ trên xuống dưới
          </span>
        </div>

        {layers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <Layers className="h-8 w-8 text-slate-600 mb-2 stroke-[1.5]" />
            <p className="text-xs text-slate-400 font-medium">Chưa có lớp nào</p>
            <p className="text-[10px] text-slate-500 mt-1">
              Hãy thêm ảnh hoặc chữ ở trên để bắt đầu!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {layers.map((layer, index) => {
              const isSelected = selectedId === layer.id;
              const isEditing = editingId === layer.id;

              return (
                <div
                  key={layer.id}
                  onClick={() => onSelect(layer.id)}
                  className={`group relative rounded-xl border p-3 flex flex-col gap-2.5 transition duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/80 border-indigo-500/80 shadow-md shadow-indigo-950/20'
                      : 'bg-slate-950/50 border-slate-800 hover:bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  {/* Layer Meta details */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Layer Icon */}
                      <span className="shrink-0">{getLayerIcon(layer.type)}</span>

                      {/* Layer Name / Rename input */}
                      {isEditing ? (
                        <div className="flex items-center gap-1 flex-1 min-w-0" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={() => finishRename(layer.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') finishRename(layer.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="bg-slate-900 text-xs text-white px-2 py-0.5 rounded border border-indigo-500 outline-none w-full font-sans font-medium"
                          />
                          <button
                            onClick={() => finishRename(layer.id)}
                            className="text-emerald-400 hover:text-emerald-300 shrink-0"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-300 truncate font-sans">
                          {layer.name}
                        </span>
                      )}
                    </div>

                    {/* Actions panel */}
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Edit name trigger */}
                      {!isEditing && (
                        <button
                          onClick={() => startRename(layer.id, layer.name)}
                          className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition"
                          title="Đổi tên lớp"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {/* eye trigger */}
                      <button
                        onClick={() => onUpdateLayer(layer.id, { visible: !layer.visible })}
                        className={`p-1 rounded transition ${
                          layer.visible
                            ? 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-800'
                            : 'text-slate-600 hover:text-slate-400 hover:bg-slate-850'
                        }`}
                        title={layer.visible ? 'Ẩn lớp' : 'Hiện lớp'}
                      >
                        {layer.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </button>

                      {/* Reorder Buttons (only if not editing) */}
                      <div className="flex items-center gap-0.5">
                        <button
                          disabled={index === 0}
                          onClick={() => onMoveLayer(layer.id, 'up')}
                          className={`p-1 rounded transition ${
                            index === 0
                              ? 'text-slate-700 pointer-events-none'
                              : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                          }`}
                          title="Lên trên"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={index === layers.length - 1}
                          onClick={() => onMoveLayer(layer.id, 'down')}
                          className={`p-1 rounded transition ${
                            index === layers.length - 1
                              ? 'text-slate-700 pointer-events-none'
                              : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                          }`}
                          title="Xuống dưới"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* delete trigger */}
                      <button
                        onClick={() => onDeleteLayer(layer.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Xóa lớp"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expand opacity/blend mode for selected layer */}
                  {isSelected && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-2" onClick={(e) => e.stopPropagation()}>
                      {/* Opacity slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>Độ mờ đục (Opacity)</span>
                          <span>{Math.round(layer.opacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={Math.round(layer.opacity * 100)}
                          onChange={(e) =>
                            onUpdateLayer(layer.id, { opacity: parseFloat(e.target.value) / 100 })
                          }
                          className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-slate-900 accent-indigo-500"
                        />
                      </div>

                      {/* Blend Mode selection */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-400">Chế độ hòa trộn (Blend Mode)</span>
                        <select
                          value={layer.blendMode}
                          onChange={(e) =>
                            onUpdateLayer(layer.id, { blendMode: e.target.value as BlendMode })
                          }
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          {BLEND_MODES.map((mode) => (
                            <option key={mode.value} value={mode.value}>
                              {mode.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
