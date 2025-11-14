import { User, AuthResponse, ApiResponse } from '../../interface';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

// Register a new user
export async function registerUser(userData: Omit<User, '_id' | 'createdAt' | 'role'>): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}

// Login user
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}

// Logout user
export async function logoutUser(token: string): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to logout');
  }

  return await response.json();
}

// Get current user profile
export async function getCurrentUser(token: string): Promise<ApiResponse<User>> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Cannot get user profile');
  }

  return await response.json();
}
