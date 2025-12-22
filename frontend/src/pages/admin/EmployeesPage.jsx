import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "../../services/employeeService";
import EmployeeTable from "../../components/employees/EmployeeTable";
import EmployeeForm from "../../components/employees/EmployeeForm";
import DepartmentModal from "../../components/departments/DepartmentModal";
import { Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // Optional – remove if not using

const PAGE_SIZE = 10;

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data: allEmployees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAll,
    select: (res) => res.data || [],
  });

  // Filter by search only
  const filteredEmployees = allEmployees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
  const paginatedEmployees = filteredEmployees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsAddModalOpen(false);
      toast.success("Employee added successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add employee");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => employeeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsEditModalOpen(false);
      toast.success("Employee updated successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update employee");
    },
  });

  const handleAdd = (data) => {
    createMutation.mutate(data);
  };

  const handleEdit = (emp) => {
    setCurrentEmployee(emp);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (data) => {
    updateMutation.mutate({ id: currentEmployee._id, data });
  };

  const handleRowClick = (empId) => {
    navigate(`/admin-dashboard/employees/${empId}`);
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-purple-700" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
          <p className="text-gray-600 mt-2">Click an employee to view details, salary, status, and actions</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-6 rounded-xl transition"
        >
          + Add Employee
        </button>
      </div>

      {/* Search Bar Only */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>

      {/* Employee Table - No actions column */}
      <EmployeeTable employees={paginatedEmployees} onRowClick={handleRowClick} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-6 py-3 bg-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Previous
          </button>
          <span className="px-6 py-3 bg-gray-100 rounded-xl">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-6 py-3 bg-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Modal */}
      <DepartmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Employee">
        <EmployeeForm onSubmit={handleAdd} onCancel={() => setIsAddModalOpen(false)} />
      </DepartmentModal>

      {/* Edit Modal */}
      <DepartmentModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Employee">
        <EmployeeForm employee={currentEmployee} onSubmit={handleUpdate} onCancel={() => setIsEditModalOpen(false)} />
      </DepartmentModal>
    </div>
  );
}