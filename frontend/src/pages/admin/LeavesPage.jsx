// src/pages/admin/LeavePage.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveService } from "../../services/leaveService";
import LeaveTable from "../../components/leave/LeaveTable";
import LeaveForm from "../../components/leave/LeaveForm";
import DepartmentModal from "../../components/departments/DepartmentModal";
import { Loader2, Search } from "lucide-react";

export default function LeavePage() {
  const queryClient = useQueryClient();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All"); // All, Pending, Approved, Rejected

  const { data: leaves = [], isLoading, error } = useQuery({
    queryKey: ["leaves"],
    queryFn: leaveService.getAll,
    select: (res) => res.data,
    refetchOnMount: "always",
    staleTime: 0,
  });

  // Filter by search and status
  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      leave.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.department?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || leave.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const applyMutation = useMutation({
    mutationFn: leaveService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["leaves"]);
      setIsApplyModalOpen(false);
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => leaveService.updateStatus(id, "Approved"),
    onSuccess: () => queryClient.invalidateQueries(["leaves"]),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => leaveService.updateStatus(id, "Rejected"),
    onSuccess: () => queryClient.invalidateQueries(["leaves"]),
  });

  const handleApply = (data) => applyMutation.mutate(data);
  const handleApprove = (leave) => approveMutation.mutate(leave._id);
  const handleReject = (leave) => rejectMutation.mutate(leave._id);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-purple-700" /></div>;
  if (error) return <div className="text-center text-red-600 py-12">Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
          <p className="text-gray-600 mt-2">Review and manage employee leave requests</p>
        </div>
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-6 rounded-xl transition"
        >
          Apply Leave
        </button>
      </div>

      {/* Search + Status Tabs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by employee, department, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-3 rounded-xl font-medium transition ${
                filterStatus === status
                  ? "bg-purple-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status === "All" ? "All Leaves" : status}
            </button>
          ))}
        </div>
      </div>

      <LeaveTable
        leaves={filteredLeaves}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Apply Leave Modal */}
      <DepartmentModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Apply for Leave">
        <LeaveForm onSubmit={handleApply} onCancel={() => setIsApplyModalOpen(false)} />
      </DepartmentModal>
    </div>
  );
}