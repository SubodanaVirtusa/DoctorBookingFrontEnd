import { apiGet, apiPost, apiPut } from './client';

export type AppointmentApi = {
  id: string;
  doctorId: string;
  patientName: string;
  dateTime: string;
  status: string;
};

export type CreateAppointmentRequest = {
  doctorId: string;
  patientName: string;
  dateTime: string;
  status: string;
};

export type UpdateAppointmentRequest = CreateAppointmentRequest;

export const fetchAppointments = () => apiGet<AppointmentApi[]>('/Appointment');

export const createAppointment = (payload: CreateAppointmentRequest) =>
  apiPost<AppointmentApi, CreateAppointmentRequest>('/Appointment', payload);

export const updateAppointment = (id: string, payload: UpdateAppointmentRequest) =>
  apiPut<void, UpdateAppointmentRequest>(`/Appointment/${id}`, payload);
