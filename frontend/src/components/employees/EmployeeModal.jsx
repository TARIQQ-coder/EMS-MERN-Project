// src/components/employees/EmployeeDetailsModal.jsx
import React from "react";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Hash,
} from "lucide-react";

export default function EmployeeDetailsModal({ isOpen, onClose, employee }) {
  if (!isOpen || !employee) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const statusBadge = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      Suspended: "bg-red-100 text-red-800",
      Resigned: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-medium ${
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-linear-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {employee.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {employee.name}
                  </h2>
                  {statusBadge(employee.status)}
                </div>
                <p className="text-gray-600 mt-2">
                  {employee.role} • {employee.department?.name || "No Department"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-10">
          {/* Personal Information */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <User className="w-8 h-8 text-purple-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          {/* Salary Information */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <Hash className="w-8 h-8 text-purple-600" />
              Salary Information
            </h3>
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              </div>
              <div className="border-t-2 border-gray-200 mt-8 pt-8">
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

          {/* Additional Information */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Additional Information
            </h3>
            <div className="flex items-center gap-4">
              <Hash className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="text-xl font-medium text-gray-800">{employee._id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}