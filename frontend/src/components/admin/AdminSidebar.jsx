// components/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  DollarSign,
  Settings,
  LogOut,
  User,
} from "lucide-react";

// Import your Auth Context
import { useAuth } from "../../context/authContext.jsx";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Employee", href: "/admin/employees", icon: Users },
  { name: "Department", href: "/admin/departments", icon: Building2 },
  { name: "Leave", href: "/admin/leaves", icon: CalendarDays },
  { name: "Salary", href: "/admin/salary", icon: DollarSign },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth(); // Get user and logout function from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears token from localStorage/context
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
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
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
                    className={`w-5 h-5 ${
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
        {/* Current Admin Info */}
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

        {/* Logout Button */}
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
