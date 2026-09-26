'use client';

import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, X, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { compressAndEncodeImage } from '@/lib/userStore';

interface ProfilePhotoUploadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
}

export function ProfilePhotoUpload({
  value,
  onChange,
  size = 'md',
  label = 'Profile Photo',
  helperText = 'PNG, JPG, or WEBP (Max 8MB, auto-compressed)',
}: ProfilePhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const dataUrl = await compressAndEncodeImage(file, 400, 400, 0.85);
      onChange(dataUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // reset input value so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setErrorMessage(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-border/80 hover:border-primary/50 bg-card hover:bg-muted/40'
        } ${errorMessage ? 'border-rose-500/50 bg-rose-500/5' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Thumbnail Preview or Upload Icon */}
        <div className="relative shrink-0">
          {value ? (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-primary/40 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Profile preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-muted/60 border border-border flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors">
              <Camera className="w-7 h-7 mb-0.5" />
              <span className="text-[9px] font-bold uppercase">Upload</span>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 rounded-2xl flex items-center justify-center backdrop-blur-xs">
              <RefreshCw className="w-5 h-5 text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* Details & Actions */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {value ? 'Change Profile Photo' : 'Upload Profile Photo'}
            </span>
            {value && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                Custom Avatar Set
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {helperText}
          </p>
          <p className="text-[10px] text-primary/80 mt-1 font-medium">
            Drag & drop here or click to browse files
          </p>
        </div>

        {/* Remove Button */}
        {value && !isProcessing && (
          <button
            type="button"
            onClick={handleRemove}
            title="Remove photo"
            className="p-1.5 rounded-xl bg-muted hover:bg-rose-500/20 hover:text-rose-500 text-muted-foreground transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error feedback */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
