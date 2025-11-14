import { Exhibition, ApiResponse } from '../../interface';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

// Get all exhibitions
export async function getAllExhibitions(token?: string): Promise<ApiResponse<Exhibition[]>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/exhibitions`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch exhibitions');
  }

  return await response.json();
}

// Create a new exhibition (admin only)
export async function createExhibition(
  exhibitionData: Omit<Exhibition, '_id' | 'createdAt' | 'updatedAt'>,
  token: string
): Promise<ApiResponse<Exhibition>> {
  const response = await fetch(`${API_BASE_URL}/exhibitions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exhibitionData),
  });

  if (!response.ok) {
    throw new Error('Failed to create exhibition');
  }

  return await response.json();
}

// Get exhibition by ID
export async function getExhibitionById(id: string, token?: string): Promise<ApiResponse<Exhibition>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/exhibitions/${id}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch exhibition');
  }

  return await response.json();
}

// Update exhibition (admin only)
export async function updateExhibition(
  id: string,
  exhibitionData: Partial<Omit<Exhibition, '_id' | 'createdAt' | 'updatedAt'>>,
  token: string
): Promise<ApiResponse<Exhibition>> {
  const response = await fetch(`${API_BASE_URL}/exhibitions/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exhibitionData),
  });

  if (!response.ok) {
    throw new Error('Failed to update exhibition');
  }

  return await response.json();
}

// Delete exhibition (admin only)
export async function deleteExhibition(id: string, token: string): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/exhibitions/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete exhibition');
  }

  return await response.json();
}
