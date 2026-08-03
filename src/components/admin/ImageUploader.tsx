'use client';

import { AlertCircle, CheckCircle2, FileImage, RefreshCw, Upload, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { STORAGE } from '@/constants';
import { processUploadedImage, requestImageUpload } from '@/features/media/upload-actions';
import type { ImageUploadResult } from '@/lib/storage/types';
import { cn } from '@/lib/utils';

export interface UploadedImage extends ImageUploadResult {
  originalFilename: string;
}

interface ImageUploaderProps {
  folder: string;
  onUploadComplete?: (result: UploadedImage | UploadedImage[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

type UploadStatus = 'idle' | 'requesting' | 'uploading' | 'processing' | 'success' | 'error';

interface FileUploadState {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
  result?: ImageUploadResult;
  xhr?: XMLHttpRequest;
}

export function ImageUploader({
  folder,
  onUploadComplete,
  multiple = false,
  maxFiles = 10,
  maxSizeMB,
  className,
}: ImageUploaderProps) {
  const actualMaxSizeMB = maxSizeMB || STORAGE.LIMITS.MAX_IMAGE_SIZE_MB;
  const [uploads, setUploads] = useState<FileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Concurrency control
  const CONCURRENCY_LIMIT = 3;

  const updateUploadState = useCallback((id: string, updates: Partial<FileUploadState>) => {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  }, []);

  const startUpload = useCallback(
    async (id: string, file: File) => {
      let xhr: XMLHttpRequest | undefined;
      try {
        // 1. Request presigned URL
        const metadata = {
          filename: file.name,
          size: file.size,
          contentType: file.type,
          folder,
        };

        const presignedRes = await requestImageUpload(metadata);
        if (!presignedRes.success || !presignedRes.data) {
          throw new Error(presignedRes.error || 'Failed to get upload URL');
        }

        const { url, storageKey } = presignedRes.data;

        // 2. Upload via XHR for progress tracking
        updateUploadState(id, { status: 'uploading' });

        await new Promise<void>((resolve, reject) => {
          xhr = new XMLHttpRequest();
          updateUploadState(id, { xhr });

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 100);
              updateUploadState(id, { progress });
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr!.status >= 200 && xhr!.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr!.status}`));
            }
          });

          xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
          xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

          xhr.open('PUT', url);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        });

        // 3. Process on Server
        updateUploadState(id, { status: 'processing', progress: 100 });
        const processRes = await processUploadedImage(storageKey, file.name, folder);

        if (!processRes.success || !processRes.data) {
          throw new Error(processRes.error || 'Server processing failed');
        }

        updateUploadState(id, { status: 'success', result: processRes.data });
      } catch (error: any) {
        if (error.message !== 'Upload cancelled') {
          updateUploadState(id, { status: 'error', error: error.message });
        }
      }
    },
    [folder, updateUploadState]
  );

  const processQueue = useCallback(() => {
    setUploads((currentUploads) => {
      const activeCount = currentUploads.filter(
        (u) => u.status === 'requesting' || u.status === 'uploading' || u.status === 'processing'
      ).length;

      if (activeCount >= CONCURRENCY_LIMIT) return currentUploads;

      const toStart = currentUploads.find((u) => u.status === 'idle');
      if (!toStart) {
        // Check if all are done (success or error)
        const allDone = currentUploads.every((u) => u.status === 'success' || u.status === 'error');
        if (allDone && currentUploads.length > 0) {
          const successful = currentUploads
            .filter((u) => u.status === 'success' && u.result)
            .map((u) => ({ ...u.result!, originalFilename: u.file.name }));

          if (successful.length > 0 && onUploadComplete) {
            // Use setTimeout to avoid state update loops
            setTimeout(() => {
              onUploadComplete(multiple ? successful : successful[0]);
            }, 0);
          }
        }
        return currentUploads;
      }

      startUpload(toStart.id, toStart.file);
      return currentUploads.map((u) => (u.id === toStart.id ? { ...u, status: 'requesting' } : u));
    });
  }, [multiple, onUploadComplete, startUpload]);

  useEffect(() => {
    processQueue();
  }, [uploads, processQueue]);

  const handleFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files);

    // Validate
    const validFiles: File[] = [];
    for (const file of newFiles) {
      if (file.size > actualMaxSizeMB * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max size is ${actualMaxSizeMB}MB.`);
        continue;
      }
      if (!STORAGE.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
        alert(`File ${file.name} has an unsupported format.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const filesToAdd = multiple ? validFiles.slice(0, maxFiles - uploads.length) : [validFiles[0]];

    const newUploads = filesToAdd.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'idle' as UploadStatus,
      progress: 0,
    }));

    if (multiple) {
      setUploads((prev) => [...prev, ...newUploads]);
    } else {
      // For single upload, cancel existing and replace
      if (uploads.length > 0 && uploads[0].xhr) {
        uploads[0].xhr.abort();
      }
      setUploads(newUploads);
    }
  };

  const cancelUpload = (id: string) => {
    setUploads((prev) => {
      const target = prev.find((u) => u.id === id);
      if (target?.xhr) {
        target.xhr.abort();
      }
      return prev.filter((u) => u.id !== id);
    });
  };

  const retryUpload = (id: string) => {
    updateUploadState(id, { status: 'idle', error: undefined, progress: 0 });
  };

  // Drag and drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Dropzone */}
      {!multiple && uploads.length > 0 && uploads[0].status === 'success' ? null : (
        <div
          className={cn(
            'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors',
            isDragging ? 'bg-primary/5 border-primary' : 'hover:border-primary/50 border-gray-300'
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto mb-4 h-10 w-10 text-gray-400" />
          <p className="text-sm font-medium text-gray-600">
            Drag & drop {multiple ? 'images' : 'an image'} here, or click to browse
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Supports JPG, PNG, WebP, AVIF, HEIC, TIFF, GIF up to {actualMaxSizeMB}MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={STORAGE.ALLOWED_IMAGE_TYPES.join(',')}
            multiple={multiple}
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = ''; // Reset input
            }}
          />
        </div>
      )}

      {/* Uploads List */}
      {uploads.length > 0 && (
        <div className="space-y-3">
          {uploads.map((upload) => (
            <div key={upload.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  {upload.result ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={upload.result.cdnUrl}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gray-100">
                      <FileImage className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{upload.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center space-x-2">
                  {upload.status === 'error' && (
                    <button
                      onClick={() => retryUpload(upload.id)}
                      className="p-1 text-gray-500 transition-colors hover:text-primary"
                      title="Retry"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}
                  {upload.status !== 'success' && (
                    <button
                      onClick={() => cancelUpload(upload.id)}
                      className="p-1 text-gray-500 transition-colors hover:text-red-500"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {upload.status === 'success' && (
                    <button
                      onClick={() => cancelUpload(upload.id)}
                      className="p-1 text-gray-500 transition-colors hover:text-red-500"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress and Status */}
              {upload.status !== 'idle' &&
                upload.status !== 'success' &&
                upload.status !== 'error' && (
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-medium capitalize text-gray-500">
                        {upload.status}...
                      </span>
                      <span className="text-gray-500">{upload.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  </div>
                )}

              {/* Error Message */}
              {upload.status === 'error' && (
                <div className="mt-2 flex items-center rounded bg-red-50 p-2 text-xs text-red-600">
                  <AlertCircle className="mr-1.5 h-4 w-4 shrink-0" />
                  {upload.error}
                </div>
              )}

              {/* Success Stats */}
              {upload.status === 'success' && upload.result && (
                <div className="mt-3 flex items-center justify-between rounded border border-green-100 bg-green-50/50 p-2 text-xs">
                  <div className="flex items-center text-green-700">
                    <CheckCircle2 className="mr-1.5 h-4 w-4 shrink-0" />
                    Optimized to {(upload.result.optimizedSize / 1024).toFixed(1)} KB (
                    {Math.round((1 - upload.result.compressionRatio) * 100)}% smaller)
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
