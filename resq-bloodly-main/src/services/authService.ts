
import { toast } from '../components/ui/use-toast';

// Define user types and interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'donor' | 'recipient' | 'admin';
  bloodType?: string;
  location?: string;
  phone?: string;
  lastDonation?: string;
  createdAt: string;
  profileImage?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
  role: 'donor' | 'recipient';
  bloodType?: string;
  location?: string;
  phone?: string;
}

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'donor@example.com',
    name: 'John Donor',
    role: 'donor',
    bloodType: 'O+',
    location: 'New York, NY',
    phone: '(555) 123-4567',
    lastDonation: '2023-06-15',
    createdAt: '2023-01-10',
    profileImage: 'https://randomuser.me/api/portraits/men/42.jpg'
  },
  {
    id: '2',
    email: 'recipient@example.com',
    name: 'Sarah Patient',
    role: 'recipient',
    bloodType: 'AB-',
    location: 'Boston, MA',
    phone: '(555) 987-6543',
    createdAt: '2023-02-20',
    profileImage: 'https://randomuser.me/api/portraits/women/33.jpg'
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2022-12-01',
    profileImage: 'https://randomuser.me/api/portraits/men/24.jpg'
  }
];

// Local storage keys
const AUTH_TOKEN_KEY = 'resq_blood_auth_token';
const CURRENT_USER_KEY = 'resq_blood_current_user';
const USERS_KEY = 'resq_blood_users';

// Initialize users in local storage
const initializeUsers = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
  }
};

// Get users from local storage
const getUsers = (): User[] => {
  initializeUsers();
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to local storage
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Generate a random token (for demo purposes)
const generateToken = (length = 64) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Login user
export const login = async ({ email, password }: LoginCredentials): Promise<{ user: User, token: string }> => {
  initializeUsers();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find user by email (in real app would check password hash)
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Generate and store token
  const token = generateToken();
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  
  toast({
    title: 'Login Successful',
    description: `Welcome back, ${user.name}!`,
    variant: 'default',
  });
  
  return { user, token };
};

// Register new user
export const register = async (credentials: RegisterCredentials): Promise<{ user: User, token: string }> => {
  initializeUsers();
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === credentials.email.toLowerCase())) {
    throw new Error('Email already in use');
  }
  
  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}`,
    email: credentials.email,
    name: credentials.name,
    role: credentials.role,
    bloodType: credentials.bloodType,
    location: credentials.location,
    phone: credentials.phone,
    createdAt: new Date().toISOString(),
    profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`
  };
  
  // Save new user
  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  
  // Generate and store token
  const token = generateToken();
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  
  toast({
    title: 'Registration Successful',
    description: `Welcome to Res-Q Blood, ${newUser.name}!`,
    variant: 'default',
  });
  
  return { user: newUser, token };
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  
  toast({
    title: 'Logged Out',
    description: 'You have been logged out successfully.',
    variant: 'default',
  });
};

// Check if user is logged in
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(CURRENT_USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Update user profile
export const updateProfile = async (userId: string, updatedData: Partial<User>): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user data
  const updatedUser = { ...users[userIndex], ...updatedData };
  users[userIndex] = updatedUser;
  
  // Save updated users
  saveUsers(users);
  
  // Update current user if it's the logged-in user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  }
  
  toast({
    title: 'Profile Updated',
    description: 'Your profile has been updated successfully.',
    variant: 'default',
  });
  
  return updatedUser;
};

// Get all users (for admin purposes)
export const getAllUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return getUsers();
};

// Get donors by blood type
export const getDonorsByBloodType = async (bloodType: string): Promise<User[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const users = getUsers();
  return users.filter(user => 
    user.role === 'donor' && 
    user.bloodType && 
    user.bloodType === bloodType
  );
};

// Initialize the auth service
export const initializeAuthService = () => {
  initializeUsers();
};
