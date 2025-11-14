import { Booking, ApiResponse } from '../../interface';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

// Get all bookings
export async function getAllBookings(token: string): Promise<ApiResponse<Booking[]>> {
  const response = await fetch(`${API_BASE_URL}/booking`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  return await response.json();
}

// Create a new booking
export async function createBooking(
  bookingData: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>,
  token: string
): Promise<ApiResponse<Booking>> {
  const response = await fetch(`${API_BASE_URL}/booking`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    throw new Error('Failed to create booking');
  }

  return await response.json();
}

// Get booking by ID
export async function getBookingById(id: string, token: string): Promise<ApiResponse<Booking>> {
  const response = await fetch(`${API_BASE_URL}/booking/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch booking');
  }

  return await response.json();
}

// Update booking
export async function updateBooking(
  id: string,
  bookingData: Partial<Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>>,
  token: string
): Promise<ApiResponse<Booking>> {
  const response = await fetch(`${API_BASE_URL}/booking/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    throw new Error('Failed to update booking');
  }

  return await response.json();
}

// Delete booking
export async function deleteBooking(id: string, token: string): Promise<ApiResponse<null>> {
  const response = await fetch(`${API_BASE_URL}/booking/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete booking');
  }

  return await response.json();
}
