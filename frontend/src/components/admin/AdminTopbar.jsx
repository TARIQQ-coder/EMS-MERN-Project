// components/AdminTopbar.jsx
import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, User, Settings, LogOut, HelpCircle, Menu, X } from "lucide-react";
import { useAuth } from "../../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  // Search pages configuration
  const searchPages = [
    { name: "Dashboard", path: "/admin-dashboard", icon: "🏠", keywords: ["home", "overview", "main"] },
    { name: "Employees", path: "/admin-dashboard/employees", icon: "👥", keywords: ["staff", "people", "team"] },
    { name: "Departments", path: "/admin-dashboard/departments", icon: "🏢", keywords: ["dept", "division", "unit"] },
    { name: "Leave Management", path: "/admin-dashboard/leaves", icon: "📅", keywords: ["leave", "vacation", "absence"] },
    { name: "Attendance", path: "/admin-dashboard/attendance", icon: "✅", keywords: ["clock", "time", "check in"] },
    { name: "Payroll", path: "/admin-dashboard/payroll", icon: "💰", keywords: ["salary", "payment", "wage"] },
    { name: "Reports", path: "/admin-dashboard/reports", icon: "📊", keywords: ["analytics", "stats", "data"] },
    { name: "User Management", path: "/admin-dashboard/users", icon: "👤", keywords: ["users", "accounts", "admin", "roles"] },
    { name: "Settings", path: "/admin-dashboard/settings", icon: "⚙️", keywords: ["config", "preferences"] },
  ];

  const filteredPages = searchQuery
    ? searchPages.filter(
        (page) =>
          page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Mock notifications - replace with real data
  const notifications = [
    {
      id: 1,
      type: "leave",
      title: "New Leave Request",
      message: "John Smith submitted a leave request",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      type: "employee",
      title: "New Employee Added",
      message: "Sarah Johnson joined Marketing Department",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "payroll",
      title: "Payroll Reminder",
      message: "Monthly payroll processing due in 2 days",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type) => {
    const icons = {
      leave: "📅",
      employee: "👤",
      payroll: "💰",
    };
    return icons[type] || "📢";
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left: Greeting */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {getCurrentGreeting()},{" "}
              <span className="text-purple-700">
                {user?.name?.split(" ")[0] || "Admin"}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search pages, employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              className="w-96 pl-12 pr-6 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}

            {showSearchResults && searchQuery && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-[60]">
                {filteredPages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No pages found</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredPages.map((page) => (
                      <button
                        key={page.path}
                        onClick={() => handleSearchSelect(page.path)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-purple-50 transition text-left"
                      >
                        <span className="text-2xl">{page.icon}</span>
                        <div>
                          <p className="font-medium text-gray-800">{page.name}</p>
                          <p className="text-xs text-gray-500">{page.path}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            title="Help & Support"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-200 max-h-[500px] overflow-hidden z-[60]">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-purple-600 font-medium">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                          notification.unread ? "bg-purple-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-gray-800 text-sm">
                                {notification.title}
                              </p>
                              {notification.unread && (
                                <span className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-1.5"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-200 text-center">
                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="text-left hidden xl:block">
                <p className="font-medium text-gray-800 text-sm">
                  {user?.name || "Administrator"}
                </p>
                <p className="text-xs text-gray-500">{user?.role || "Admin"}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-[60]">
                {/* User Info Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {user?.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {user?.name || "Administrator"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email || "admin@company.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/admin-dashboard/profile");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/admin-dashboard/settings");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Help & Support
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu || showSearchResults) && (
        <div
          className="fixed inset-0 z-[55] bg-transparent"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
            setShowSearchResults(false);
          }}
        />
      )}
    </header>
  );
}