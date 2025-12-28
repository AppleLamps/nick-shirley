'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  articleTitle: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  articleTitle,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md mx-4 p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-2">Delete Article</h2>
        <p className="text-sm text-gray-600 font-sans mb-4">
          Are you sure you want to delete <strong>&quot;{articleTitle}&quot;</strong>?
        </p>
        <p className="text-xs text-red-600 font-sans mb-6">
          This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-sans border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-sans font-bold bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
