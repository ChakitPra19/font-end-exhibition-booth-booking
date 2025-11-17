'use client';

import Image from 'next/image';
import TopMenuItem from './TopMenuItem';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TopMenu() {
  const { user, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Debug log
  useEffect(() => {
    console.log('TopMenu render - user:', user);
    console.log('TopMenu render - authLoading:', authLoading);
    
    // Also check localStorage directly
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    console.log('localStorage user:', storedUser);
    console.log('localStorage token:', storedToken);
  }, [user, authLoading]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-8 py-5 bg-gradient-to-r from-white to-gray-50 shadow-lg border-b border-gray-100">
      {/* Logo */}
      <Link href="/">
        <div className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          Exhibition Booking
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        <TopMenuItem title='นิทรรศการ' pageRef='/exhibitions'/>
        {user && <TopMenuItem title='การจองของฉัน' pageRef='/mybooking'/>}
        {user && user.role === 'admin' && (
          <TopMenuItem title='จัดการนิทรรศการ' pageRef='/admin/exhibitions/create'/>
        )}
      </div>
      
      {/* User section */}
      <div className="flex items-center gap-4">
        {authLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500">กำลังโหลด...</span>
          </div>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              <span className="font-medium">สวัสดี, {user.name}!</span>
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
                {user.role ? user.role.toUpperCase() : 'USER'}
              </span>
            </span>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <button className="px-4 py-2 text-sm text-indigo-600 border border-indigo-600 hover:bg-indigo-50 rounded-md transition-colors font-medium">
                เข้าสู่ระบบ
              </button>
            </Link>
            <Link href="/register">
              <button className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors font-medium">
                สมัครสมาชิก
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}