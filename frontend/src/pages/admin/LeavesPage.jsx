// src/pages/admin/LeaveDashboard.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { employeeService } from "../../services/employeeService"; // optional
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

// Leave service (move to src/services/leaveService.js later if you want)
const leaveService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return axios.get(`/api/leaves${query ? `?${query}` : ""}`);
  },
  updateStatus: (id, status) =>
    axios.put(`/api/leaves/${id}/status`, { status }),
};

export default function LeaveDashboard() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // For calendar click filter

  // Fetch all leave requests
  const {
    data: leaves = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leaves", statusFilter],
    queryFn: () =>
      leaveService.getAll({ status: statusFilter }).then((res) => res.data),
  });

  // Update leave status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => leaveService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["leaves"]);
      toast.success("Leave status updated successfully");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to update leave status"
      );
    },
  });

  const handleStatusChange = (leaveId, newStatus) => {
    updateStatusMutation.mutate({ id: leaveId, status: newStatus });
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Calendar event data
  const calendarEvents = leaves.map((leave) => ({
    id: leave._id,
    title: `${leave.employee?.name} - ${leave.type}`,
    start: leave.startDate,
    end: leave.endDate,
    allDay: true,
    backgroundColor:
      leave.status === "Approved"
        ? "#10b981" // green
        : leave.status === "Rejected"
        ? "#ef4444" // red
        : leave.status === "Cancelled"
        ? "#6b7280" // gray
        : "#f59e0b", // yellow for Pending
    borderColor:
      leave.status === "Approved"
        ? "#059669"
        : leave.status === "Rejected"
        ? "#dc2626"
        : leave.status === "Cancelled"
        ? "#4b5563"
        : "#d97706",
    extendedProps: {
      status: leave.status,
      employee: leave.employee?.name,
      type: leave.type,
    },
  }));

  // Filter leaves by selected date (if clicked on calendar)
  const displayedLeaves = selectedDate
    ? leaves.filter((leave) => {
        const date = new Date(selectedDate);
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        return date >= start && date <= end;
      })
    : leaves;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading leave requests: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and review all employee leave requests
          </p>
        </div>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Pending Requests</p>
          <p className="text-3xl font-bold text-yellow-600">
            {leaves.filter((l) => l.status === "Pending").length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Approved This Month</p>
          <p className="text-3xl font-bold text-green-600">
            {
              leaves.filter(
                (l) =>
                  l.status === "Approved" &&
                  new Date(l.startDate).getMonth() === new Date().getMonth()
              ).length
            }
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-3xl font-bold text-red-600">
            {leaves.filter((l) => l.status === "Rejected").length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">On Leave Today</p>
          <p className="text-3xl font-bold text-purple-600">
            {
              leaves.filter((l) => {
                const today = new Date().toDateString();
                const start = new Date(l.startDate).toDateString();
                const end = new Date(l.endDate).toDateString();
                return (
                  l.status === "Approved" && today >= start && today <= end
                );
              }).length
            }
          </p>
        </div>
      </div>

      {/* Calendar View */}
      {/* Leave Requests Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Employee
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Type
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Dates
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Days
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Applied On
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? ( // ← Use the correct isLoading from useQuery
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
                  </td>
                </tr>
              ) : displayedLeaves.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                displayedLeaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 font-medium">
                      {leave.employee?.name}
                    </td>
                    <td className="py-4 px-6">{leave.type}</td>
                    <td className="py-4 px-6">
                      {formatDate(leave.startDate)} –{" "}
                      {formatDate(leave.endDate)}
                    </td>
                    <td className="py-4 px-6 font-medium">
                      {leave.daysRequested}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          leave.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : leave.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : leave.status === "Cancelled"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">{formatDate(leave.appliedAt)}</td>
                    <td className="py-4 px-6">
                      {leave.status === "Pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleStatusChange(leave._id, "Approved")
                            }
                            disabled={updateStatusMutation.isPending}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(leave._id, "Rejected")
                            }
                            disabled={updateStatusMutation.isPending}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
