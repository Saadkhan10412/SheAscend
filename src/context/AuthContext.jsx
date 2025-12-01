import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logoutCurrentSession } from "../services/appwriteAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      // Load profile from localStorage for now (can be moved to Appwrite DB later)
      const savedProfile = localStorage.getItem(`profile_${currentUser?.$id}`);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    const savedProfile = localStorage.getItem(`profile_${userData?.$id}`);
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  };

  const logout = async () => {
    try {
      await logoutCurrentSession();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    setUserProfile(null);
  };

  const saveProfile = (profile) => {
    setUserProfile(profile);
    if (user?.$id) {
      localStorage.setItem(`profile_${user.$id}`, JSON.stringify(profile));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        login,
        logout,
        saveProfile,
        checkSession,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
