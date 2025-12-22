// src/pages/admin/EmployeeDetailPage.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "../../services/employeeService";
import {
  ArrowLeft,
  Loader2,
  Edit2,
  UserX,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Briefcase,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Building2,
  Shield,
} from "lucide-react";
import EmployeeForm from "../../components/employees/EmployeeForm";
import DepartmentModal from "../../components/departments/DepartmentModal";
import toast from "react-hot-toast";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => employeeService.getOne(id).then((res) => res.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => employeeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      queryClient.invalidateQueries(["employee", id]);
      toast.success("Employee updated successfully");
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update employee");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => employeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted successfully");
      navigate("/admin-dashboard/employees");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete employee"
      );
    },
  });

  const handleUpdate = (data) => {
    updateMutation.mutate(data);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const calculateTenure = (joinDate) => {
    const start = new Date(joinDate);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  };

  const statusConfig = {
    Active: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
    Suspended: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
    Resigned: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500" },
  };

  const statusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.Active;
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
        <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}></span>
        <span className="font-medium">{status || "Active"}</span>
      </div>
    );
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-default`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`${color} bg-opacity-10 p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );

  const InfoCard = ({ icon: Icon, label, value, color = "text-purple-600" }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`${color} bg-opacity-10 p-2 rounded-lg mt-1`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-base font-medium text-gray-800">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  if (isLoading || updateMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700 mb-4" />
        <p className="text-gray-600">Loading employee details...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-20">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-xl text-gray-500">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 -m-6 p-6">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        {/* Gradient Background */}
        <div className="h-32 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <Link
            to="/admin-dashboard/employees"
            className="absolute top-6 left-6 text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>

        {/* Profile Section */}
        <div className="px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-4 md:mb-0">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center text-white text-5xl font-bold shadow-xl ring-4 ring-white">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  {statusBadge(employee.status)}
                </div>
              </div>

              {/* Info */}
              <div className="pb-2">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {employee.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">{employee.role}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{employee.department?.name || "No Department"}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{calculateTenure(employee.joinDate)} with company</span>
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
                  toast(
                    (t) => (
                      <div className="space-y-4">
                        <p className="font-medium">
                          Delete <span className="font-bold">{employee.name}</span>?
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
                disabled={deleteMutation.isPending}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <UserX className="w-5 h-5" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 px-8">
          <div className="flex gap-8">
            {["overview", "details", "salary"].map((tab) => (
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

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            icon={Calendar}
            label="Joined"
            value={new Date(employee.joinDate).toLocaleDateString()}
            color="text-blue-600"
            bgColor="bg-white"
          />
          <StatCard
            icon={DollarSign}
            label="Monthly Salary"
            value={formatCurrency(employee.baseSalary)}
            color="text-green-600"
            bgColor="bg-white"
          />
          <StatCard
            icon={Award}
            label="Monthly Bonus"
            value={formatCurrency(employee.bonus)}
            color="text-orange-600"
            bgColor="bg-white"
          />
        </div>
      )}

      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Personal Information
            </h2>
            <div className="space-y-2">
              <InfoCard icon={Mail} label="Email" value={employee.email} color="text-blue-600" />
              <InfoCard icon={Phone} label="Phone" value={employee.phone} color="text-green-600" />
              <InfoCard icon={User} label="Gender" value={employee.gender} color="text-purple-600" />
              <InfoCard icon={MapPin} label="Address" value={employee.address} color="text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Work Information
            </h2>
            <div className="space-y-2">
              <InfoCard icon={Shield} label="Role" value={employee.role} color="text-indigo-600" />
              <InfoCard icon={Building2} label="Department" value={employee.department?.name} color="text-cyan-600" />
              <InfoCard icon={Calendar} label="Join Date" value={new Date(employee.joinDate).toLocaleDateString()} color="text-orange-600" />
              <InfoCard icon={Clock} label="Tenure" value={calculateTenure(employee.joinDate)} color="text-teal-600" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "salary" && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-8 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            Compensation Breakdown
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <p className="text-sm text-green-700 font-medium mb-2">Base Salary</p>
              <p className="text-4xl font-bold text-green-700">
                {formatCurrency(employee.baseSalary)}
              </p>
              <p className="text-xs text-green-600 mt-2">Monthly fixed compensation</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <p className="text-sm text-orange-700 font-medium mb-2">Monthly Bonus</p>
              <p className="text-4xl font-bold text-orange-700">
                {formatCurrency(employee.bonus)}
              </p>
              <p className="text-xs text-orange-600 mt-2">Performance-based addition</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-8 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-lg text-purple-700 font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Total Monthly Compensation
              </p>
            </div>
            <p className="text-5xl font-bold text-purple-700">
              {formatCurrency((employee.baseSalary || 0) + (employee.bonus || 0))}
            </p>
            <div className="mt-4 pt-4 border-t border-purple-200">
              <p className="text-sm text-purple-600">
                Annual Projection: <span className="font-bold text-lg">
                  {formatCurrency(((employee.baseSalary || 0) + (employee.bonus || 0)) * 12)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <DepartmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Employee"
      >
        <EmployeeForm
          employee={employee}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </DepartmentModal>
    </div>
  );
}