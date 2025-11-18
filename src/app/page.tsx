'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getExhibitions, Exhibition } from '@/lib/api/exhibitions'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { user } = useAuth()
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await getExhibitions()
        // Show only upcoming exhibitions, limited to 3
        const upcomingExhibitions = response.data
          .filter(exhibition => new Date(exhibition.startDate) > new Date())
          .slice(0, 3)
        setExhibitions(upcomingExhibitions)
      } catch (error) {
        console.error('Error fetching exhibitions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExhibitions()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            ระบบจองบูธนิทรรศการ
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            เว็บไซต์สำหรับการจองบูธในงานนิทรรศการต่าง ๆ 
            ค้นหาและจองบูธได้อย่างง่ายดาย
          </p>
          <div className="space-x-4">
            <Link
              href="/exhibitions"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              ดูนิทรรศการทั้งหมด
            </Link>
            {user ? (
              user.role === 'admin' ? (
                <Link
                  href="/admin/exhibitions/create"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
                >
                  จัดการนิทรรศการ
                </Link>
              ) : (
                <Link
                  href="/mybooking"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
                >
                  การจองของฉัน
                </Link>
              )
            ) : (
              <Link
                href="/register"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
              >
                สมัครสมาชิก
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Exhibitions */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              นิทรรศการที่กำลังจะมาถึง
            </h2>
            <p className="text-xl text-gray-600">
              ค้นพบโอกาสทางธุรกิจในงานนิทรรศการต่าง ๆ
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : exhibitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exhibitions.map((exhibition) => {
                const totalBooths = exhibition.smallBoothQuota + exhibition.bigBoothQuota
                return (
                  <div key={exhibition._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-64 bg-gray-200">
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
                          <span className="ml-2">{new Date(exhibition.startDate).toLocaleDateString('th-TH')}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">สถานที่:</span>
                          <span className="ml-2">{exhibition.venue}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">บูธทั้งหมด:</span>
                          <span className="ml-2">{totalBooths} บูธ</span>
                        </div>
                      </div>

                      <Link
                        href={`/exhibitions/${exhibition._id}`}
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">ไม่มีนิทรรศการที่กำลังจะมาถึงในขณะนี้</p>
            </div>
          )}

          {exhibitions.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/exhibitions"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block"
              >
                ดูนิทรรศการทั้งหมด
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ทำไมต้องเลือกเรา
            </h2>
            <p className="text-xl text-gray-600">
              ระบบจองบูธที่ง่ายและสะดวก
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ง่ายต่อการใช้งาน</h3>
              <p className="text-gray-600">
                ระบบที่ออกแบบมาให้ใช้งานง่าย สะดวก และรวดเร็ว
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">จองได้ตลอด 24 ชั่วโมง</h3>
              <p className="text-gray-600">
                สามารถจองบูธได้ทุกเวลาผ่านระบบออนไลน์
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">จัดการการจองอย่างมีประสิทธิภาพ</h3>
              <p className="text-gray-600">
                ระบบจัดการการจองที่ชัดเจนและโปร่งใส
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
