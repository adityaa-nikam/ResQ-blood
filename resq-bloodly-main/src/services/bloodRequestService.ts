
import { toast } from '../components/ui/use-toast';
import { User, getCurrentUser } from './authService';

// Blood request interface
export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  patientName: string;
  bloodType: string;
  units: number;
  hospital: string;
  location: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  status: 'pending' | 'matched' | 'fulfilled' | 'cancelled';
  createdAt: string;
  requiredBy: string;
  matchedDonors?: string[];
  notes?: string;
}

// Local storage key
const BLOOD_REQUESTS_KEY = 'resq_blood_requests';

// Sample blood requests for demo
const MOCK_BLOOD_REQUESTS: BloodRequest[] = [
  {
    id: 'req_1',
    requesterId: '2',
    requesterName: 'Sarah Patient',
    patientName: 'Michael Johnson',
    bloodType: 'O+',
    units: 2,
    hospital: 'General Hospital',
    location: 'Boston, MA',
    urgency: 'high',
    reason: 'Surgery',
    status: 'matched',
    createdAt: '2023-05-15T09:30:00Z',
    requiredBy: '2023-05-16T09:30:00Z',
    matchedDonors: ['1'],
    notes: 'Patient scheduled for emergency surgery'
  },
  {
    id: 'req_2',
    requesterId: '2',
    requesterName: 'Sarah Patient',
    patientName: 'Emily Wilson',
    bloodType: 'AB-',
    units: 1,
    hospital: 'City Medical Center',
    location: 'Boston, MA',
    urgency: 'medium',
    reason: 'Anemia Treatment',
    status: 'pending',
    createdAt: '2023-05-20T14:20:00Z',
    requiredBy: '2023-05-25T14:20:00Z',
    notes: 'Regular treatment for chronic anemia'
  },
  {
    id: 'req_3',
    requesterId: '2',
    requesterName: 'Sarah Patient',
    patientName: 'Robert Brown',
    bloodType: 'B+',
    units: 3,
    hospital: 'Memorial Hospital',
    location: 'Boston, MA',
    urgency: 'critical',
    reason: 'Accident',
    status: 'fulfilled',
    createdAt: '2023-05-10T08:15:00Z',
    requiredBy: '2023-05-10T12:00:00Z',
    matchedDonors: ['donor_12345', 'donor_67890'],
    notes: 'Traffic accident victim'
  },
  {
    id: 'req_4',
    requesterId: '5',
    requesterName: 'David Miller',
    patientName: 'Jennifer Adams',
    bloodType: 'A-',
    units: 2,
    hospital: 'Children\'s Medical Center',
    location: 'New York, NY',
    urgency: 'high',
    reason: 'Childbirth Complications',
    status: 'pending',
    createdAt: '2023-05-22T11:45:00Z',
    requiredBy: '2023-05-23T11:45:00Z',
    notes: 'Complications during delivery'
  }
];

// Initialize blood requests in local storage
const initializeBloodRequests = () => {
  if (!localStorage.getItem(BLOOD_REQUESTS_KEY)) {
    localStorage.setItem(BLOOD_REQUESTS_KEY, JSON.stringify(MOCK_BLOOD_REQUESTS));
  }
};

// Get blood requests from local storage
const getBloodRequests = (): BloodRequest[] => {
  initializeBloodRequests();
  const requests = localStorage.getItem(BLOOD_REQUESTS_KEY);
  return requests ? JSON.parse(requests) : [];
};

// Save blood requests to local storage
const saveBloodRequests = (requests: BloodRequest[]) => {
  localStorage.setItem(BLOOD_REQUESTS_KEY, JSON.stringify(requests));
};

// Create a new blood request
export const createBloodRequest = async (requestData: Omit<BloodRequest, 'id' | 'status' | 'createdAt' | 'requesterId' | 'requesterName'>): Promise<BloodRequest> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to create a blood request');
  }
  
  const requests = getBloodRequests();
  
  // Create new request
  const newRequest: BloodRequest = {
    id: `req_${Date.now()}`,
    requesterId: currentUser.id,
    requesterName: currentUser.name,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...requestData
  };
  
  // Save to storage
  const updatedRequests = [newRequest, ...requests];
  saveBloodRequests(updatedRequests);
  
  toast({
    title: 'Blood Request Created',
    description: `Your request for ${requestData.bloodType} blood has been submitted successfully.`,
    variant: 'default',
  });
  
  // Simulate finding potential donors
  setTimeout(() => {
    const isCritical = requestData.urgency === 'critical';
    const chance = Math.random();
    
    if (isCritical || chance > 0.3) {
      toast({
        title: 'Donor Match Found!',
        description: `We've found potential donors for your ${requestData.bloodType} blood request.`,
        variant: 'default',
      });
    }
  }, 3000);
  
  return newRequest;
};

// Get all blood requests
export const getAllBloodRequests = async (): Promise<BloodRequest[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return getBloodRequests();
};

// Get blood requests for current user
export const getUserBloodRequests = async (): Promise<BloodRequest[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to view your blood requests');
  }
  
  const requests = getBloodRequests();
  return requests.filter(request => request.requesterId === currentUser.id);
};

// Get blood requests matching user's blood type
export const getMatchingBloodRequests = async (user: User): Promise<BloodRequest[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!user.bloodType) {
    return [];
  }
  
  const requests = getBloodRequests();
  return requests.filter(request => 
    request.status === 'pending' && 
    request.bloodType === user.bloodType
  );
};

// Update a blood request
export const updateBloodRequest = async (requestId: string, updates: Partial<BloodRequest>): Promise<BloodRequest> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const requests = getBloodRequests();
  const requestIndex = requests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1) {
    throw new Error('Blood request not found');
  }
  
  // Update request
  const updatedRequest = { ...requests[requestIndex], ...updates };
  requests[requestIndex] = updatedRequest;
  
  // Save to storage
  saveBloodRequests(requests);
  
  toast({
    title: 'Request Updated',
    description: `Blood request has been updated successfully.`,
    variant: 'default',
  });
  
  return updatedRequest;
};

// Match a donor to a blood request
export const matchDonorToRequest = async (requestId: string, donorId: string): Promise<BloodRequest> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const requests = getBloodRequests();
  const requestIndex = requests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1) {
    throw new Error('Blood request not found');
  }
  
  // Update request
  const request = requests[requestIndex];
  const matchedDonors = request.matchedDonors || [];
  
  if (matchedDonors.includes(donorId)) {
    throw new Error('Donor already matched to this request');
  }
  
  const updatedRequest = {
    ...request,
    status: 'matched',
    matchedDonors: [...matchedDonors, donorId]
  };
  
  requests[requestIndex] = updatedRequest;
  
  // Save to storage
  saveBloodRequests(requests);
  
  toast({
    title: 'Donor Matched!',
    description: `A donor has been matched to the blood request.`,
    variant: 'default',
  });
  
  return updatedRequest;
};

// Get blood request by ID
export const getBloodRequestById = async (requestId: string): Promise<BloodRequest | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const requests = getBloodRequests();
  return requests.find(req => req.id === requestId) || null;
};

// Cancel a blood request
export const cancelBloodRequest = async (requestId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const requests = getBloodRequests();
  const requestIndex = requests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1) {
    throw new Error('Blood request not found');
  }
  
  // Update request status
  requests[requestIndex].status = 'cancelled';
  
  // Save to storage
  saveBloodRequests(requests);
  
  toast({
    title: 'Request Cancelled',
    description: `Blood request has been cancelled.`,
    variant: 'default',
  });
};

// Initialize the blood request service
export const initializeBloodRequestService = () => {
  initializeBloodRequests();
};
