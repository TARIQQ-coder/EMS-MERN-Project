// src/pages/admin/EmployeeDetailPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
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
  Hash,
} from "lucide-react";
import EmployeeForm from "../../components/employees/EmployeeForm";
import DepartmentModal from "../../components/departments/DepartmentModal";
import { useState } from "react";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", id],
    queryFn: () =>
      employeeService.getAll().then((res) =>
        res.data.find((e) => e._id === id)
      ),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => employeeService.update(id, data),
    onSuccess: () => {
      // Invalidate both list and detail cache
      queryClient.invalidateQueries(["employees"]);
      queryClient.invalidateQueries(["employee", id]);
      setIsEditModalOpen(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus) => employeeService.update(id, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      queryClient.invalidateQueries(["employee", id]);
    },
  });

  const handleUpdate = (data) => {
    updateMutation.mutate(data);
  };

  const handleStatusChange = (newStatus) => {
    statusMutation.mutate(newStatus);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const statusBadge = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      Suspended: "bg-red-100 text-red-800",
      Resigned: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-4 py-2 rounded-full font-medium ${
          colors[status] || colors.Active
        }`}
      >
        {status || "Active"}
      </span>
    );
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4">
      <Icon className="w-5 h-5 text-purple-600 mt-1 shrink-0" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-medium text-gray-800">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  if (isLoading || updateMutation.isPending || statusMutation.isPending) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-purple-700" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-20 text-gray-500 text-xl">
        Employee not found
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 bg-gray-50 z-10 -mx-8 -mt-8 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/admin-dashboard/employees"
              className="text-purple-600 hover:text-purple-800 transition"
            >
              <ArrowLeft className="w-9 h-9" />
            </Link>

            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-linear-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {employee.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-bold text-gray-800">
                    {employee.name}
                  </h1>
                  {statusBadge(employee.status)}
                </div>
                <p className="text-gray-600 mt-2">
                  {employee.role} • {employee.department?.name || "No Department"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-8 py-4 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-xl transition flex items-center gap-3 shadow-lg text-lg"
            >
              <Edit2 className="w-6 h-6" />
              Edit Employee
            </button>

            {employee.status !== "Suspended" && employee.status !== "Resigned" && (
              <button
                onClick={() => handleStatusChange("Suspended")}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition flex items-center gap-3 shadow-lg text-lg"
              >
                <UserX className="w-6 h-6" />
                Deactivate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal & Salary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Personal Information
          </h2>
          <div className="space-y-8">
            <InfoRow icon={Mail} label="Email Address" value={employee.email} />
            <InfoRow icon={Phone} label="Phone Number" value={employee.phone} />
            <InfoRow icon={User} label="Gender" value={employee.gender} />
            <InfoRow
              icon={Calendar}
              label="Join Date"
              value={new Date(employee.joinDate).toLocaleDateString()}
            />
            <InfoRow icon={MapPin} label="Address" value={employee.address} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Salary Information
          </h2>
          <div className="space-y-8">
            <div>
              <p className="text-sm text-gray-500">Base Salary</p>
              <p className="text-4xl font-bold text-purple-700 mt-2">
                {formatCurrency(employee.baseSalary)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bonus</p>
              <p className="text-4xl font-bold text-purple-700 mt-2">
                {formatCurrency(employee.bonus)}
              </p>
            </div>
            <div className="border-t-2 border-gray-200 pt-8">
              <p className="text-lg text-gray-600 font-medium">
                Total Monthly Compensation
              </p>
              <p className="text-5xl font-bold text-green-600 mt-2">
                {formatCurrency(
                  (employee.baseSalary || 0) + (employee.bonus || 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Additional Information
        </h2>
        <div className="flex items-center gap-4">
          <Hash className="w-6 h-6 text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="text-xl font-medium text-gray-800">{employee._id}</p>
          </div>
        </div>
      </div>

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