// src/App.jsx
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
import EmployeeDetailPage from "./pages/admin/EmployeeDetailPage.jsx";
import DepartmentEmployeesPage from "./pages/admin/DepartmentEmployeesPage.jsx"; // ← Imported
import LeavesPage from "./pages/admin/LeavesPage.jsx";
import AttendanceDashboard from "./pages/admin/AttendanceDashboard.jsx";
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
            <Route path="employees" element={<EmployeesPage />} />        {/* /admin-dashboard/employees */}
            <Route path="employees/:id" element={<EmployeeDetailPage />} />{/* ← New nested route for employee detail */}
            <Route path="departments" element={<DepartmentsPage />} />     {/* /admin-dashboard/departments */}
            {/* ← New nested route for department detail */}
            <Route path="departments/:id" element={<DepartmentEmployeesPage />} />
            <Route path="leaves" element={<LeavesPage />} />               {/* /admin-dashboard/leaves */}              {/* /admin-dashboard/salary */}
            <Route path="attendance" element={<AttendanceDashboard />} />   {/* /admin-dashboard/attendance */}
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