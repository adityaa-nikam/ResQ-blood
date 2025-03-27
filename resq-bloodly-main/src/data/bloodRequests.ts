
import { BloodRequest, BloodType, UrgencyLevel } from "../types/blood";

// Mock blood requests data for development
export const MOCK_BLOOD_REQUESTS: BloodRequest[] = [
  {
    id: "req-001",
    patientName: "Sarah Johnson",
    bloodType: "A+",
    units: 2,
    hospitalName: "Memorial Hospital",
    location: {
      address: "123 Medical Ave, New York, NY",
      coordinates: [-73.9654, 40.7829]
    },
    urgency: "critical",
    requesterUserId: "user-2",
    requesterContact: "555-123-4567",
    requesterRelation: "daughter",
    reason: "Emergency surgery",
    status: "pending",
    createdAt: new Date(2023, 7, 12, 9, 30),
    updatedAt: new Date(2023, 7, 12, 9, 30)
  },
  {
    id: "req-002",
    patientName: "Michael Davis",
    bloodType: "O-",
    units: 3,
    hospitalName: "City General Hospital",
    location: {
      address: "456 Healthcare Blvd, Boston, MA",
      coordinates: [-71.0589, 42.3601]
    },
    urgency: "high",
    requesterUserId: "user-3",
    requesterContact: "555-987-6543",
    requesterRelation: "hospital",
    reason: "Accident victim",
    status: "matched",
    createdAt: new Date(2023, 7, 11, 14, 15),
    updatedAt: new Date(2023, 7, 11, 16, 45),
    matchedDonors: ["user-1"]
  },
  {
    id: "req-003",
    patientName: "Emma Wilson",
    bloodType: "B+",
    units: 1,
    hospitalName: "Riverside Medical Center",
    location: {
      address: "789 River Rd, Chicago, IL",
      coordinates: [-87.6298, 41.8781]
    },
    urgency: "normal",
    requesterUserId: "user-2",
    requesterContact: "555-555-5555",
    requesterRelation: "friend",
    reason: "Scheduled surgery",
    status: "fulfilled",
    createdAt: new Date(2023, 7, 10, 11, 0),
    updatedAt: new Date(2023, 7, 11, 10, 30)
  },
  {
    id: "req-004",
    patientName: "Robert Brown",
    bloodType: "AB+",
    units: 2,
    hospitalName: "Community Health Center",
    location: {
      address: "101 Main St, San Francisco, CA",
      coordinates: [-122.4194, 37.7749]
    },
    urgency: "routine",
    requesterUserId: "user-3",
    requesterContact: "555-111-2222",
    requesterRelation: "hospital",
    reason: "Anemia treatment",
    status: "pending",
    createdAt: new Date(2023, 7, 9, 15, 20),
    updatedAt: new Date(2023, 7, 9, 15, 20)
  },
  {
    id: "req-005",
    patientName: "Lisa Martinez",
    bloodType: "A-",
    units: 1,
    hospitalName: "Mercy Hospital",
    location: {
      address: "202 Health St, Los Angeles, CA",
      coordinates: [-118.2437, 34.0522]
    },
    urgency: "critical",
    requesterUserId: "user-2",
    requesterContact: "555-333-4444",
    requesterRelation: "sister",
    reason: "Complications during childbirth",
    status: "pending",
    createdAt: new Date(2023, 7, 12, 6, 15),
    updatedAt: new Date(2023, 7, 12, 6, 15)
  }
];

// Get blood requests with filtering options
export const getBloodRequests = ({
  bloodType,
  status,
  urgency,
  limit = 10
}: {
  bloodType?: BloodType;
  status?: BloodRequest['status'];
  urgency?: UrgencyLevel;
  limit?: number;
} = {}): BloodRequest[] => {
  let filteredRequests = [...MOCK_BLOOD_REQUESTS];
  
  if (bloodType) {
    filteredRequests = filteredRequests.filter(req => req.bloodType === bloodType);
  }
  
  if (status) {
    filteredRequests = filteredRequests.filter(req => req.status === status);
  }
  
  if (urgency) {
    filteredRequests = filteredRequests.filter(req => req.urgency === urgency);
  }
  
  // Sort by urgency (critical first) and then by date (newest first)
  filteredRequests.sort((a, b) => {
    const urgencyOrder = { critical: 0, high: 1, normal: 2, routine: 3 };
    const urgencyCompare = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    
    if (urgencyCompare !== 0) {
      return urgencyCompare;
    }
    
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  
  return filteredRequests.slice(0, limit);
};

// Get a specific blood request by ID
export const getBloodRequestById = (id: string): BloodRequest | undefined => {
  return MOCK_BLOOD_REQUESTS.find(req => req.id === id);
};

// Create a new blood request (in a real app, this would call an API)
export const createBloodRequest = async (requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<BloodRequest> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newRequest: BloodRequest = {
    ...requestData,
    id: `req-${Date.now()}`,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // In a real app, this would save to a database
  MOCK_BLOOD_REQUESTS.push(newRequest);
  
  return newRequest;
};

// Update a blood request status
export const updateBloodRequestStatus = async (
  id: string,
  status: BloodRequest['status'],
  matchedDonorId?: string
): Promise<BloodRequest> => {
  const request = getBloodRequestById(id);
  
  if (!request) {
    throw new Error(`Blood request with ID ${id} not found`);
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  request.status = status;
  request.updatedAt = new Date();
  
  if (matchedDonorId && status === 'matched') {
    request.matchedDonors = [...(request.matchedDonors || []), matchedDonorId];
  }
  
  return request;
};
