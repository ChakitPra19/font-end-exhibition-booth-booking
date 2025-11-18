'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getExhibitions, Exhibition } from '@/lib/api/exhibitions'

export default function ExhibitionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // สร้าง function สำหรับ fetch ที่ใช้ร่วมกัน
  const fetchExhibitions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching exhibitions...')
      const response = await getExhibitions()
      console.log('Response received:', response)
      
      // ตรวจสอบ response structure ตาม API documentation
      if (response && response.success && response.data) {
        if (Array.isArray(response.data)) {
          setExhibitions(response.data)
          console.log('Exhibitions loaded successfully:', response.data.length)
        } else {
          setExhibitions([])
          console.log('Data is not an array')
        }
      } else if (response && response.data && Array.isArray(response.data)) {
        // Fallback: ถ้า response.data เป็น array โดยตรง
        setExhibitions(response.data)
        console.log('Exhibitions loaded (fallback):', response.data.length)
      } else {
        setExhibitions([])
        console.log('No valid data in response:', response)
      }
    } catch (error: any) {
      console.error('Error fetching exhibitions:', error)
      
      // แสดงข้อความ error ที่เข้าใจง่าย
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์ทำงานอยู่หรือไม่')
      } else if (!navigator.onLine) {
        setError('ไม่มีการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อของคุณ')
      } else {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExhibitions()
  }, [])

  const getStatusColor = (startDate: string, durationDay: number) => {
    const start = new Date(startDate)
    const end = new Date(start.getTime() + durationDay * 24 * 60 * 60 * 1000)
    const now = new Date()
    
    if (now < start) return 'bg-blue-100 text-blue-800'
    if (now >= start && now <= end) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (startDate: string, durationDay: number) => {
    const start = new Date(startDate)
    const end = new Date(start.getTime() + durationDay * 24 * 60 * 60 * 1000)
    const now = new Date()
    
    if (now < start) return 'กำลังจะมาถึง'
    if (now >= start && now <= end) return 'กำลังจัดงาน'
    return 'จบแล้ว'
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              รีเฟรชหน้า
            </button>
            <button 
              onClick={fetchExhibitions}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">นิทรรศการทั้งหมด</h1>
        {user?.role === 'admin' && (
          <Link 
            href="/admin/exhibitions/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            เพิ่มนิทรรศการใหม่
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exhibitions.map((exhibition) => {
          const endDate = new Date(new Date(exhibition.startDate).getTime() + exhibition.durationDay * 24 * 60 * 60 * 1000)
          const totalBooths = exhibition.smallBoothQuota + exhibition.bigBoothQuota
          
          return (
            <div key={exhibition._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                {exhibition.posterPicture ? (
                  <Image
                    src={exhibition.posterPicture}
                    alt={exhibition.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentNode as HTMLElement;
                      parent.innerHTML = '<div class="w-full h-full bg-gray-300 flex items-center justify-center"><span class="text-gray-500">ไม่สามารถโหลดรูปภาพได้</span></div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">ไม่มีรูปภาพ</span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exhibition.startDate, exhibition.durationDay)}`}>
                    {getStatusText(exhibition.startDate, exhibition.durationDay)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {exhibition.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {exhibition.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <span className="font-medium">วันที่:</span>
                    <span className="ml-2">
                      {new Date(exhibition.startDate).toLocaleDateString('th-TH')} - {endDate.toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">สถานที่:</span>
                    <span className="ml-2">{exhibition.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">บูธทั้งหมด:</span>
                    <span className="ml-2">{totalBooths} (เล็ก: {exhibition.smallBoothQuota}, ใหญ่: {exhibition.bigBoothQuota})</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/exhibitions/${exhibition._id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
                  >
                    ดูรายละเอียด
                  </Link>

                  {user && (
                    <Link
                      href={`/booking?exhibitionId=${exhibition._id}`}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      ทำการจองบูธ
                    </Link>
  )}
                  {user?.role === 'admin' && (
                    <Link
                      href={`/admin/exhibitions/${exhibition._id}/edit`}
                      className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      แก้ไข
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {exhibitions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">ไม่มีนิทรรศการในขณะนี้</p>
          {user?.role === 'admin' && (
            <Link 
              href="/admin/exhibitions/create"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              เพิ่มนิทรรศการแรก
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
