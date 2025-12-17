// src/components/departments/DepartmentTable.jsx
import { Edit2, Trash2 } from "lucide-react";

export default function DepartmentTable({ departments, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Name</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Head</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Employees</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-gray-500">
                  No departments found
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept._id || dept.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium">{dept.name}</td>
                  <td className="py-4 px-6 text-gray-600">{dept.head || "-"}</td>
                  <td className="py-4 px-6 text-gray-600 font-semibold text-lg">
                    {dept.employeeCount || 0}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3">
                      <button onClick={() => onEdit(dept)} className="text-purple-600 hover:text-purple-800 transition">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => onDelete(dept)} className="text-red-600 hover:text-red-800 transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}