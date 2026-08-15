'use client';

import { Trash2 } from 'lucide-react';

export function DeleteGalleryPhotoButton({
  id,
  albumId,
  action,
}: {
  id: string;
  albumId: string;
  action: (id: string, albumId: string) => Promise<void>;
}) {
  return (
    <form
      action={async () => {
        if (!window.confirm("Delete this photo?\n\nThis will permanently remove this photo from the Gallery.")) {
          return;
        }
        await action(id, albumId);
      }}
      className="inline-block"
    >
      <button
        type="submit"
        title="Delete Photo"
        className="rounded p-1.5 text-red-600 hover:text-red-800"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
