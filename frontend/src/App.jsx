import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import AdminLayout from "./layout/AdminLayout.jsx";

// Pages
import LoginPage from "./pages/LoginPage.jsx";

// Admin Pages
import DashboardPage from "./pages/admin/DashboardPage.jsx";
import EmployeesPage from "./pages/admin/EmployeesPage.jsx";
import DepartmentsPage from "./pages/admin/DepartmentsPage.jsx";
import LeavesPage from "./pages/admin/LeavesPage.jsx";
import SalaryPage from "./pages/admin/SalaryPage.jsx";
import SettingsPage from "./pages/admin/SettingsPage.jsx";

// Employee Pages
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";

// Route Guards
import PrivateRoute from "./components/PrivateRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ADMIN SECTION – All pages get Sidebar + Topbar automatically */}
          <Route
            path="/admin-dashboard"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </RoleRoute>
            }
          >
            <Route index element={<DashboardPage />} />                    {/* /admin-dashboard */}
            <Route path="employees" element={<EmployeesPage />} />          {/* /admin-dashboard/employees */}
            <Route path="departments" element={<DepartmentsPage />} />     {/* /admin-dashboard/departments */}
            <Route path="leaves" element={<LeavesPage />} />               {/* /admin-dashboard/leaves */}
            <Route path="salary" element={<SalaryPage />} />                 {/* /admin-dashboard/salary */}
            <Route path="settings" element={<SettingsPage />} />           {/* /admin-dashboard/settings */}
          </Route>

          {/* EMPLOYEE SECTION */}
          <Route
            path="/employee-dashboard"
            element={
              <PrivateRoute>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />

          {/* Fallback Routes */}
          <Route path="/unauthorized" element={<h1 className="text-center text-4xl mt-20">Unauthorized Access</h1>} />
          <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;