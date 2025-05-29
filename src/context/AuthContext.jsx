import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on page load
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          // Set axios default headers
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Parse the stored user data
          const userData = JSON.parse(storedUser);
          setUser(userData);

          // Optionally validate token with your backend
          // const response = await axios.get('/api/auth/validate');
          // if (response.data.valid) {
          //   setUser(userData);
          // } else {
          //   // Token invalid, clear storage
          //   logout();
          // }
        } catch (error) {
          console.error("Error loading user:", error);
          logout();
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, setLoading, setUser, login, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
