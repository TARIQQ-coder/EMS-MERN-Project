// src/components/departments/DepartmentForm.jsx
import React from "react";

export default function DepartmentForm({ department, onSubmit, onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      head: formData.get("head") || null,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
        <input
          name="name"
          type="text"
          defaultValue={department?.name || ""}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Department Head (Optional)</label>
        <input
          name="head"
          type="text"
          defaultValue={department?.head || ""}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl">
          {department ? "Update" : "Create"} Department
        </button>
      </div>
    </form>
  );
}