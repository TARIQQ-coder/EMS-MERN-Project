// components/AdminTopbar.jsx
import { Search, Bell, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="h-full px-8 flex items-center justify-between">

        {/* Left: Greeting */}
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Hello{" "}
            <span className="text-purple-700">
              {user?.name?.split(" ")[0] || "Admin"}
            </span>
            <span className="ml-2">Welcome back. Have a Good day.</span>
          </h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-80 pl-12 pr-6 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Notification Bell */}
          <button className="relative p-3 rounded-xl hover:bg-gray-100 transition">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* User Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <span className="font-medium text-gray-700">
                {user?.name || "Administrator"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-2">
                <a href="/admin/profile" className="block px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition">
                  My Profile
                </a>
                <a href="/admin/settings" className="block px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition">
                  Settings
                </a>
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}