import React, { useContext } from 'react';
import { userContext } from '../context/authContext';
import { Navigate } from 'react-router-dom';

function AdminDashboard() {
  const { user, loading } = useContext(userContext);

  //  Still loading user data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //  Logged in but not admin
  if (user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Logged in as admin
  return (
    <main>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      {/* Add admin-specific content here */}
    </main>
  );
}

export default AdminDashboard;
