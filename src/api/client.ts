import { API_BASE_URL } from '../config';

const trimSlash = (value: string) => value.replace(/\/+$/, '');

const baseUrl = trimSlash(API_BASE_URL);

type ApiListResponse<T> = {
  value: T;
  Count?: number;
};

const unwrapIfNeeded = <T>(data: T | ApiListResponse<T>) => {
  if (data && typeof data === 'object' && 'value' in (data as ApiListResponse<T>)) {
    return (data as ApiListResponse<T>).value;
  }
  return data as T;
};

export const apiGet = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const data = (await response.json()) as T | ApiListResponse<T>;
  return unwrapIfNeeded(data);
};

export const apiPost = async <T, B>(path: string, body: B): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const apiPut = async <T, B>(path: string, body: B): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
};
