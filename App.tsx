import React, { useState, useEffect } from 'react';
import { Package, Download, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import DropZone from './components/DropZone';
import PreviewTable from './components/PreviewTable';
import Stats from './components/Stats';
import { parseBoothCSV, generateClickPostData, downloadShiftJisCSV } from './utils/csvHelper';
import { BoothOrderRow, ClickPostRow } from './types';

const App: React.FC = () => {
  const [sourceData, setSourceData] = useState<BoothOrderRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [contentDescription, setContentDescription] = useState<string>("雑貨");
  const [honorific, setHonorific] = useState<string>("様");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedData, setGeneratedData] = useState<ClickPostRow[]>([]);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      const data = await parseBoothCSV(file);
      setSourceData(data);
      setFileName(file.name);
    } catch (err: any) {
      setError(err.message || "Failed to parse CSV");
      setSourceData([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setSourceData([]);
    setFileName("");
    setError(null);
    setGeneratedData([]);
  };

  // Automatically generate preview when source data, description, or honorific changes
  useEffect(() => {
    if (sourceData.length > 0) {
      const mapped = generateClickPostData(sourceData, contentDescription, honorific);
      setGeneratedData(mapped);
    }
  }, [sourceData, contentDescription, honorific]);

  const handleDownload = () => {
    if (generatedData.length === 0) return;
    const outputName = `ClickPost_${fileName.replace('.csv', '')}_${new Date().toISOString().slice(0,10)}.csv`;
    downloadShiftJisCSV(generatedData, outputName);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Package size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Booth <span className="text-slate-400 font-light mx-1">to</span> ClickPost
            </h1>
          </div>
          <a 
            href="https://clickpost.jp/" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Click Post Login &rarr;
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Intro / Instructions */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Convert your Orders in Seconds</h2>
          <p className="text-slate-500 text-lg">
            Upload your BOOTH order CSV (UTF-8). We'll format it for Japan Post Click Post (Shift-JIS) instantly.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Settings Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Content Description (内容品)
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  This text will appear on every label. Keep it general (e.g., "書籍", "雑貨").
                </p>
                <input
                  type="text"
                  value={contentDescription}
                  onChange={(e) => setContentDescription(e.target.value)}
                  placeholder="e.g. 雑貨 (Goods)"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Honorific (お届け先敬称)
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Suffix for the recipient's name. Default is "様".
                </p>
                <input
                  type="text"
                  value={honorific}
                  onChange={(e) => setHonorific(e.target.value)}
                  placeholder="e.g. 様"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Upload Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Upload BOOTH CSV</h3>
              <DropZone 
                onFileSelect={handleFileSelect} 
                selectedFileName={fileName}
                onClear={handleClear}
              />
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

             {/* Stats Card (Only visible when data loaded) */}
             {sourceData.length > 0 && (
                <Stats data={sourceData} />
             )}

          </div>

          {/* Right Column: Preview & Action */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {generatedData.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" size={20} />
                    Ready to Download
                  </h3>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <Download size={18} />
                    Download Shift-JIS CSV
                  </button>
                </div>

                <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Preview ({generatedData.length} orders)</span>
                    <span className="text-xs text-slate-400">Scroll horizontally to see more columns</span>
                  </div>
                  <PreviewTable data={generatedData} />
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-800 flex items-start gap-3">
                  <div className="bg-indigo-100 p-1.5 rounded text-indigo-600 mt-0.5">
                    <ArrowRight size={16} />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Next Steps:</p>
                    <ol className="list-decimal pl-4 space-y-1 text-indigo-700">
                      <li>Download the CSV file above.</li>
                      <li>Log in to Japan Post Click Post.</li>
                      <li>Go to "Summary Payment" (まとめ申込).</li>
                      <li>Upload the file. The encoding is already set to Shift-JIS for compatibility.</li>
                    </ol>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full min-h-[400px] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                  <Package size={32} className="opacity-50" />
                </div>
                <p className="font-medium">Data preview will appear here</p>
                <p className="text-sm mt-1">Upload a file to get started</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;