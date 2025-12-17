// src/components/salary/SalaryTable.jsx
import { Edit2, Trash2 } from "lucide-react";

export default function SalaryTable({ salaries, onEdit, onDelete }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Employee</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Department</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Base Salary</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Bonus</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Total</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500">
                  No salary records found
                </td>
              </tr>
            ) : (
              salaries.map((salary) => (
                <tr key={salary._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium">{salary.employee?.name || "N/A"}</td>
                  <td className="py-4 px-6 text-gray-600">{salary.department?.name || "-"}</td>
                  <td className="py-4 px-6 text-gray-600">{formatCurrency(salary.baseSalary)}</td>
                  <td className="py-4 px-6 text-gray-600">{formatCurrency(salary.bonus)}</td>
                  <td className="py-4 px-6 font-bold text-purple-700">
                    {formatCurrency((salary.baseSalary || 0) + (salary.bonus || 0))}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3">
                      <button onClick={() => onEdit(salary)} className="text-purple-600 hover:text-purple-800 transition">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => onDelete(salary)} className="text-red-600 hover:text-red-800 transition">
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