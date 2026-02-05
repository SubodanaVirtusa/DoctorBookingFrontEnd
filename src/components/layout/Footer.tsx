import React from 'react';
import Container from './Container';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <Container>
        <div className="footer-grid">
          <div>
            <p className="footer-title">Doctor Booking</p>
            <p className="footer-text">
              Connect patients with trusted doctors, track appointments, and manage schedules in one
              delightful experience.
            </p>
          </div>
          <div>
            <p className="footer-heading">Contact</p>
            <p className="footer-text">support@doctorbooking.io</p>
            <p className="footer-text">+1 (555) 012-9876</p>
          </div>
          <div>
            <p className="footer-heading">Hours</p>
            <p className="footer-text">Mon - Fri: 8:00 AM - 7:00 PM</p>
            <p className="footer-text">Sat: 9:00 AM - 3:00 PM</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Doctor Booking. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
