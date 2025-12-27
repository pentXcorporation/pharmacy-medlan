// Prescription Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prescriptionService } from '../services';

// Query Keys
export const PRESCRIPTION_QUERY_KEYS = {
  prescriptions: 'prescriptions',
  prescription: 'prescription',
  pending: 'prescriptions-pending',
  ready: 'prescriptions-ready',
  doctors: 'doctors',
  drugInteractions: 'drug-interactions',
};

// Prescriptions List Hook
export const usePrescriptions = (params = {}) => {
  return useQuery({
    queryKey: [PRESCRIPTION_QUERY_KEYS.prescriptions, params],
    queryFn: () => prescriptionService.getPrescriptions(params),
  });
};

// Single Prescription Hook
export const usePrescription = (prescriptionId) => {
  return useQuery({
    queryKey: [PRESCRIPTION_QUERY_KEYS.prescription, prescriptionId],
    queryFn: () => prescriptionService.getPrescriptionById(prescriptionId),
    enabled: !!prescriptionId,
  });
};

// Pending Prescriptions Hook
export const usePendingPrescriptions = () => {
  return useQuery({
    queryKey: [PRESCRIPTION_QUERY_KEYS.pending],
    queryFn: prescriptionService.getPendingPrescriptions,
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });
};

// Ready Prescriptions Hook
export const useReadyPrescriptions = () => {
  return useQuery({
    queryKey: [PRESCRIPTION_QUERY_KEYS.ready],
    queryFn: prescriptionService.getReadyPrescriptions,
    refetchInterval: 30 * 1000,
  });
};

// Create Prescription Hook
export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: prescriptionService.createPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.prescriptions] });
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.pending] });
    },
  });
};

// Update Prescription Hook
export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ prescriptionId, data }) => 
      prescriptionService.updatePrescription(prescriptionId, data),
    onSuccess: (_, { prescriptionId }) => {
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.prescription, prescriptionId] });
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.prescriptions] });
    },
  });
};

// Update Prescription Status Hook
export const useUpdatePrescriptionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ prescriptionId, status, notes }) =>
      prescriptionService.updatePrescriptionStatus(prescriptionId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.prescriptions] });
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.pending] });
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.ready] });
    },
  });
};

// Search Prescriptions Hook
export const useSearchPrescriptions = (query) => {
  return useQuery({
    queryKey: [PRESCRIPTION_QUERY_KEYS.prescriptions, 'search', query],
    queryFn: () => prescriptionService.searchPrescriptions(query),
    enabled: query?.length >= 2,
  });
};

// Doctors List Hook
export const useDoctors = () => {
  return useQuery({
    queryKey: [PRESCRIPTION_QUERY_KEYS.doctors],
    queryFn: prescriptionService.getDoctors,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Drug Interactions Check Hook
export const useCheckDrugInteractions = () => {
  return useMutation({
    mutationFn: prescriptionService.checkDrugInteractions,
  });
};

// Dispense Prescription Hook
export const useDispensePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ prescriptionId, dispensingData }) =>
      prescriptionService.dispensePrescription(prescriptionId, dispensingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.prescriptions] });
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.ready] });
    },
  });
};

// Create Refill Hook
export const useCreateRefill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: prescriptionService.createRefill,
    onSuccess: (_, prescriptionId) => {
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.prescription, prescriptionId] });
    },
  });
};

// Refill History Hook
export const useRefillHistory = (prescriptionId) => {
  return useQuery({
    queryKey: [PRESCRIPTION_QUERY_KEYS.prescription, prescriptionId, 'refills'],
    queryFn: () => prescriptionService.getRefillHistory(prescriptionId),
    enabled: !!prescriptionId,
  });
};

// Generate Label Hook
export const useGenerateLabel = () => {
  return useMutation({
    mutationFn: prescriptionService.generateLabel,
  });
};

// Verify Prescription Hook
export const useVerifyPrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ prescriptionId, pharmacistNotes }) =>
      prescriptionService.verifyPrescription(prescriptionId, pharmacistNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.prescriptions] });
      queryClient.invalidateQueries({ queryKey: [PRESCRIPTION_QUERY_KEYS.pending] });
    },
  });
};

// Patient Prescriptions Hook
export const usePatientPrescriptions = (patientId) => {
  return useQuery({
    queryKey: [PRESCRIPTION_QUERY_KEYS.prescriptions, 'patient', patientId],
    queryFn: () => prescriptionService.getPatientPrescriptions(patientId),
    enabled: !!patientId,
  });
};
