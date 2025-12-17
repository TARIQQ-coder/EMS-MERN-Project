// src/components/employees/EmployeeTable.jsx
import { Edit2, Trash2 } from "lucide-react";

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Name</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Email</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Department</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Role</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Salary</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Join Date</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-gray-500">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium">{emp.name}</td>
                  <td className="py-4 px-6 text-gray-600">{emp.email}</td>
                  <td className="py-4 px-6 text-gray-600">{emp.department?.name || "-"}</td>
                  <td className="py-4 px-6 text-gray-600">{emp.role}</td>
                  <td className="py-4 px-6 font-medium text-purple-700">
                    {formatCurrency((emp.baseSalary || 0) + (emp.bonus || 0))}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(emp.joinDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3">
                      <button onClick={() => onEdit(emp)} className="text-purple-600 hover:text-purple-800 transition">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => onDelete(emp)} className="text-red-600 hover:text-red-800 transition">
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