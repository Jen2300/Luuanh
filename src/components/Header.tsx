import { Layers, FileDown, Brush, Sliders, Info, HelpCircle } from 'lucide-react';

interface HeaderProps {
  fileName: string;
  onChangeFileName: (name: string) => void;
  onExport: () => void;
  isExporting: boolean;
  exportProgress: number;
}

export default function Header({
  fileName,
  onChangeFileName,
  onExport,
  isExporting,
  exportProgress,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left section: App Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 text-white shadow-lg shadow-indigo-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-space text-lg font-bold tracking-tight text-white sm:text-xl">
              PSD Layer Studio
            </h1>
            <p className="text-xs font-medium text-slate-400">
              Chuyển đổi và thiết kế nhiều lớp ảnh sang định dạng PSD
            </p>
          </div>
        </div>

        {/* Middle section: File details */}
        <div className="flex items-center gap-2 max-w-xs w-full">
          <span className="text-xs text-slate-500 font-mono">File:</span>
          <input
            type="text"
            id="fileNameInput"
            value={fileName}
            onChange={(e) => onChangeFileName(e.target.value)}
            placeholder="Ten-file.psd"
            className="flex-1 rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-sm text-slate-200 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {isExporting ? (
            <div className="flex items-center gap-3 rounded-lg bg-slate-800 px-4 py-2 border border-slate-700">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              <div className="text-sm font-medium text-slate-300">
                Đang biên dịch PSD ({exportProgress}%)
              </div>
            </div>
          ) : (
            <button
              id="exportPsdBtn"
              onClick={onExport}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-500 px-5  py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:from-indigo-500 hover:to-sky-400 hover:scale-[1.01] transition duration-150 cursor-pointer"
            >
              <FileDown className="h-4 w-4" />
              <span>Xuất file PSD</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
