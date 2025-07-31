// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";
import setAuthToken from "../services/api";

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
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setAuthToken(token);
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      const response = await loginUser(userData);
      const { token, user } = response;

      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      const { token, user } = response;

      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setAuthToken(token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
