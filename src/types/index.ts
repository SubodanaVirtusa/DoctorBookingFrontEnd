export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  availableSlots: Date[];
};

export type Appointment = {
  id: string;
  doctorId: string;
  patientName: string;
  dateTime: Date;
  status: string;
};
