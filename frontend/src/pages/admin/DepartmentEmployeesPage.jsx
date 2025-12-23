// src/pages/admin/DepartmentEmployeesPage.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentService } from "../../services/departmentService";
import { employeeService } from "../../services/employeeService";
import EmployeeTable from "../../components/employees/EmployeeTable";
import DepartmentModal from "../../components/departments/DepartmentModal";
import DepartmentForm from "../../components/departments/DepartmentForm";
import toast from "react-hot-toast";
import { 
  ArrowLeft, 
  Loader2, 
  Building2, 
  Users, 
  DollarSign,
  TrendingUp,
  UserCheck,
  Award,
  PieChart as PieChartIcon,
  Edit2,
  Trash2
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function DepartmentEmployeesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("employees");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: department,
    isLoading: deptLoading,
    error: deptError,
  } = useQuery({
    queryKey: ["department", id],
    queryFn: () => departmentService.getOne(id).then((res) => res.data),
    enabled: !!id,
  });

  const {
    data: allEmployees = [],
    isLoading: employeesLoading,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAll,
    select: (res) => res.data || [],
  });

  const updateMutation = useMutation({
    mutationFn: (data) => departmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
      queryClient.invalidateQueries(["department", id]);
      toast.success("Department updated successfully");
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update department");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => departmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted successfully");
      navigate("/admin-dashboard/departments");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete department"
      );
    },
  });

  const handleUpdate = (data) => {
    updateMutation.mutate(data);
  };

  const departmentEmployees = allEmployees.filter(
    (emp) => emp.department?._id === id
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  // Calculate statistics
  const stats = {
    totalEmployees: departmentEmployees.length,
    totalSalary: departmentEmployees.reduce((sum, emp) => sum + (emp.baseSalary || 0), 0),
    totalBonus: departmentEmployees.reduce((sum, emp) => sum + (emp.bonus || 0), 0),
    avgSalary: departmentEmployees.length > 0 
      ? departmentEmployees.reduce((sum, emp) => sum + (emp.baseSalary || 0), 0) / departmentEmployees.length 
      : 0,
  };

  // Gender distribution data
  const genderData = React.useMemo(() => {
    const genderCount = departmentEmployees.reduce((acc, emp) => {
      const gender = emp.gender || "Not Specified";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(genderCount).map(([name, value]) => ({
      name,
      value,
    }));
  }, [departmentEmployees]);

  // Salary distribution data (grouped by ranges)
  const salaryData = React.useMemo(() => {
    const ranges = {
      "0-2K": 0,
      "2K-4K": 0,
      "4K-6K": 0,
      "6K-8K": 0,
      "8K+": 0,
    };

    departmentEmployees.forEach((emp) => {
      const salary = emp.baseSalary || 0;
      if (salary < 2000) ranges["0-2K"]++;
      else if (salary < 4000) ranges["2K-4K"]++;
      else if (salary < 6000) ranges["4K-6K"]++;
      else if (salary < 8000) ranges["6K-8K"]++;
      else ranges["8K+"]++;
    });

    return Object.entries(ranges).map(([name, count]) => ({
      name,
      count,
    }));
  }, [departmentEmployees]);

  // Role distribution
  const roleData = React.useMemo(() => {
    const roleCount = departmentEmployees.reduce((acc, emp) => {
      const role = emp.role || "Employee";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(roleCount).map(([name, value]) => ({
      name,
      value,
    }));
  }, [departmentEmployees]);

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

  const StatCard = ({ icon: Icon, label, value, subtext, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} bg-opacity-10 p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
  );

  if (deptLoading || employeesLoading || updateMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700 mb-4" />
        <p className="text-gray-600">Loading department details...</p>
      </div>
    );
  }

  if (deptError) {
    return (
      <div className="text-center py-20">
        <Building2 className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className="text-xl text-red-600">Error loading department</p>
        <p className="text-gray-500 mt-2">{deptError.message}</p>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="text-center py-20">
        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-xl text-gray-600">Department not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 -m-6 p-6">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <Link
            to="/admin-dashboard/departments"
            className="absolute top-6 left-6 text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>

        <div className="px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 relative">
            <div className="flex items-end gap-6 mb-4 md:mb-0">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white">
                <Building2 className="w-16 h-16 text-white" />
              </div>

              <div className="pb-2">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {department.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{departmentEmployees.length} Employee{departmentEmployees.length !== 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span>Head: {department.head || "Not assigned"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Edit2 className="w-5 h-5" />
                Edit
              </button>

              <button
                onClick={() => {
                  if (departmentEmployees.length > 0) {
                    toast.error("Cannot delete department with employees. Please reassign or remove employees first.");
                    return;
                  }

                  toast(
                    (t) => (
                      <div className="space-y-4">
                        <p className="font-medium">
                          Delete <span className="font-bold">{department.name}</span>?
                        </p>
                        <p className="text-sm text-gray-600">
                          This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              toast.dismiss(t.id);
                              deleteMutation.mutate();
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    ),
                    {
                      duration: Infinity,
                      style: {
                        background: '#fff',
                        color: '#000',
                        maxWidth: '400px',
                        padding: '16px',
                      },
                    }
                  );
                }}
                disabled={deleteMutation.isPending || departmentEmployees.length > 0}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                title={departmentEmployees.length > 0 ? "Cannot delete department with employees" : "Delete department"}
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 px-8">
          <div className="flex gap-8">
            {["employees", "analytics", "overview"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              label="Total Employees"
              value={stats.totalEmployees}
              subtext="Active members"
              color="text-purple-600"
              bgColor="bg-white"
            />
            <StatCard
              icon={DollarSign}
              label="Total Payroll"
              value={formatCurrency(stats.totalSalary)}
              subtext="Monthly base salaries"
              color="text-green-600"
              bgColor="bg-white"
            />
            <StatCard
              icon={Award}
              label="Total Bonuses"
              value={formatCurrency(stats.totalBonus)}
              subtext="Monthly incentives"
              color="text-orange-600"
              bgColor="bg-white"
            />
            <StatCard
              icon={TrendingUp}
              label="Average Salary"
              value={formatCurrency(stats.avgSalary)}
              subtext="Per employee"
              color="text-blue-600"
              bgColor="bg-white"
            />
          </div>

          {/* Description */}
          {department.description && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600">{department.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {departmentEmployees.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-16 text-center">
              <PieChartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-xl">No data to display</p>
              <p className="text-gray-400 mt-2">Add employees to see analytics</p>
            </div>
          ) : (
            <>
              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender Distribution */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Gender Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Role Distribution */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Role Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={roleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {roleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Salary Distribution Bar Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Salary Distribution</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                      {salaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Earners */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Top Earners
                </h3>
                <div className="space-y-3">
                  {departmentEmployees
                    .sort((a, b) => (b.baseSalary || 0) - (a.baseSalary || 0))
                    .slice(0, 5)
                    .map((emp, idx) => (
                      <div key={emp._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{emp.name}</p>
                            <p className="text-sm text-gray-600">{emp.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(emp.baseSalary)}</p>
                          {emp.bonus > 0 && (
                            <p className="text-xs text-gray-500">+{formatCurrency(emp.bonus)} bonus</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Employees Tab */}
      {activeTab === "employees" && (
        <div>
          {departmentEmployees.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-16 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-xl">No employees in this department yet</p>
              <p className="text-gray-400 mt-2">Add employees from the Employees page</p>
            </div>
          ) : (
            <EmployeeTable employees={departmentEmployees} />
          )}
        </div>
      )}

      {/* Edit Modal */}
      <DepartmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Department"
      >
        <DepartmentForm
          department={department}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </DepartmentModal>
    </div>
  );
}