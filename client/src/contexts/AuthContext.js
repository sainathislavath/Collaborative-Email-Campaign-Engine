import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";
import setAuthToken from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      const response = await loginUser(userData);
      const { token, user } = response;
      localStorage.setItem("token", token);
      setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response.data.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      const { token, user } = response;
      localStorage.setItem("token", token);
      setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response.data.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(false);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
