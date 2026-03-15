import AsyncStorage from '@react-native-async-storage/async-storage';

const APPLICATIONS_KEY = 'kmrm_applications';
const COMPLAINTS_KEY = 'kmrm_complaints';

export interface ServiceApplication {
  id: string;
  serviceId: string;
  service: string;
  applicant: string;
  phone: string;
  ward: string;
  date: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  statusLabel: string;
  notes?: string;
}

export interface ComplaintRecord {
  id: string;
  category: string;
  title: string;
  description: string;
  ward: string;
  date: string;
  status: 'submitted' | 'processing' | 'resolved' | 'rejected';
  statusLabel: string;
}

export const municipalService = {
  async getApplications(): Promise<ServiceApplication[]> {
    try {
      const data = await AsyncStorage.getItem(APPLICATIONS_KEY);
      const stored: ServiceApplication[] = data ? JSON.parse(data) : [];
      return stored;
    } catch {
      return [];
    }
  },

  async submitApplication(
    serviceId: string,
    serviceName: string,
    applicant: string,
    phone: string,
    ward: string
  ): Promise<ServiceApplication> {
    await new Promise(r => setTimeout(r, 1500));
    const app: ServiceApplication = {
      id: 'APP-' + Date.now(),
      serviceId,
      service: serviceName,
      applicant,
      phone,
      ward,
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
      statusLabel: 'In Process',
    };
    const existing = await municipalService.getApplications();
    await AsyncStorage.setItem(APPLICATIONS_KEY, JSON.stringify([app, ...existing]));
    return app;
  },

  async getComplaints(): Promise<ComplaintRecord[]> {
    try {
      const data = await AsyncStorage.getItem(COMPLAINTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async submitComplaint(
    category: string,
    title: string,
    description: string,
    ward: string
  ): Promise<ComplaintRecord> {
    await new Promise(r => setTimeout(r, 1200));
    const complaint: ComplaintRecord = {
      id: 'CMP-' + Date.now(),
      category,
      title,
      description,
      ward,
      date: new Date().toISOString().split('T')[0],
      status: 'submitted',
      statusLabel: 'Submitted',
    };
    const existing = await municipalService.getComplaints();
    await AsyncStorage.setItem(COMPLAINTS_KEY, JSON.stringify([complaint, ...existing]));
    return complaint;
  },
};
