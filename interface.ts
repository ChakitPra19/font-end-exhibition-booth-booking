
// User Interface
export interface User {
  _id?: string;
  name: string;
  email: string;
  tel: string;
  role?: string;
  password: string;
  createdAt?: string;
}

// Booking Interface
export interface Booking {
  _id?: string;
  user: string | User;
  exhibition: string | Exhibition;
  boothType: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

// Exhibition Interface
export interface Exhibition {
  _id?: string;
  name: string;
  description: string;
  venue: string;
  startDate: string;
  durationDay: number;
  smallBoothQuota: number;
  bigBoothQuota: number;
  posterPicture: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  pagination?: object;
  data?: T;
  token?: string;
  message?: string;
  // Additional fields that might come directly in response
  _id?: string;
  name?: string;
  email?: string;
  tel?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  _id: string;
  name: string;
  email: string;
  tel?: string;
  role?: string;
  createdAt?: string;
}

// Legacy interfaces (keeping for compatibility)
interface VenueItem {
    _id: string,
    name: string,
    address: string,
    district: string,
    province: string,
    postalcode: string,
    tel: string,
    picture: string,
    dailyrate: number,
    __v: number,
    id: string
  }
  
  interface VenueJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: VenueItem[]
  }

export interface BookingItem {
    nameLastname: string;
    tel: string;
    venue: string;
    bookDate: string;
  }