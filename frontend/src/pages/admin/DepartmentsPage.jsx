// src/pages/admin/DepartmentsPage.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "../../services/departmentService";
import DepartmentTable from "../../components/departments/DepartmentTable";
import DepartmentForm from "../../components/departments/DepartmentForm";
import DepartmentModal from "../../components/departments/DepartmentModal";
import DeleteConfirmModal from "../../components/departments/DeleteConfirmModal";
import { Loader2 } from "lucide-react";

export default function DepartmentsPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);

  // Fetch departments with forced fresh data
  const { 
    data: departments = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
    select: (res) => res.data,
    refetchOnMount: "always",    // Always refetch when page mounts
    refetchOnWindowFocus: true,  // Refetch when tab regains focus
    staleTime: 0,                // Data is always considered stale
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: departmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      setIsAddModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => departmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      setIsEditModalOpen(false);
      setCurrentDepartment(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: departmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      setIsDeleteModalOpen(false);
      setCurrentDepartment(null);
    },
  });

  const handleAdd = (data) => createMutation.mutate(data);

  const handleEdit = (dept) => {
    setCurrentDepartment(dept);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (data) => {
    updateMutation.mutate({ id: currentDepartment.id, data });
  };

  const handleDelete = (dept) => {
    setCurrentDepartment(dept);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(currentDepartment.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Error loading departments: {error.message}</p>
        <button onClick={() => refetch()} className="mt-4 px-6 py-3 bg-purple-700 text-white rounded-xl">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
          <p className="text-gray-600 mt-2">Manage all departments in your organization</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => refetch()}
            className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-6 rounded-xl transition flex items-center gap-2"
          >
            + Add Department
          </button>
        </div>
      </div>

      <DepartmentTable departments={departments} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Add Modal */}
      <DepartmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Department">
        <DepartmentForm onSubmit={handleAdd} onCancel={() => setIsAddModalOpen(false)} />
      </DepartmentModal>

      {/* Edit Modal */}
      <DepartmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentDepartment(null);
        }}
        title="Edit Department"
      >
        <DepartmentForm
          department={currentDepartment}
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsEditModalOpen(false);
            setCurrentDepartment(null);
          }}
        />
      </DepartmentModal>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        departmentName={currentDepartment?.name}
      />
    </div>
  );
}