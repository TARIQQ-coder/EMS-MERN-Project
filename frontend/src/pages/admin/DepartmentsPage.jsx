// src/pages/admin/DepartmentsPage.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "../../services/departmentService";
import { employeeService } from "../../services/employeeService"; // ← Add this import
import DepartmentTable from "../../components/departments/DepartmentTable";
import DepartmentForm from "../../components/departments/DepartmentForm";
import DepartmentModal from "../../components/departments/DepartmentModal";
import DeleteConfirmModal from "../../components/departments/DeleteConfirmModal";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DepartmentsPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);

  // Fetch all departments
  const { data: departments = [], isLoading: departmentsLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
    select: (res) => res.data,
  });

  // Fetch all employees once (we'll filter by department)
  const { data: allEmployees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAll,
    select: (res) => res.data || [],
  });

  // Combine departments with computed stats
  const enhancedDepartments = departments.map((dept) => {
    const deptEmployees = allEmployees.filter(
      (emp) => emp.department?._id === dept._id
    );

    const activeEmployees = deptEmployees.filter(
      (emp) => emp.status === "Active"
    ).length;

    const inactiveEmployees = deptEmployees.filter(
      (emp) =>
        emp.status === "Suspended" || emp.status === "Resigned"
    ).length;

    const totalSalary = deptEmployees.reduce(
      (sum, emp) => sum + (emp.baseSalary || 0) + (emp.bonus || 0),
      0
    );

    const avgSalary =
      deptEmployees.length > 0 ? totalSalary / deptEmployees.length : 0;

    return {
      ...dept,
      activeEmployees,
      inactiveEmployees,
      avgSalary: avgSalary.toFixed(2), // We'll format nicely in table
    };
  });

  const isLoading = departmentsLoading || employeesLoading;

  const createMutation = useMutation({
    mutationFn: departmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      queryClient.invalidateQueries(["employees"]);
      toast.success("Department created successfully");
      setIsAddModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => departmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      toast.success("Department updated successfully");
      setIsEditModalOpen(false);
      setCurrentDepartment(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: departmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      queryClient.invalidateQueries(["employees"]);
      toast.success("Department deleted successfully");
      setIsDeleteModalOpen(false);
      setCurrentDepartment(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete department"
      );
    },
  });

  const handleAdd = (data) => createMutation.mutate(data);

  const handleEdit = (dept) => {
    setCurrentDepartment(dept);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (data) => {
    updateMutation.mutate({ id: currentDepartment._id, data });
  };

  const handleDelete = (dept) => {
    setCurrentDepartment(dept);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(currentDepartment._id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
          <p className="text-gray-600 mt-2">Click a department to view its employees</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-6 rounded-xl transition"
        >
          + Add Department
        </button>
      </div>

      <DepartmentTable
        departments={enhancedDepartments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <DepartmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Department">
        <DepartmentForm onSubmit={handleAdd} onCancel={() => setIsAddModalOpen(false)} />
      </DepartmentModal>

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

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        departmentName={currentDepartment?.name}
      />
    </div>
  );
}