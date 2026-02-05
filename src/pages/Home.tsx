import React, { useEffect, useState } from 'react';
import Section from '../components/layout/Section';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Stat from '../components/ui/Stat';
import { fetchDoctors } from '../api/doctors';
import { fetchAppointments } from '../api/appointments';

const Home = () => { 
  const [doctorCount, setDoctorCount] = useState<number | null>(null);
  const [appointmentCount, setAppointmentCount] = useState<number | null>(null);
  const [avgWaitMinutes, setAvgWaitMinutes] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => { 
    let isMounted = true;

    const loadStats = async () => {
      try {
        const [doctors, appointments] = await Promise.all([
          fetchDoctors(),
          fetchAppointments(),
        ]);
        if (!isMounted) return;

        setDoctorCount(doctors.length);
        setAppointmentCount(appointments.length);

        const now = Date.now();
        const futureAppointments = appointments
          .map((appointment) => new Date(appointment.dateTime).getTime())
          .filter((time) => !Number.isNaN(time) && time >= now);

        if (futureAppointments.length === 0) {
          setAvgWaitMinutes(null);
          return;
        }

        const totalMinutes = futureAppointments.reduce((sum, time) => sum + (time - now) / 60000, 0);
        setAvgWaitMinutes(Math.round(totalMinutes / futureAppointments.length));
      } catch (err) {
        if (isMounted) {
          setDoctorCount(null);
          setAppointmentCount(null);
          setAvgWaitMinutes(null);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCount = (value: number | null) => (value === null ? '--' : value.toString());
  const formatWait = (value: number | null) => (value === null ? '--' : `${value} min`);

  return (
    <div id="home">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="pill">Trusted care in minutes</p>
          <h1>Find the right doctor and book instantly.</h1>
          <p>
            Manage appointments, reduce wait times, and keep every patient updated with a modern
            booking experience.
          </p>
          <div className="hero-actions">
            <Button onClick={() => scrollToSection('doctors')}>Find a doctor</Button>
            <Button variant="secondary" onClick={() => scrollToSection('appointments')}>
              Manage bookings
            </Button>
          </div>
          <div className="hero-stats">
            <Stat label="Doctors onboarded" value={formatCount(doctorCount)} />
            <Stat label="Average wait time" value={formatWait(avgWaitMinutes)} />
            <Stat label="Appointments handled" value={formatCount(appointmentCount)} />
          </div>
        </div>
      </section>

      <Section
        title="Why patients love Doctor Booking"
        subtitle="Everything you need for a seamless clinic experience."
      >
        <div className="grid grid-3">
          {[
            {
              title: 'Instant availability',
              text: 'Real-time slots with automated confirmations and reminders.',
            },
            {
              title: 'Smart scheduling',
              text: 'Prevent double booking with easy reschedules and cancellations.',
            },
            {
              title: 'Secure records',
              text: 'Keep visit summaries and preferences organized across visits.',
            },
          ].map((item) => (
            <Card key={item.title}>
              <h3>{item.title}</h3>
              <p className="muted">{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Home;
