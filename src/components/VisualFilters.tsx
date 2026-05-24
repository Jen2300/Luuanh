import { Sliders, Sun, Contrast, Maximize, RotateCw, Moon, CheckCircle2, RotateCcw } from 'lucide-react';
import { LayerFilters } from '../types';

interface VisualFiltersProps {
  filters: LayerFilters;
  onChange: (filters: LayerFilters) => void;
}

export default function VisualFilters({ filters, onChange }: VisualFiltersProps) {
  const updateFilter = (key: keyof LayerFilters, value: number | boolean) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const handleReset = () => {
    onChange({
      grayscale: 0,
      contrast: 100,
      brightness: 100,
      blur: 0,
      sepia: 0,
      hueRotate: 0,
      invert: false,
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Sliders className="h-4 w-4 text-indigo-400" />
          <span>Bộ lọc & Hiệu chỉnh lớp</span>
        </h3>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition"
          title="Reset bộ lọc"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Khôi phục</span>
        </button>
      </div>

      <div className="space-y-3">
        {/* Brightness */}
        <div>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Độ sáng (Brightness)</span>
            <span>{filters.brightness}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            value={filters.brightness}
            onChange={(e) => updateFilter('brightness', parseInt(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-indigo-500"
          />
        </div>

        {/* Contrast */}
        <div>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Độ tương phản (Contrast)</span>
            <span>{filters.contrast}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            value={filters.contrast}
            onChange={(e) => updateFilter('contrast', parseInt(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-indigo-500"
          />
        </div>

        {/* Grayscale */}
        <div>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Độ xám (Grayscale)</span>
            <span>{filters.grayscale}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.grayscale}
            onChange={(e) => updateFilter('grayscale', parseInt(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-indigo-500"
          />
        </div>

        {/* Blur */}
        <div>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Độ mờ (Blur)</span>
            <span>{filters.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={filters.blur}
            onChange={(e) => updateFilter('blur', parseInt(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-indigo-500"
          />
        </div>

        {/* Sepia */}
        <div>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Hiệu ứng xưa (Sepia)</span>
            <span>{filters.sepia}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.sepia}
            onChange={(e) => updateFilter('sepia', parseInt(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-indigo-500"
          />
        </div>

        {/* Hue rotate */}
        <div>
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Góc màu (Hue Rotate)</span>
            <span>{filters.hueRotate}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={filters.hueRotate}
            onChange={(e) => updateFilter('hueRotate', parseInt(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-indigo-500"
          />
        </div>

        {/* Invert */}
        <div className="pt-2">
          <label className="flex cursor-pointer items-center justify-between rounded-lg bg-slate-950 p-2 border border-slate-800 hover:border-slate-700 transition">
            <span className="text-xs font-medium text-slate-300">Đảo ngược màu (Invert)</span>
            <input
              type="checkbox"
              checked={filters.invert}
              onChange={(e) => updateFilter('invert', e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
