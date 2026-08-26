import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, Plus, AlertCircle } from 'lucide-react';

interface FileDropzoneProps {
  acceptedFiles: string;
  allowMultiple?: boolean;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  title?: string;
  subtitle?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  acceptedFiles,
  allowMultiple = false,
  files,
  onFilesSelected,
  onFileRemove,
  title = 'Select PDF files',
  subtitle = 'or drop PDF documents here to get started',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMsg(null);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    if (!allowMultiple && droppedFiles.length > 1) {
      onFilesSelected([droppedFiles[0]]);
    } else {
      onFilesSelected(droppedFiles);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      onFilesSelected(allowMultiple ? selected : [selected[0]]);
      // Reset input value so re-selecting same file fires change
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 hover:border-rose-400 hover:bg-rose-50/30 dark:hover:bg-rose-950/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFiles}
          multiple={allowMultiple}
          onChange={handleInputChange}
          className="hidden"
          id="file-dropzone-input"
        />

        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {subtitle}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all">
          <UploadCloud className="w-4 h-4" />
          Choose File{allowMultiple ? 's' : ''}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
          <span>Accepted: {acceptedFiles}</span>
          <span>•</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium">100% Client-Side Safe</span>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Selected File{files.length > 1 ? `s (${files.length})` : ''}
            </span>
            {allowMultiple && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add more files
              </button>
            )}
          </div>

          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg shrink-0">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                {onFileRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemove(idx);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
