/**
 * Converts bytes to a human-readable file size.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extracts the file extension from a filename.
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1);
};
