
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

// Define types for our authentication
export type UserRole = 'donor' | 'requester' | 'hospital' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bloodType?: string;
  location?: string;
  phoneNumber?: string;
  lastDonationDate?: Date;
  profileImage?: string;
  verified: boolean;
  donations?: number;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateProfile: async () => {},
});

// Mock data for development
const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "John Donor",
    email: "john@example.com",
    role: "donor",
    bloodType: "O+",
    location: "New York",
    phoneNumber: "123-456-7890",
    lastDonationDate: new Date(2023, 5, 15),
    verified: true,
    donations: 5,
    createdAt: new Date(2022, 1, 10),
  },
  {
    id: "user-2",
    name: "Alice Requester",
    email: "alice@example.com",
    role: "requester",
    location: "Boston",
    phoneNumber: "123-456-7890",
    verified: true,
    createdAt: new Date(2022, 3, 22),
  },
  {
    id: "user-3",
    name: "Memorial Hospital",
    email: "hospital@example.com",
    role: "hospital",
    location: "Chicago",
    phoneNumber: "555-123-4567",
    verified: true,
    createdAt: new Date(2021, 11, 5),
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulating token check on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('resq_user');
        
        if (savedUser) {
          // In a real app, verify the token with the backend
          setUser(JSON.parse(savedUser));
        }
        
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem('resq_user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // In a real app, this would verify the password with the backend
      
      setUser(foundUser);
      localStorage.setItem('resq_user', JSON.stringify(foundUser));
      
      toast({
        title: "Welcome back!",
        description: `You've successfully logged in as ${foundUser.name}`,
      });
      
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email exists
      if (MOCK_USERS.some(u => u.email === userData.email)) {
        throw new Error("Email already exists");
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || "New User",
        email: userData.email || "",
        role: userData.role || "donor",
        verified: false,
        donations: 0,
        createdAt: new Date(),
        ...userData,
      };
      
      // In a real app, this would create the user in the backend
      
      setUser(newUser);
      localStorage.setItem('resq_user', JSON.stringify(newUser));
      
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resq_user');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error("Not authenticated");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('resq_user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
