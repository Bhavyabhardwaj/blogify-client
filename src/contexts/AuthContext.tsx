import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '@/lib/api';
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/me');
      const userData = response.data;
      
      if (!userData) {
        throw new Error("Failed to fetch user data");
      }

      const updatedUserData = {
        id: userData.id || userData.userId || userData._id,
        email: userData.email,
        username: userData.name || userData.username,
        bio: userData.bio || "",
        avatarUrl: userData.avatar || userData.avatarUrl || "",
        name: userData.name || userData.username,
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString()
      };

      // Ensure we have a valid user ID
      if (!updatedUserData.id) {
        console.error("User data received:", userData);
        throw new Error("User ID is missing from response");
      }

      console.log("Updating user data:", updatedUserData);
      setUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;

      if (!token) {
        throw new Error("No token received");
      }

      // Store token
      localStorage.setItem("token", token);
      setToken(token);

      // Fetch user data after successful login
      const userResponse = await api.get("/user/me");
      const userData = userResponse.data;

      if (!userData) {
        throw new Error("Failed to fetch user data");
      }

      // Create a unique ID if not present
      const userId = userData.id || userData.userId || `user_${Date.now()}`;

      // Store user data with proper structure
      const userToStore = {
        id: userId,
        email: userData.email,
        username: userData.name || userData.username,
        bio: userData.bio || "",
        avatarUrl: userData.avatar || userData.avatarUrl || "",
        name: userData.name || userData.username,
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString()
      };

      console.log("Storing user data:", userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);
      setIsAuthenticated(true);

      return userToStore;
    } catch (error: any) {
      console.error("Login failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token } = response.data;

      if (!token) {
        throw new Error("No token received after registration");
      }

      // Store token
      localStorage.setItem('token', token);
      setToken(token);

      // Fetch user data after successful registration
      await fetchUserProfile();

      toast.success("Registration successful");
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (data: { name?: string; bio?: string; avatar?: string }) => {
    try {
      const payload = {
        username: data.name,
        bio: data.bio,
        avatarUrl: data.avatar
      };
      
      const response = await api.put('/user/updateUserProfile', payload);
      const updatedUser = response.data;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};