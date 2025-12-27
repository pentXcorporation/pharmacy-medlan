// Pharmacist Services - Prescription Service
import apiClient from '@/lib/api';

const prescriptionService = {
  // Prescriptions CRUD
  getPrescriptions: async (params = {}) => {
    const response = await apiClient.get('/prescriptions', { params });
    return response.data;
  },

  getPrescriptionById: async (prescriptionId) => {
    const response = await apiClient.get(`/prescriptions/${prescriptionId}`);
    return response.data;
  },

  createPrescription: async (prescriptionData) => {
    const response = await apiClient.post('/prescriptions', prescriptionData);
    return response.data;
  },

  updatePrescription: async (prescriptionId, prescriptionData) => {
    const response = await apiClient.put(`/prescriptions/${prescriptionId}`, prescriptionData);
    return response.data;
  },

  // Status Management
  updatePrescriptionStatus: async (prescriptionId, status, notes = '') => {
    const response = await apiClient.patch(`/prescriptions/${prescriptionId}/status`, { 
      status, 
      notes 
    });
    return response.data;
  },

  // Search & Filter
  searchPrescriptions: async (query) => {
    const response = await apiClient.get('/prescriptions/search', { 
      params: { q: query } 
    });
    return response.data;
  },

  getPendingPrescriptions: async () => {
    const response = await apiClient.get('/prescriptions/pending');
    return response.data;
  },

  getReadyPrescriptions: async () => {
    const response = await apiClient.get('/prescriptions/ready');
    return response.data;
  },

  // Patient & Doctor
  getPatientPrescriptions: async (patientId) => {
    const response = await apiClient.get(`/patients/${patientId}/prescriptions`);
    return response.data;
  },

  getDoctors: async () => {
    const response = await apiClient.get('/doctors');
    return response.data;
  },

  // Drug Interactions
  checkDrugInteractions: async (drugIds) => {
    const response = await apiClient.post('/prescriptions/drug-interactions', { drugIds });
    return response.data;
  },

  // Dispensing
  dispensePrescription: async (prescriptionId, dispensingData) => {
    const response = await apiClient.post(`/prescriptions/${prescriptionId}/dispense`, dispensingData);
    return response.data;
  },

  // Refills
  createRefill: async (prescriptionId) => {
    const response = await apiClient.post(`/prescriptions/${prescriptionId}/refill`);
    return response.data;
  },

  getRefillHistory: async (prescriptionId) => {
    const response = await apiClient.get(`/prescriptions/${prescriptionId}/refills`);
    return response.data;
  },

  // Labels
  generateLabel: async (prescriptionId) => {
    const response = await apiClient.get(`/prescriptions/${prescriptionId}/label`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Verification
  verifyPrescription: async (prescriptionId, pharmacistNotes) => {
    const response = await apiClient.post(`/prescriptions/${prescriptionId}/verify`, { 
      pharmacistNotes 
    });
    return response.data;
  },

  // Controlled Substances
  logControlledSubstanceDispensing: async (data) => {
    const response = await apiClient.post('/prescriptions/controlled-substance-log', data);
    return response.data;
  },
};

export default prescriptionService;
