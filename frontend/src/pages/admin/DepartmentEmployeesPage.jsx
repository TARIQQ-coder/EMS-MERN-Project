// src/pages/admin/DepartmentEmployeesPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { employeeService } from "../../services/employeeService";
import { departmentService } from "../../services/departmentService";
import { ArrowLeft, Loader2, Building2 } from "lucide-react";

export default function DepartmentEmployeesPage() {
  const { id } = useParams(); // department ID from URL

  // Fetch all departments and find the one matching the ID
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
    select: (res) => res.data || [],
  });

  const department = departments.find((dept) => dept._id === id);

  // Fetch employees and filter by department
  const { data: allEmployees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAll,
    select: (res) => res.data || [],
  });

  const employees = allEmployees.filter((emp) => emp.department?._id === id);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (!department) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Back Button and Department Title */}
      <div className="flex items-center gap-6">
        <Link to="/admin-dashboard/departments" className="text-purple-600 hover:text-purple-800 transition">
          <ArrowLeft className="w-10 h-10" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-2xl">
            <Building2 className="w-10 h-10 text-purple-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{department.name}</h1>
            <p className="text-gray-600 mt-1">
              {employees.length} employee{employees.length !== 1 ? "s" : ""} • 
              Head: {department.head || "Not assigned"}
            </p>
          </div>
        </div>
      </div>

      {/* Employee List */}
      {employeesLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <p className="text-gray-500 text-xl">No employees in this department yet.</p>
          <p className="text-gray-400 mt-2">Add employees from the Employees page.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Name</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Email</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Role</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Join Date</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Salary</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-medium">{emp.name}</td>
                    <td className="py-4 px-6 text-gray-600">{emp.email}</td>
                    <td className="py-4 px-6 text-gray-600">{emp.role}</td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(emp.joinDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-medium text-purple-700">
                      {formatCurrency((emp.baseSalary || 0) + (emp.bonus || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}