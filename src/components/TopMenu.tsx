'use client';

import Image from 'next/image';
import TopMenuItem from './TopMenuItem';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { logoutUser } from '@/libs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TopMenu() {
  const { user, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      // Error handled silently
    } finally {
      logout();
      setLoading(false);
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-8 py-5 bg-gradient-to-r from-white to-gray-50 shadow-lg border-b border-gray-100">
      {/* Logo */}
      <Link href="/">
        <Image 
          src="/img/logo.png" 
          alt="logo" 
          width={80} 
          height={80} 
          className="h-full w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
        />
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        <TopMenuItem title='Exhibitions' pageRef='/exhibitions'/>
        <TopMenuItem title='Booking' pageRef='/booking'/>
        {user && <TopMenuItem title='My Booking' pageRef='/mybooking'/>}
      </div>
      
      {/* User section */}
      <div className="flex items-center gap-4">
        {authLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500">Loading...</span>
          </div>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              <span className="font-medium">Welcome, {user.name}!</span>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
                {user.role ? user.role.toUpperCase() : 'USER'}
              </span>
            </span>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <button className="px-4 py-2 text-sm text-indigo-600 border border-indigo-600 hover:bg-indigo-50 rounded-md transition-colors font-medium">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors font-medium">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}