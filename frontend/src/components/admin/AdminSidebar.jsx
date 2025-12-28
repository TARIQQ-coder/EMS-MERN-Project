// src/components/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  ClipboardCheck,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  User,
  Shield,
} from "lucide-react";

import { useAuth } from "../../context/authContext.jsx";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  { name: "Employees", href: "/admin-dashboard/employees", icon: Users },
  {
    name: "Departments",
    href: "/admin-dashboard/departments",
    icon: Building2,
  },
  {
    name: "Leave Management",
    href: "/admin-dashboard/leaves",
    icon: CalendarDays,
  },
  {
    name: "Attendance",
    href: "/admin-dashboard/attendance",
    icon: ClipboardCheck,
  },
  { name: "Payroll", href: "/admin-dashboard/payroll", icon: DollarSign },
  { name: "Reports", href: "/admin-dashboard/reports", icon: FileText },
  { name: "User Management", href: "/admin-dashboard/users", icon: Shield },
  { name: "Settings", href: "/admin-dashboard/settings", icon: Settings },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-purple-700 shadow-2xl flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-purple-600">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white tracking-tighter">
              TBB
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">TomBrownBabies</h1>
            <p className="text-purple-200 text-xs">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-purple-700 shadow-lg"
                    : "text-purple-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive
                        ? "text-purple-700"
                        : "text-purple-200 group-hover:text-white"
                    }`}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-8 bg-white rounded-l-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile + Logout */}
      <div className="border-t border-purple-600 p-4">
        <div className="flex items-center gap-3 px-5 py-3 mb-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {user?.name || "Admin User"}
            </p>
            <p className="text-purple-200 text-xs">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-purple-100 hover:bg-red-600/20 hover:text-white transition-all group"
        >
          <LogOut className="w-5 h-5 text-purple-200 group-hover:text-white" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
