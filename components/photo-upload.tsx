"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, ImageIcon, X } from "lucide-react";

interface PhotoUploadProps {
  onUpload: (base64: string) => void;
  isAnalyzing: boolean;
  preview: string | null;
  onClear: () => void;
}

export function PhotoUpload({
  onUpload,
  isAnalyzing,
  preview,
  onClear,
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpload(base64);
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  if (preview) {
    return (
      <div className="relative group">
        <div className="relative overflow-hidden rounded-lg border border-border">
          <img
            src={preview}
            alt="Your uploaded photo"
            className="w-full h-80 object-cover"
          />
          {!isAnalyzing && (
            <button
              onClick={onClear}
              className="absolute top-3 right-3 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 transition-all cursor-pointer ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/50 hover:bg-secondary/50"
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
        {isDragging ? (
          <ImageIcon className="h-6 w-6 text-primary" />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {isDragging ? "Drop it like it's hot" : "Drop your best photo here"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG, or WEBP up to 10MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        aria-label="Upload photo"
      />
    </div>
  );
}
