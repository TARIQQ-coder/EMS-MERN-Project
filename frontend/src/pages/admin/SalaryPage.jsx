// src/pages/admin/SalaryPage.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "../../services/employeeService";
import EmployeeTable from "../../components/employees/EmployeeTable";
import EmployeeForm from "../../components/employees/EmployeeForm";
import DepartmentModal from "../../components/departments/DepartmentModal";
import DeleteConfirmModal from "../../components/departments/DeleteConfirmModal";
import { Loader2, Search } from "lucide-react";

export default function SalaryPage() {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: employees = [], isLoading, error, refetch } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAll,
    select: (res) => res.data,
    refetchOnMount: "always",
    staleTime: 0,
  });

  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => employeeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setIsEditModalOpen(false);
      setCurrentEmployee(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: employeeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setIsDeleteModalOpen(false);
      setCurrentEmployee(null);
    },
  });

  const handleEdit = (emp) => {
    setCurrentEmployee(emp);
    setIsEditModalOpen(true);
  };

  const handleDelete = (emp) => {
    setCurrentEmployee(emp);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = (data) => {
    updateMutation.mutate({ id: currentEmployee._id, data });
  };

  const confirmDelete = () => {
    deleteMutation.mutate(currentEmployee._id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-12">
        Error: {error.message}
        <button onClick={() => refetch()} className="ml-4 px-4 py-2 bg-purple-700 text-white rounded-xl">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Salary Management</h1>
          <p className="text-gray-600 mt-2">
            View and edit employee salaries. New salaries are set during employee onboarding.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Table with Salary Column */}
      <EmployeeTable employees={filteredEmployees} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Edit Modal (includes salary fields) */}
      <DepartmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentEmployee(null);
        }}
        title="Edit Employee Salary"
      >
        <EmployeeForm
          employee={currentEmployee}
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsEditModalOpen(false);
            setCurrentEmployee(null);
          }}
        />
      </DepartmentModal>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        departmentName={`employee ${currentEmployee?.name || ""}`}
      />
    </div>
  );
}