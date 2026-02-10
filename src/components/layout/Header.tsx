import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from './Container';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('authUsername') ?? '';
  const profileImageUrl = localStorage.getItem('authProfileImageUrl') ?? '';
  const isSignedIn = Boolean(localStorage.getItem('authToken'));
  const profileInitial = username.trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUsername');
    localStorage.removeItem('authProfileImageUrl');
    navigate('/login');
  };

  return (
    <header className="header">
      <Container>
        <div className="header-inner">
          <Link className="brand" to="/">
            <div className="brand-mark">DB</div>
            <div>
              <p className="brand-title">Doctor Booking</p>
              <span className="brand-subtitle">Care made simple</span>
            </div>
          </Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/doctors">Doctors</Link>
            <Link to="/appointments">Appointments</Link>
            <Link to="/login" onClick={handleLogout}>
              Logout
            </Link>
            <Link to="/register">Register</Link>
            <Link to="/#contact">Support</Link>
          </nav>
          {isSignedIn && (profileImageUrl || username) && (
            <div className="nav-profile" title={username || 'Signed in'}>
              {/*
              {profileImageUrl ? (
                <img className="nav-avatar" src={profileImageUrl} alt="User profile" />
              ) : (
                <div className="nav-avatar nav-avatar-fallback">{profileInitial || 'U'}</div>
              )}
              */}
              <div className="nav-avatar nav-avatar-fallback">{profileInitial || 'U'}</div>
              {username && <span className="nav-name">{username}</span>}
            </div>
          )}
          <div className="header-cta">
            <Link className="button button-primary" to="/appointments">
              Book now
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
