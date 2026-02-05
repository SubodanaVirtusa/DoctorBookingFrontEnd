import React, { useEffect, useMemo, useState } from 'react';
import Section from '../components/layout/Section';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Appointment, Doctor } from '../types';
import { formatDateTime } from '../utils/format';
import { fetchDoctors } from '../api/doctors';
import { createAppointment, fetchAppointments, updateAppointment } from '../api/appointments';

const statusOptions = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'];
const PAGE_SIZE = 5;

const toDateTimeLocalValue = (value: Date) => {
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
};

const Appointments = () => {
  const [patientName, setPatientName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [status, setStatus] = useState('Scheduled');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPatientName, setEditPatientName] = useState('');
  const [editDoctorId, setEditDoctorId] = useState('');
  const [editDateTime, setEditDateTime] = useState('');
  const [editStatus, setEditStatus] = useState(statusOptions[0]);
  const [savingEdit, setSavingEdit] = useState(false);

  const doctorOptions = useMemo(() => doctors.map((doctor) => doctor.name), [doctors]);
  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);
  const selectedEditDoctor = doctors.find((doctor) => doctor.id === editDoctorId);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedItems = items.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [doctorResponse, appointmentResponse] = await Promise.all([
          fetchDoctors(),
          fetchAppointments(),
        ]);
        if (!isMounted) return;

        const mappedDoctors = doctorResponse.map((doctor) => ({
          id: String(doctor.id),
          name: doctor.name,
          specialty: doctor.specialty,
          availableSlots: (doctor.availableSlots ?? []).map((slot) => new Date(slot)),
        }));

        const mappedAppointments = appointmentResponse.map((appointment) => ({
          id: String(appointment.id),
          doctorId: String(appointment.doctorId),
          patientName: appointment.patientName,
          dateTime: new Date(appointment.dateTime),
          status: appointment.status,
        }));

        setDoctors(mappedDoctors);
        setItems(mappedAppointments);
        setError('');
      } catch (err) {
        if (isMounted) {
          setDoctors([]);
          setItems([]);
          setError('Unable to load appointments from the API.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreate = async () => {
    const trimmedName = patientName.trim();
    const trimmedDateTime = dateTime.trim();
    const parsedDate = new Date(trimmedDateTime);

    if (!doctorId || trimmedName === '' || trimmedDateTime === '' || Number.isNaN(parsedDate.getTime())) {
      setError('Please complete all fields before confirming.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const created = await createAppointment({
        doctorId,
        patientName: trimmedName,
        dateTime: parsedDate.toISOString(),
        status,
      });

      const newAppointment: Appointment = {
        id: String(created.id),
        doctorId: String(created.doctorId),
        patientName: created.patientName,
        dateTime: new Date(created.dateTime),
        status: created.status,
      };

      setItems((prev) => [newAppointment, ...prev]);
      setPage(1);
      setPatientName('');
      setDoctorId('');
      setDateTime('');
      setStatus('Scheduled');
    } catch (err) {
      setError('Unable to create appointment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (appointment: Appointment) => {
    setEditingId(appointment.id);
    setEditPatientName(appointment.patientName);
    setEditDoctorId(appointment.doctorId);
    setEditDateTime(toDateTimeLocalValue(appointment.dateTime));
    setEditStatus(appointment.status);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPatientName('');
    setEditDoctorId('');
    setEditDateTime('');
    setEditStatus(statusOptions[0]);
  };

  const handleUpdate = async (id: string) => {
    const trimmedName = editPatientName.trim();
    const trimmedDateTime = editDateTime.trim();
    const parsedDate = new Date(trimmedDateTime);

    if (!editDoctorId || trimmedName === '' || trimmedDateTime === '' || Number.isNaN(parsedDate.getTime())) {
      setError('Please complete all fields before confirming.');
      return;
    }

    try {
      setSavingEdit(true);
      setError('');
      await updateAppointment(id, {
        doctorId: editDoctorId,
        patientName: trimmedName,
        dateTime: parsedDate.toISOString(),
        status: editStatus,
      });

      setItems((prev) => prev.map((appointment) => (
        appointment.id === id
          ? {
              ...appointment,
              doctorId: editDoctorId,
              patientName: trimmedName,
              dateTime: parsedDate,
              status: editStatus,
            }
          : appointment
      )));
      cancelEdit();
    } catch (err) {
      setError('Unable to update appointment. Please try again.');
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <Section
      id="appointments"
      title="Manage appointments"
      subtitle="Track bookings and create new visits in seconds."
    >
      {error && <p className="alert">{error}</p>}
      <div className="grid grid-2">
        <Card className="appointment-form">
          <h3>Create appointment</h3>
          <div className="form-grid">
            <Input label="Patient name" placeholder="e.g. Jordan Lee" value={patientName} onChange={setPatientName} />
            <Select
              label="Doctor"
              placeholder="Select doctor"
              value={selectedDoctor?.name ?? ''}
              options={doctorOptions}
              onChange={(value) => {
                const doctor = doctors.find((doc) => doc.name === value);
                setDoctorId(doctor?.id ?? '');
              }}
            />
            <Input
              label="Date & time"
              placeholder="2026-02-12 03:30 PM"
              type="datetime-local"
              value={dateTime}
              onChange={setDateTime}
            />
            <Select
              label="Status"
              placeholder="Select status"
              value={status}
              options={statusOptions}
              onChange={setStatus}
            />
          </div>
          <div className="form-actions">
            <Button variant="secondary">Save draft</Button>
            <Button onClick={handleCreate}>{saving ? 'Saving...' : 'Confirm booking'}</Button>
          </div>
        </Card>

        <Card className="appointment-summary">
          <h3>Upcoming appointments</h3>
          {loading ? (
            <div className="loading">Loading appointments...</div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Date Time</th>
                    <th>Status</th>
                    <th>Doctor</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedItems.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        {editingId === appointment.id ? (
                          <Input
                            label="Patient name"
                            value={editPatientName}
                            onChange={setEditPatientName}
                          />
                        ) : (
                          appointment.patientName
                        )}
                      </td>
                      <td>
                        {editingId === appointment.id ? (
                          <Input
                            label="Date & time"
                            type="datetime-local"
                            value={editDateTime}
                            onChange={setEditDateTime}
                          />
                        ) : (
                          formatDateTime(appointment.dateTime)
                        )}
                      </td>
                      <td>
                        {editingId === appointment.id ? (
                          <Select
                            label="Status"
                            value={editStatus}
                            options={statusOptions}
                            onChange={setEditStatus}
                          />
                        ) : (
                          appointment.status
                        )}
                      </td>
                      <td>
                        {editingId === appointment.id ? (
                          <Select
                            label="Doctor"
                            placeholder="Select doctor"
                            value={selectedEditDoctor?.name ?? ''}
                            options={doctorOptions}
                            onChange={(value) => {
                              const doctor = doctors.find((doc) => doc.name === value);
                              setEditDoctorId(doctor?.id ?? '');
                            }}
                          />
                        ) : (
                          doctors.find((doc) => doc.id === appointment.doctorId)?.name ?? 'Unknown'
                        )}
                      </td>
                      <td>
                        {editingId === appointment.id ? (
                          <>
                            <Button size="sm" onClick={() => handleUpdate(appointment.id)}>
                              {savingEdit ? 'Saving...' : 'Update'}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEdit}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => startEdit(appointment)}>
                            Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Section>
  );
};

export default Appointments;
