// src/pages/admin/UserManagementDashboard.jsx
import React, { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Users,
  UserPlus,
  Shield,
  Activity,
  Search,
  Filter,
  Edit,
  Trash2,
  Key,
  Ban,
  CheckCircle,
  XCircle,
  Download,
  Loader2,
  X,
  Lock,
  Eye,
  EyeOff,
  Settings,
  UserX,
  UserCheck,
} from "lucide-react";

// Mock Data
let mockUsers = [
  {
    _id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Admin",
    department: { _id: "1", name: "IT" },
    status: "Active",
    lastLogin: "2025-12-30T14:32:00Z",
  },
  {
    _id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "Manager",
    department: { _id: "2", name: "Sales" },
    status: "Active",
    lastLogin: "2025-12-30T12:00:00Z",
  },
  {
    _id: "3",
    name: "Kwame Nkrumah",
    email: "kwame@example.com",
    role: "HR",
    department: { _id: "3", name: "Human Resources" },
    status: "Active",
    lastLogin: "2025-12-29T10:15:00Z",
  },
  {
    _id: "4",
    name: "Abena Mensah",
    email: "abena@example.com",
    role: "Employee",
    department: { _id: "4", name: "Marketing" },
    status: "Active",
    lastLogin: "2025-12-30T09:45:00Z",
  },
  {
    _id: "5",
    name: "Kofi Annan",
    email: "kofi@example.com",
    role: "Manager",
    department: { _id: "5", name: "Finance" },
    status: "Inactive",
    lastLogin: "2025-11-20T16:30:00Z",
  },
];

const mockDepartments = [
  { _id: "1", name: "IT" },
  { _id: "2", name: "Sales" },
  { _id: "3", name: "Human Resources" },
  { _id: "4", name: "Marketing" },
  { _id: "5", name: "Finance" },
  { _id: "6", name: "Operations" },
];

// Role Permissions Definition
const defaultRolePermissions = {
  Admin: {
    canViewPayroll: true,
    canEditPayroll: true,
    canManageUsers: true,
    canViewReports: true,
    canManageDepartments: true,
    canViewAuditLog: true,
  },
  Manager: {
    canViewPayroll: true,
    canEditPayroll: false,
    canManageUsers: false,
    canViewReports: true,
    canManageDepartments: false,
    canViewAuditLog: false,
  },
  HR: {
    canViewPayroll: true,
    canEditPayroll: true,
    canManageUsers: true,
    canViewReports: true,
    canManageDepartments: true,
    canViewAuditLog: true,
  },
  Employee: {
    canViewPayroll: false,
    canEditPayroll: false,
    canManageUsers: false,
    canViewReports: false,
    canManageDepartments: false,
    canViewAuditLog: false,
  },
};

const permissionLabels = {
  canViewPayroll: "View Payroll Dashboard",
  canEditPayroll: "Edit Payroll Data",
  canManageUsers: "Manage Users (Add/Edit/Delete)",
  canViewReports: "View Reports & Analytics",
  canManageDepartments: "Manage Departments",
  canViewAuditLog: "View Activity/Audit Log",
};

const COLORS = {
  Admin: "text-red-600 bg-red-50",
  Manager: "text-purple-600 bg-purple-50",
  HR: "text-blue-600 bg-blue-50",
  Employee: "text-green-600 bg-green-50",
};

// NEW: Mock Activity Log
const mockActivityLog = [
  {
    id: "log1",
    timestamp: "2025-12-30T14:45:00Z",
    actor: "Alice Johnson",
    action: "user_added",
    target: "Kwame Nkrumah",
    details: "Added new HR user",
  },
  {
    id: "log2",
    timestamp: "2025-12-30T13:20:00Z",
    actor: "Alice Johnson",
    action: "user_edited",
    target: "Bob Smith",
    details: "Changed role to Manager",
  },
  {
    id: "log3",
    timestamp: "2025-12-30T11:10:00Z",
    actor: "Alice Johnson",
    action: "password_reset",
    target: "Abena Mensah",
    details: "Password reset requested",
  },
  {
    id: "log4",
    timestamp: "2025-12-29T16:30:00Z",
    actor: "Alice Johnson",
    action: "user_deactivated",
    target: "Kofi Annan",
    details: "Deactivated user account",
  },
  {
    id: "log5",
    timestamp: "2025-12-29T10:05:00Z",
    actor: "Bob Smith",
    action: "permission_updated",
    target: "Manager",
    details: "Enabled 'View Reports' permission",
  },
  {
    id: "log6",
    timestamp: "2025-12-28T15:50:00Z",
    actor: "Alice Johnson",
    action: "user_deleted",
    target: "John Doe",
    details: "Permanently removed user",
  },
];

const actionIcons = {
  user_added: <UserPlus className="w-5 h-5 text-green-600" />,
  user_edited: <Edit className="w-5 h-5 text-blue-600" />,
  user_deleted: <Trash2 className="w-5 h-5 text-red-600" />,
  user_deactivated: <UserX className="w-5 h-5 text-orange-600" />,
  user_activated: <UserCheck className="w-5 h-5 text-green-600" />,
  password_reset: <Key className="w-5 h-5 text-purple-600" />,
  permission_updated: <Lock className="w-5 h-5 text-indigo-600" />,
};

const actionColors = {
  user_added: "bg-green-50 border-green-200",
  user_edited: "bg-blue-50 border-blue-200",
  user_deleted: "bg-red-50 border-red-200",
  user_deactivated: "bg-orange-50 border-orange-200",
  user_activated: "bg-green-50 border-green-200",
  password_reset: "bg-purple-50 border-purple-200",
  permission_updated: "bg-indigo-50 border-indigo-200",
};

export default function UserManagementDashboard() {
  const [activeTab, setActiveTab] = useState("users"); // "users" or "roles"
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [users, setUsers] = useState(mockUsers);
  const [permissions, setPermissions] = useState(defaultRolePermissions);

  // Form states
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Employee",
    department: "",
    password: "",
  });

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "Employee",
    department: "",
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    admins: users.filter((u) => u.role === "Admin").length,
    managers: users.filter((u) => u.role === "Manager").length,
  };

  // Add User
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    const departmentObj = mockDepartments.find(
      (d) => d._id === newUser.department
    );

    const addedUser = {
      _id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: departmentObj
        ? { _id: departmentObj._id, name: departmentObj.name }
        : null,
      status: "Active",
      lastLogin: null,
    };

    setUsers([...users, addedUser]);
    toast.success(
      `User "${newUser.name}" added successfully! Invitation email sent.`
    );

    setNewUser({
      name: "",
      email: "",
      role: "Employee",
      department: "",
      password: "",
    });
    setShowAddUserModal(false);
  };

  // Edit User
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department?._id || "",
    });
    setShowEditUserModal(true);
  };

  const handleEditUser = (e) => {
    e.preventDefault();

    const departmentObj = mockDepartments.find(
      (d) => d._id === editUser.department
    );

    setUsers(
      users.map((u) =>
        u._id === editingUser._id
          ? {
              ...u,
              name: editUser.name,
              email: editUser.email,
              role: editUser.role,
              department: departmentObj
                ? { _id: departmentObj._id, name: departmentObj.name }
                : null,
            }
          : u
      )
    );

    toast.success(`User "${editUser.name}" updated successfully!`);
    setShowEditUserModal(false);
    setEditingUser(null);
  };

  // Toggle Status & Delete
  const toggleUserStatus = (userId) => {
    setUsers(
      users.map((u) =>
        u._id === userId
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u
      )
    );
    toast.success("User status updated");
  };

  const deleteUser = (userId) => {
    if (window.confirm("Delete this user? This action cannot be undone.")) {
      setUsers(users.filter((u) => u._id !== userId));
      toast.success("User deleted");
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      toast.error("No users selected");
      return;
    }
    toast.success(`Bulk ${action} performed on ${selectedUsers.length} users`);
    setSelectedUsers([]);
  };

  // Permission toggle
  const handlePermissionChange = (role, permission) => {
    setPermissions({
      ...permissions,
      [role]: {
        ...permissions[role],
        [permission]: !permissions[role][permission],
      },
    });
    toast.success(
      `Permission "${permissionLabels[permission]}" toggled for ${role}`
    );
  };

  const UserRow = ({ user }) => (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="py-4 px-6">
        <input
          type="checkbox"
          checked={selectedUsers.includes(user._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers([...selectedUsers, user._id]);
            } else {
              setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
            }
          }}
        />
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            COLORS[user.role] || "text-gray-600 bg-gray-100"
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className="py-4 px-6 text-gray-600">
        {user.department?.name || "-"}
      </td>
      <td className="py-4 px-6">
        {user.status === "Active" ? (
          <span className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            Active
          </span>
        ) : (
          <span className="flex items-center gap-2 text-red-600">
            <XCircle className="w-4 h-4" />
            Inactive
          </span>
        )}
      </td>
      <td className="py-4 px-6 text-sm text-gray-600">
        {user.lastLogin
          ? format(new Date(user.lastLogin), "MMM d, yyyy HH:mm")
          : "Never"}
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(user)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Edit User"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => toast.success("Password reset email sent")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Reset Password"
          >
            <Key className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => toggleUserStatus(user._id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title={user.status === "Active" ? "Deactivate" : "Activate"}
          >
            {user.status === "Active" ? (
              <Ban className="w-4 h-4 text-red-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </button>
          <button
            onClick={() => deleteUser(user._id)}
            className="p-2 hover:bg-red-50 rounded-lg transition"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-8 p-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 px-1 border-b-2 font-medium transition flex items-center gap-2 ${
              activeTab === "users"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users className="w-5 h-5" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`pb-4 px-1 border-b-2 font-medium transition flex items-center gap-2 ${
              activeTab === "roles"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Shield className="w-5 h-5" />
            Roles & Permissions
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-4 px-1 border-b-2 font-medium transition flex items-center gap-2 ${
              activeTab === "activity"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Activity className="w-5 h-5" />
            Activity Log
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                User Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage roles, permissions, and access
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition flex items-center gap-2 shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                Add User
              </button>
              <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-purple-700">
                    {stats.total}
                  </p>
                </div>
                <Users className="w-10 h-10 text-purple-500 opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
                <Activity className="w-10 h-10 text-green-500 opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Administrators</p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.admins}
                  </p>
                </div>
                <Shield className="w-10 h-10 text-red-500 opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Managers</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.managers}
                  </p>
                </div>
                <Users className="w-10 h-10 text-blue-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-4">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="HR">HR</option>
                  <option value="Employee">Employee</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div className="mt-4 flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  {selectedUsers.length} users selected
                </p>
                <button
                  onClick={() => handleBulkAction("deactivate")}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction("reset-password")}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm"
                >
                  Reset Password
                </button>
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                All Users ({filteredUsers.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map((u) => u._id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      User
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Role
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Department
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Last Login
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-12 text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <UserRow key={user._id} user={user} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === "roles" && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Role Permissions
                </h2>
                <p className="text-gray-600 mt-1">
                  Define what each role can access and do
                </p>
              </div>
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition flex items-center gap-2 shadow-lg">
                <Settings className="w-5 h-5" />
                Save Changes
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Permission
                    </th>
                    {Object.keys(permissions).map((role) => (
                      <th
                        key={role}
                        className="text-center py-4 px-6 font-medium text-gray-700"
                      >
                        {role}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(permissionLabels).map((perm) => (
                    <tr
                      key={perm}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Lock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-800">
                            {permissionLabels[perm]}
                          </span>
                        </div>
                      </td>
                      {Object.keys(permissions).map((role) => (
                        <td key={role} className="text-center py-4 px-6">
                          <button
                            onClick={() => handlePermissionChange(role, perm)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                          >
                            {permissions[role][perm] ? (
                              <Eye className="w-6 h-6 text-green-600" />
                            ) : (
                              <EyeOff className="w-6 h-6 text-gray-400" />
                            )}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.keys(permissions).map((role) => {
                const enabledCount = Object.values(permissions[role]).filter(
                  Boolean
                ).length;
                const totalCount = Object.keys(permissionLabels).length;
                return (
                  <div key={role} className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-800 mb-2">{role}</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {enabledCount}/{totalCount}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      permissions enabled
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

        {/* NEW: Activity Log Tab */}
      {activeTab === "activity" && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">System Activity Log</h2>
              <p className="text-gray-600 mt-1">Track all admin actions and changes</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {mockActivityLog.map((log) => (
                  <div
                    key={log.id}
                    className={`p-5 rounded-xl border ${actionColors[log.action] || "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        {actionIcons[log.action] || <Activity className="w-5 h-5 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-gray-900">{log.actor}</p>
                          <span className="text-sm text-gray-500">•</span>
                          <p className="text-sm text-gray-600">
                            {format(new Date(log.timestamp), "MMM d, yyyy 'at' HH:mm")}
                          </p>
                        </div>
                        <p className="text-gray-700">
                          <span className="font-medium">{log.target}</span> — {log.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center text-sm text-gray-500">
                Showing last 6 activities • Real system would show all historical logs
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="john@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="HR">HR</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={newUser.department}
                  onChange={(e) =>
                    setNewUser({ ...newUser, department: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Department</option>
                  {mockDepartments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temporary Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  User will be required to change this on first login
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition shadow-lg"
                >
                  Send Invitation
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
              <button
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="HR">HR</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={editUser.department}
                  onChange={(e) =>
                    setEditUser({ ...editUser, department: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">No Department</option>
                  {mockDepartments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
