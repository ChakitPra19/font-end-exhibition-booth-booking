const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Exhibition {
  _id: string;
  name: string;
  description: string;
  venue: string;
  startDate: string;
  durationDay: number;
  smallBoothQuota: number;
  bigBoothQuota: number;
  posterPicture: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExhibitionData {
  name: string;
  description: string;
  venue: string;
  startDate: string;
  durationDay: number;
  smallBoothQuota: number;
  bigBoothQuota: number;
  posterPicture: string;
}

export interface ExhibitionsResponse {
  success: boolean;
  count: number;
  data: Exhibition[];
}

export interface ExhibitionResponse {
  success: boolean;
  data: Exhibition;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

// Get all exhibitions
export async function getExhibitions(): Promise<ExhibitionsResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/exhibitions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exhibitions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    throw error;
  }
}

// Get exhibition by ID
export async function getExhibition(id: string): Promise<ExhibitionResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/exhibitions/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exhibition');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching exhibition:', error);
    throw error;
  }
}

// Create new exhibition (admin only)
export async function createExhibition(data: CreateExhibitionData, token: string): Promise<ExhibitionResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/exhibitions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create exhibition');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating exhibition:', error);
    throw error;
  }
}

// Update exhibition (admin only)
export async function updateExhibition(id: string, data: CreateExhibitionData, token: string): Promise<ExhibitionResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/exhibitions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update exhibition');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating exhibition:', error);
    throw error;
  }
}

// Delete exhibition (admin only)
export async function deleteExhibition(id: string, token: string): Promise<DeleteResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/exhibitions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete exhibition');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting exhibition:', error);
    throw error;
  }
}