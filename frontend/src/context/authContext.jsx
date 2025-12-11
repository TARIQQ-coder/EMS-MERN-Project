import { useState, createContext, useEffect } from "react";
import axios from "axios";

export const userContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/auth/verify`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.error("Error verifying user:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

  const login = (userData) => {
    // login logic
    setUser(userData);
  };

  const logout = () => {
    // logout logic
    setUser(null);
  };

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  );
};
