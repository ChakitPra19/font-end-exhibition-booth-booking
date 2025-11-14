// API utility functions and constants

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

// Common headers builder
export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// Error handler for API responses
export function handleApiError(error: any): never {
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('An unexpected error occurred');
}

// Generic API request function
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(token),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }

  return await response.json();
}

// Booth types enum
export enum BoothType {
  SMALL = 'small',
  BIG = 'big',
}

// User roles enum
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
