import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }
  if (!user) {
    return <Navigate to="/login" replace/>;
  }
  return children;
};

export default PrivateRoute;