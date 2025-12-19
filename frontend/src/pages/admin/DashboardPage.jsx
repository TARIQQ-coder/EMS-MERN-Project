// src/pages/admin/DashboardPage.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Building2,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

import { employeeService } from "../../services/employeeService";
import { departmentService } from "../../services/departmentService";
import { leaveService } from "../../services/leaveService";

const DashboardPage = () => {
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getAll,
    select: (res) => res.data || [],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentService.getAll,
    select: (res) => res.data || [],
  });

  const { data: leaves = [] } = useQuery({
    queryKey: ["leaves"],
    queryFn: leaveService.getAll,
    select: (res) => res.data || [],
  });

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;

  const totalMonthlySalary = employees.reduce(
    (sum, emp) => sum + (emp.baseSalary || 0) + (emp.bonus || 0),
    0
  );

  const leaveStats = {
    applied: leaves.length,
    pending: leaves.filter((l) => l.status === "Pending").length,
    approved: leaves.filter((l) => l.status === "Approved").length,
    rejected: leaves.filter((l) => l.status === "Rejected").length,
  };

  // GHS formatting
  const formatSalary = (amount) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const onLeaveToday = 8;
  const presentToday = totalEmployees - onLeaveToday;
  const lateArrivals = 5;
  const pendingTasks = 12;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Dashboard Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-gray-800">{totalEmployees}</p>
              <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Departments</p>
              <p className="text-3xl font-bold text-gray-800">{totalDepartments}</p>
              <p className="text-xs text-gray-500 mt-2">Active departments</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Salary</p>
              <p className="text-3xl font-bold text-gray-800">{formatSalary(totalMonthlySalary)}</p>
              <p className="text-xs text-gray-500 mt-2">Monthly payroll</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Leave Details Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Leave Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Leave Applied</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{leaveStats.applied}</p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-100 p-2 rounded">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{leaveStats.pending}</p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{leaveStats.approved}</p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-2 rounded">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
            </div>
            <p className="text-2xl font-bold text-gray-800">{leaveStats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="bg-blue-100 p-2 rounded-full mt-1">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">New employee onboarded</p>
                <p className="text-xs text-gray-500">Sarah Johnson joined Marketing Department</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="bg-orange-100 p-2 rounded-full mt-1">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Leave request pending</p>
                <p className="text-xs text-gray-500">John Smith requested 3 days leave</p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-full mt-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Payroll processed</p>
                <p className="text-xs text-gray-500">Monthly payroll completed successfully</p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">On Leave Today</span>
              </div>
              <span className="text-lg font-bold text-gray-800">{onLeaveToday}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Present Today</span>
              </div>
              <span className="text-lg font-bold text-gray-800">{presentToday}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Late Arrivals</span>
              </div>
              <span className="text-lg font-bold text-gray-800">{lateArrivals}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Pending Tasks</span>
              </div>
              <span className="text-lg font-bold text-gray-800">{pendingTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;