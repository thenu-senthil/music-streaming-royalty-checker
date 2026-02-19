'use client';

import { useRef, useState } from 'react';
import Papa from 'papaparse';

interface UploadProps {
  onFileLoaded: (content: string) => void;
  onError: (error: string) => void;
}

export default function Upload({ onFileLoaded, onError }: UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      onError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoaded(content);
    };
    reader.onerror = () => {
      onError('Error reading file');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const loadSampleCSV = async () => {
    try {
      const response = await fetch('/sample_streams.csv');
      const content = await response.text();
      onFileLoaded(content);
    } catch (error) {
      onError('Failed to load sample CSV');
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-2xl border border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-[color:var(--sc-gold-2)] bg-[rgba(244,215,123,0.06)]'
            : 'border-[color:var(--sc-border)] hover:border-[color:var(--sc-border-2)] bg-[rgba(255,255,255,0.02)]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
        />
        <p className="mb-2 text-sm text-[color:var(--sc-muted)]">
          Drag and drop a CSV file here, or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="font-semibold text-[color:var(--sc-gold-2)] hover:text-[color:var(--sc-gold)]"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-[color:var(--sc-muted)]">
          Required columns: <span className="font-medium">date</span>, <span className="font-medium">platform</span>,{' '}
          <span className="font-medium">artist</span>, <span className="font-medium">track</span>,{' '}
          <span className="font-medium">country</span>, <span className="font-medium">streams</span>
        </p>
      </div>

      <div className="text-center">
        <button
          onClick={loadSampleCSV}
          className="sc-btn-secondary text-xs sm:text-sm"
        >
          Load Sample CSV
        </button>
      </div>
    </div>
  );
}
