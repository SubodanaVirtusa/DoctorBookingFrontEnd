import { apiGet, apiPost } from './client';

export type DoctorApi = {
  id: string;
  name: string;
  specialty: string;
  availableSlots: string[];
};

export type CreateDoctorRequest = {
  name: string;
  specialty: string;
  availableSlots: string[];
};

export const fetchDoctors = () => apiGet<DoctorApi[]>('/Doctor');

export const createDoctor = (payload: CreateDoctorRequest) =>
  apiPost<DoctorApi, CreateDoctorRequest>('/Doctor', payload);
