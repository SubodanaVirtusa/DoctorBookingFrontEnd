import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Section from '../components/layout/Section';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { login } from '../api/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedEmail === '' || trimmedPassword === '') {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await login({ email: trimmedEmail, password: trimmedPassword });
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUsername', response.username);
      if (response.profileImageUrl) {
        localStorage.setItem('authProfileImageUrl', response.profileImageUrl);
      } else {
        localStorage.removeItem('authProfileImageUrl');
      }
      navigate('/doctors');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      id="login"
      title="Welcome back"
      subtitle="Sign in to manage your bookings and updates."
    >
      <div className="auth-grid">
        <Card className="auth-card">
          <h3>Sign in</h3>
          {error && <p className="alert">{error}</p>}
          <form onSubmit={handleSubmit} className="form-grid">
            <Input
              label="Email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <div className="form-actions">
              <Button type="submit" variant="primary" size="md">
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
              <Link className="button button-ghost button-md" to="/register">
                Register
              </Link>
            </div>
          </form>
        </Card>

        <div className="auth-panel">
          <p className="auth-pill">Secure access</p>
          <h3>Everything in one place</h3>
          <p>
            Review upcoming appointments, manage your profile, and keep your clinic in sync across
            devices.
          </p>
          <div className="auth-panel-grid">
            <div>
              <p className="auth-panel-label">Fast check-ins</p>
              <p className="auth-panel-text">Save patient time with instant confirmations.</p>
            </div>
            <div>
              <p className="auth-panel-label">Reliable updates</p>
              <p className="auth-panel-text">Get notified when changes happen.</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Login;
