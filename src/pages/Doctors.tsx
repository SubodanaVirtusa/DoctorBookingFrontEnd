import React, { useEffect, useMemo, useState } from 'react';
import Section from '../components/layout/Section';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { createDoctor, fetchDoctors } from '../api/doctors';
import { Doctor } from '../types';
import { formatDateTime } from '../utils/format';

const Doctors = () => {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState<Doctor[]>([]);
  const [newName, setNewName] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newSlots, setNewSlots] = useState<string[]>([]);
  const [newSlotInput, setNewSlotInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSpecialty, setEditSpecialty] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetchDoctors();
        const mapped = response.map((doctor) => {
          return {
            id: String(doctor.id),
            name: doctor.name,
            specialty: doctor.specialty,
            availableSlots: (doctor.availableSlots ?? []).map((slot) => new Date(slot)),
          };
        });
        if (isMounted) {
          setItems(mapped);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setItems([]);
          setError('Unable to load doctors from the API.');
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

  const specialties = useMemo(() => {
    return Array.from(new Set(items.map((doctor) => doctor.specialty)));
  }, [items]);

  const filteredDoctors = useMemo(() => {
    return items.filter((doctor) => {
      const matchesSearch = doctor.name.toLowerCase().includes(search.toLowerCase());
      const matchesSpecialty = specialty ? doctor.specialty === specialty : true;
      return matchesSearch && matchesSpecialty;
    });
  }, [items, search, specialty]);

  const handleCreateDoctor = async () => {
    const trimmedName = newName.trim();
    const trimmedSpecialty = newSpecialty.trim();

    if (trimmedName === '' || trimmedSpecialty === '') {
      setCreateError('Please provide name and specialty.');
      return;
    }

    const slots = newSlots
      .map((slot) => slot.trim())
      .filter((slot) => slot.length > 0);

    try {
      setSaving(true);
      setCreateError('');
      const created = await createDoctor({
        name: trimmedName,
        specialty: trimmedSpecialty,
        availableSlots: slots.map((slot) => new Date(slot).toISOString()),
      });

      setItems((prev) => [
        {
          id: String(created.id),
          name: created.name,
          specialty: created.specialty,
          availableSlots: (created.availableSlots ?? []).map((slot) => new Date(slot)),
        },
        ...prev,
      ]);

      setNewName('');
      setNewSpecialty('');
      setNewSlots([]);
      setNewSlotInput('');
    } catch (err) {
      setCreateError('Unable to create doctor. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSlot = () => {
    const trimmedSlot = newSlotInput.trim();
    if (trimmedSlot === '' || Number.isNaN(new Date(trimmedSlot).getTime())) {
      setCreateError('Please pick a valid slot date/time.');
      return;
    }

    setCreateError('');
    setNewSlots((prev) => Array.from(new Set([...prev, trimmedSlot])));
    setNewSlotInput('');
  };

  const handleRemoveSlot = (slot: string) => {
    setNewSlots((prev) => prev.filter((value) => value !== slot));
  };

  const startEditDoctor = (doctor: Doctor) => {
    setEditingId(doctor.id);
    setEditName(doctor.name);
    setEditSpecialty(doctor.specialty);
  };

  const cancelEditDoctor = () => {
    setEditingId(null);
    setEditName('');
    setEditSpecialty('');
  };

  const applyEditDoctor = (id: string) => {
    const trimmedName = editName.trim();
    const trimmedSpecialty = editSpecialty.trim();

    if (trimmedName === '' || trimmedSpecialty === '') {
      setCreateError('Please provide name and specialty.');
      return;
    }

    setItems((prev) => prev.map((doctor) => (
      doctor.id === id
        ? { ...doctor, name: trimmedName, specialty: trimmedSpecialty }
        : doctor
    )));
    cancelEditDoctor();
  };

  return (
    <Section
      id="doctors"
      title="Explore doctors"
      subtitle="Pick a specialist and book the best available time."
      actions={<Button variant="secondary">View all</Button>}
    >
      <div className="filters">
        <Input
          label="Search by name"
          placeholder="e.g. Dr. Sofia"
          value={search}
          onChange={setSearch}
        />
        <Select
          label="Specialty"
          placeholder="Select specialty"
          options={specialties}
          value={specialty}
          onChange={setSpecialty}
        />
        <Button variant="ghost" onClick={() => {
          setSearch('');
          setSpecialty('');
        }}>
          Reset filters
        </Button>
      </div>

      <div className="form-grid">
        <Input
          label="Doctor name"
          placeholder="e.g. Dr. Sofia Patel"
          value={newName}
          onChange={setNewName}
        />
        <Input
          label="Specialty"
          placeholder="e.g. Cardiology"
          value={newSpecialty}
          onChange={setNewSpecialty}
        />
        <Input
          label="Available slot"
          type="datetime-local"
          value={newSlotInput}
          onChange={setNewSlotInput}
        />
        <Button variant="ghost" onClick={handleAddSlot}>Add slot</Button>
        <div className="slots-list">
          {newSlots.length ? (
            newSlots.map((slot) => (
              <Button key={slot} variant="ghost" size="sm" onClick={() => handleRemoveSlot(slot)}>
                {formatDateTime(new Date(slot))}
              </Button>
            ))
          ) : (
            <span className="muted">No slots added yet.</span>
          )}
        </div>
        <div className="form-actions">
          <Button variant="secondary" onClick={() => {
            setNewName('');
            setNewSpecialty('');
            setNewSlots([]);
            setNewSlotInput('');
            setCreateError('');
          }}>
            Clear
          </Button>
          <Button onClick={handleCreateDoctor}>{saving ? 'Saving...' : 'Add doctor'}</Button>
        </div>
      </div>
      {createError && <p className="alert">{createError}</p>}

      {error && <p className="alert">{error}</p>}
      {loading ? (
        <div className="loading">Loading doctors...</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Available Slots</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>
                    {editingId === doctor.id ? (
                      <Input label="Doctor name" value={editName} onChange={setEditName} />
                    ) : (
                      doctor.name
                    )}
                  </td>
                  <td>
                    {editingId === doctor.id ? (
                      <Input label="Specialty" value={editSpecialty} onChange={setEditSpecialty} />
                    ) : (
                      doctor.specialty
                    )}
                  </td>
                  <td>
                    {doctor.availableSlots.length
                      ? doctor.availableSlots.map((slot) => (
                          <span key={slot.toISOString()} className="slot">
                            {formatDateTime(slot)}
                          </span>
                        ))
                      : 'No slots'}
                  </td>
                  <td>
                    {editingId === doctor.id ? (
                      <>
                        <Button size="sm" onClick={() => applyEditDoctor(doctor.id)}>Update</Button>
                        <Button size="sm" variant="ghost" onClick={cancelEditDoctor}>Cancel</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => startEditDoctor(doctor)}>
                        Update
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
};

export default Doctors;
