import { AppError } from '@/errors';

export class StorageError extends AppError {
  constructor(message: string, statusCode = 500) {
    super(message, 'STORAGE_ERROR', statusCode, false);
  }
}

export class UploadError extends StorageError {
  constructor(message = 'Failed to upload file.') {
    super(message, 400);
    this.name = 'UploadError';
  }
}

export class DownloadError extends StorageError {
  constructor(message = 'Failed to download or generate URL.') {
    super(message, 404);
    this.name = 'DownloadError';
  }
}

export class DeleteError extends StorageError {
  constructor(message = 'Failed to delete file.') {
    super(message, 500);
    this.name = 'DeleteError';
  }
}
