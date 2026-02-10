import { apiPost, apiPostForm } from './client';

export type AuthResponse = {
  token: string;
  username: string;
  email: string;
  profileImageUrl?: string | null;
  expiresAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  profileImage?: File | null;
};

export const login = (payload: LoginRequest) => apiPost<AuthResponse, LoginRequest>('/Auth/login', payload);

export const register = async (payload: RegisterRequest) => {
  const formData = new FormData();
  formData.append('Username', payload.username);
  formData.append('Email', payload.email);
  formData.append('Password', payload.password);

  if (payload.profileImage) {
    formData.append('ProfileImage', payload.profileImage);
  }

  return apiPostForm<AuthResponse>('/Auth/register', formData);
};
