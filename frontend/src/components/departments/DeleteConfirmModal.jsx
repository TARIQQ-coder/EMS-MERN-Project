// src/components/departments/DeleteConfirmModal.jsx
export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, departmentName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Department</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{departmentName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}