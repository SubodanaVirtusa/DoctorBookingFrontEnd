import React, { useEffect, useState } from 'react';
import Section from '../components/layout/Section';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { register, AuthResponse } from '../api/auth';
import { formatDateTime } from '../utils/format';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
const maxImageSize = 5 * 1024 * 1024;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [account, setAccount] = useState<AuthResponse | null>(null);

  useEffect(() => {
    if (!profileImage) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(profileImage);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [profileImage]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setProfileImage(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedUsername === '' || trimmedEmail === '' || trimmedPassword === '') {
      setError('Please complete all required fields.');
      return;
    }

    if (profileImage) {
      if (!allowedImageTypes.includes(profileImage.type)) {
        setError('Profile image must be a JPG, PNG, or GIF file.');
        return;
      }
      if (profileImage.size > maxImageSize) {
        setError('Profile image must be smaller than 5MB.');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      const response = await register({
        username: trimmedUsername,
        email: trimmedEmail,
        password: trimmedPassword,
        profileImage,
      });
      setAccount(response);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUsername', response.username);
      if (response.profileImageUrl) {
        localStorage.setItem('authProfileImageUrl', response.profileImageUrl);
      } else {
        localStorage.removeItem('authProfileImageUrl');
      }
      setUsername('');
      setEmail('');
      setPassword('');
      setProfileImage(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const expiresAt = account?.expiresAt ? formatDateTime(new Date(account.expiresAt)) : null;

  return (
    <Section
      id="register"
      title="Create your account"
      subtitle="Join Doctor Booking to manage visits and patient details."
    >
      <div className="auth-grid">
        <div className="auth-panel auth-panel-alt">
          <p className="auth-pill">Get started</p>
          <h3>Set up your profile</h3>
          <p>
            Upload a profile image, add your details, and keep your availability consistent across
            devices.
          </p>
          <div className="auth-panel-grid">
            <div>
              <p className="auth-panel-label">Secure by design</p>
              <p className="auth-panel-text">Your credentials are protected end-to-end.</p>
            </div>
            <div>
              <p className="auth-panel-label">Smart onboarding</p>
              <p className="auth-panel-text">Start booking with a single profile.</p>
            </div>
          </div>
        </div>

        <Card className="auth-card">
          <h3>Register</h3>
          {error && <p className="alert">{error}</p>}
          <form onSubmit={handleSubmit} className="form-grid">
            <Input
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChange={setUsername}
            />
            <Input
              label="Email"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <label className="field">
              <span>Profile image (optional)</span>
              <input type="file" accept="image/png,image/jpeg,image/gif" onChange={handleImageChange} />
            </label>
            {previewUrl && (
              <div className="auth-preview">
                <img src={previewUrl} alt="Profile preview" />
                <p className="muted">Preview of your profile image.</p>
              </div>
            )}
            <div className="form-actions">
              <Button type="submit" variant="primary" size="md">
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>
          {account && (
            <div className="auth-success">
              <p className="auth-success-title">Welcome, {account.username}!</p>
              <p className="muted">Token saved locally. Expires: {expiresAt}</p>
            </div>
          )}
        </Card>
      </div>
    </Section>
  );
};

export default Register;
