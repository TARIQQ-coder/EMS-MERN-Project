import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";

export const userContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/auth/verify`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuth(true);
      } else {
        setUser(null);
        setIsAuth(false);
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
    setIsAuth(true);
  };

  const logout = async () => {
    // logout logic
    try {
      await axios.post(`${baseUrl}/api/auth/logout`, {
        withCredentials: true, 
      }); // send cookie to server to clear it
      setUser(null); // clear user state on logout
      setIsAuth(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
    
  };

  return (
    <userContext.Provider value={{ user, login, logout, loading, isAuth }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);



