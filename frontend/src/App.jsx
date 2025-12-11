import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";

// This manages all the query and mutations in the app
const queryClient = new QueryClient();

function App() {
  return (
    // the QueryClientProvider gives the child components access to use tanStack query
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin-dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/employee-dashboard"
            element={
              <PrivateRoute>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
