// src/layout/AdminLayout.jsx
import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar, AdminTopbar } from "@/components/admin"; // clean import!
import { useAuth } from "@/context/AuthContext.jsx";

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminTopbar />
        <main className="pt-20 px-8 py-6 min-h-screen">
          <Outlet />   {/* All your admin pages render here */}
        </main>
      </div>
    </div>
  );
}