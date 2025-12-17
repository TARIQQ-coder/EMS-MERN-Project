// src/pages/admin/EmployeesPage.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "../../services/employeeService";
import EmployeeTable from "../../components/employees/EmployeeTable";
import EmployeeForm from "../../components/employees/EmployeeForm";
import DepartmentModal from "../../components/departments/DepartmentModal";
import DeleteConfirmModal from "../../components/departments/DeleteConfirmModal";
import { Loader2, Search } from "lucide-react";

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // ← New state for search

  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAll,
    select: (res) => res.data,
  });

  // Filter employees based on search term
  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      setIsAddModalOpen(false);
    },
  });

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

  const handleAdd = (data) => createMutation.mutate(data);
  const handleEdit = (emp) => {
    setCurrentEmployee(emp);
    setIsEditModalOpen(true);
  };
  const handleUpdate = (data) => updateMutation.mutate({ id: currentEmployee._id, data });
  const handleDelete = (emp) => {
    setCurrentEmployee(emp);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = () => deleteMutation.mutate(currentEmployee._id);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-purple-700" /></div>;
  if (error) return <div className="text-center text-red-600 py-12">Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
          <p className="text-gray-600 mt-2">Manage all employees in your organization</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-6 rounded-xl transition"
        >
          + Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>

      <EmployeeTable employees={filteredEmployees} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modals remain the same */}
      <DepartmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Employee">
        <EmployeeForm onSubmit={handleAdd} onCancel={() => setIsAddModalOpen(false)} />
      </DepartmentModal>

      <DepartmentModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setCurrentEmployee(null); }} title="Edit Employee">
        <EmployeeForm employee={currentEmployee} onSubmit={handleUpdate} onCancel={() => { setIsEditModalOpen(false); setCurrentEmployee(null); }} />
      </DepartmentModal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        departmentName={currentEmployee?.name || "this employee"}
      />
    </div>
  );
}