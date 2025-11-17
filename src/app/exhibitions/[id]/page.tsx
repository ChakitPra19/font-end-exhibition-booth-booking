'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getExhibition, Exhibition } from '@/lib/api/exhibitions'

export default function ExhibitionDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [exhibition, setExhibition] = useState<Exhibition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        setLoading(true)
        const id = params.id as string
        const response = await getExhibition(id)
        setExhibition(response.data)
      } catch (error) {
        console.error('Error fetching exhibition:', error)
        setError('ไม่สามารถโหลดข้อมูลนิทรรศการได้')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchExhibition()
    }
  }, [params.id])

  const getStatusInfo = (startDate: string, durationDay: number) => {
    const start = new Date(startDate)
    const end = new Date(start.getTime() + durationDay * 24 * 60 * 60 * 1000)
    const now = new Date()
    
    if (now < start) {
      return {
        status: 'upcoming',
        text: 'กำลังจะมาถึง',
        color: 'bg-blue-100 text-blue-800'
      }
    }
    if (now >= start && now <= end) {
      return {
        status: 'ongoing',
        text: 'กำลังจัดงาน',
        color: 'bg-green-100 text-green-800'
      }
    }
    return {
      status: 'ended',
      text: 'จบแล้ว',
      color: 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error || !exhibition) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error || 'ไม่พบข้อมูลนิทรรศการ'}</p>
          <Link 
            href="/exhibitions"
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            กลับไปหน้านิทรรศการ
          </Link>
        </div>
      </div>
    )
  }

  const endDate = new Date(new Date(exhibition.startDate).getTime() + exhibition.durationDay * 24 * 60 * 60 * 1000)
  const totalBooths = exhibition.smallBoothQuota + exhibition.bigBoothQuota
  const statusInfo = getStatusInfo(exhibition.startDate, exhibition.durationDay)

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Navigation */}
      <nav className="mb-6">
        <Link 
          href="/exhibitions"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← กลับไปหน้านิทรรศการ
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Header */}
        <div className="relative h-96 bg-gray-200">
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
                parent.innerHTML = '<div class="w-full h-full bg-gray-300 flex items-center justify-center"><span class="text-gray-500 text-xl">ไม่สามารถโหลดรูปภาพได้</span></div>';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-xl">ไม่มีรูปภาพ</span>
            </div>
          )}
          <div className="absolute top-6 right-6">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
        </div>

        <div className="p-8">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {exhibition.name}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {exhibition.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">รายละเอียดการจัดงาน</h3>
              
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">วันเริ่ม:</span>
                <span className="text-gray-600">{new Date(exhibition.startDate).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">วันสิ้นสุด:</span>
                <span className="text-gray-600">{endDate.toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">ระยะเวลา:</span>
                <span className="text-gray-600">{exhibition.durationDay} วัน</span>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">สถานที่:</span>
                <span className="text-gray-600">{exhibition.venue}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">ข้อมูลบูธ</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{exhibition.smallBoothQuota}</p>
                    <p className="text-sm text-gray-600">บูธเล็ก</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{exhibition.bigBoothQuota}</p>
                    <p className="text-sm text-gray-600">บูธใหญ่</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                  <p className="text-lg font-semibold text-gray-900">รวมทั้งหมด {totalBooths} บูธ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {statusInfo.status === 'upcoming' && (
              <Link
                href={`/exhibitions/${exhibition._id}/book`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                จองบูธ
              </Link>
            )}
            
            {user?.role === 'admin' && (
              <>
                <Link
                  href={`/admin/exhibitions/${exhibition._id}/edit`}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                >
                  แก้ไขข้อมูล
                </Link>
                <Link
                  href={`/admin/exhibitions/${exhibition._id}/bookings`}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                >
                  จัดการการจอง
                </Link>
              </>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">สร้างเมื่อ:</span>
                <span className="ml-2">{new Date(exhibition.createdAt).toLocaleDateString('th-TH')}</span>
              </div>
              <div>
                <span className="font-medium">อัปเดตล่าสุด:</span>
                <span className="ml-2">{new Date(exhibition.updatedAt).toLocaleDateString('th-TH')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}