import React, { useCallback, useState } from 'react';
import { Upload, FileType, X } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  selectedFileName?: string;
  onClear: () => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, selectedFileName, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "text/csv" || file.name.endsWith('.csv')) {
        onFileSelect(file);
      } else {
        alert("Please upload a CSV file.");
      }
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  if (selectedFileName) {
    return (
      <div className="w-full p-6 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-center justify-between animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <FileType size={24} />
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">File Loaded</p>
            <p className="font-bold text-slate-800">{selectedFileName}</p>
          </div>
        </div>
        <button 
          onClick={onClear}
          className="p-2 hover:bg-blue-200 rounded-full text-slate-500 hover:text-slate-700 transition-colors"
          title="Remove file"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full p-12 border-2 border-dashed rounded-xl transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer
        ${isDragging 
          ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white'
        }
      `}
    >
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
          <Upload size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">
          Drag & Drop your BOOTH CSV here
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          or click to browse files
        </p>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileInput}
        />
        <span className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
          Select File
        </span>
      </label>
    </div>
  );
};

export default DropZone;