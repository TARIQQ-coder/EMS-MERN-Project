// src/components/leave/LeaveForm.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { employeeService } from "../../services/employeeService";

export default function LeaveForm({ onSubmit, onCancel }) {
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAll,
    select: (res) => res.data,
  });

  const calculateDays = (from, to) => {
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    const diff = Math.abs(end - start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // inclusive
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      employee: formData.get("employee"),
      type: formData.get("type"),
      from: formData.get("from"),
      to: formData.get("to"),
      reason: formData.get("reason"),
      days: calculateDays(formData.get("from"), formData.get("to")),
      status: "Pending",
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
        <select name="employee" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.department?.name || "No Dept"})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
        <select name="type" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option value="Sick">Sick Leave</option>
          <option value="Casual">Casual Leave</option>
          <option value="Annual">Annual Leave</option>
          <option value="Maternity">Maternity Leave</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <input name="from" type="date" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <input name="to" type="date" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
        <textarea
          name="reason"
          rows="4"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        ></textarea>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
          Cancel
        </button>
        <button type="submit" className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl transition">
          Apply Leave
        </button>
      </div>
    </form>
  );
}