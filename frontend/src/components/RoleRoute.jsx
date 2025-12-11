import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { userContext } from '../context/authContext.jsx';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(userContext);

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if(!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}

export default RoleRoute;