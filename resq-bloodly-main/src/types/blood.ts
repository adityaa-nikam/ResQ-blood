
// Blood-related types for our application

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'critical' | 'high' | 'normal' | 'routine';

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: BloodType;
  units: number;
  hospitalName?: string;
  location: {
    address: string;
    coordinates?: [number, number]; // [longitude, latitude]
  };
  urgency: UrgencyLevel;
  requesterUserId: string;
  requesterContact: string;
  requesterRelation?: string;
  reason?: string;
  status: 'pending' | 'matched' | 'fulfilled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  matchedDonors?: string[]; // Array of donor IDs
}

export interface BloodDonation {
  id: string;
  donorId: string;
  requestId?: string; // Optional if donation is not linked to a specific request
  bloodType: BloodType;
  units: number;
  donationDate: Date;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface BloodCompatibility {
  canDonateTo: BloodType[];
  canReceiveFrom: BloodType[];
}

// Blood compatibility chart
export const BLOOD_COMPATIBILITY: Record<BloodType, BloodCompatibility> = {
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-']
  },
  'A-': {
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-']
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-']
  },
  'B-': {
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-']
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  'AB-': {
    canDonateTo: ['AB+', 'AB-'],
    canReceiveFrom: ['A-', 'B-', 'AB-', 'O-']
  },
  'O+': {
    canDonateTo: ['A+', 'B+', 'AB+', 'O+'],
    canReceiveFrom: ['O+', 'O-']
  },
  'O-': {
    canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    canReceiveFrom: ['O-']
  }
};
