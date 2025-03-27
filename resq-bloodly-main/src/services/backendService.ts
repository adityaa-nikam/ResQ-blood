
import { initializeAuthService } from './authService';
import { initializeBloodRequestService } from './bloodRequestService';
import { toast } from '../components/ui/use-toast';

// Initialize all backend services with demo data
export const initializeDemoData = () => {
  // Initialize auth service (users)
  initializeAuthService();
  
  // Initialize blood request service
  initializeBloodRequestService();
  
  // Initialize any other services here
  
  console.log('Demo data initialized successfully');
};

// Simulate an API call (for demo purposes)
export const simulateApiCall = async <T>(
  data: T, 
  delay = 1000, 
  shouldSucceed = true
): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  
  if (!shouldSucceed) {
    throw new Error('API call failed');
  }
  
  return data;
};

// Handle API errors consistently
export const handleApiError = (error: any) => {
  const errorMessage = error.message || 'An unexpected error occurred';
  
  toast({
    title: 'Error',
    description: errorMessage,
    variant: 'destructive',
  });
  
  console.error('API Error:', error);
  
  return null;
};

// Initialize the application when it starts
export const initializeApp = () => {
  try {
    initializeDemoData();
    return true;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    return false;
  }
};
