// src/components/salary/SalaryForm.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeService } from "../../services/employeeService";
import { departmentService } from "../../services/departmentService";

export default function SalaryForm({ salary, onSubmit, onCancel }) {
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAll,
    select: (res) => res.data,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
    select: (res) => res.data,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      employee: formData.get("employee"),
      department: formData.get("department"),
      baseSalary: Number(formData.get("baseSalary")),
      bonus: Number(formData.get("bonus")),
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
        <select
          name="employee"
          defaultValue={salary?.employee?._id || ""}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
        <select
          name="department"
          defaultValue={salary?.department?._id || ""}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Base Salary (₹)</label>
        <input
          name="baseSalary"
          type="number"
          defaultValue={salary?.baseSalary || ""}
          required
          min="0"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bonus (₹)</label>
        <input
          name="bonus"
          type="number"
          defaultValue={salary?.bonus || 0}
          min="0"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
          Cancel
        </button>
        <button type="submit" className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl transition">
          {salary ? "Update" : "Add"} Salary
        </button>
      </div>
    </form>
  );
}