import React from 'react';
import Container from './Container';

const Header = () => {
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="header">
      <Container>
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark">DB</div>
            <div>
              <p className="brand-title">Doctor Booking</p>
              <span className="brand-subtitle">Care made simple</span>
            </div>
          </div>
          <nav className="nav">
            <a href="#home">Home</a>
            <a href="#doctors">Doctors</a>
            <a href="#appointments">Appointments</a>
            <a href="#contact">Support</a>
          </nav>
          <div className="header-cta">
            <button
              className="button button-primary"
              onClick={() => scrollToSection('appointments')}
            >
              Book now
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
