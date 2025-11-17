'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createExhibition, CreateExhibitionData } from '@/lib/api/exhibitions'

export default function CreateExhibitionPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateExhibitionData>({
    name: '',
    description: '',
    venue: '',
    startDate: '',
    durationDay: 1,
    smallBoothQuota: 0,
    bigBoothQuota: 0,
    posterPicture: ''
  })

  // Redirect if not admin
  if (user && user.role !== 'admin') {
    router.push('/exhibitions')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate start date is not in the past
      const startDate = new Date(formData.startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (startDate < today) {
        setError('วันเริ่มงานต้องไม่เป็นวันที่ผ่านมาแล้ว')
        setLoading(false)
        return
      }

      if (!token) {
        setError('ไม่พบ token การยืนยันตัวตน')
        setLoading(false)
        return
      }

      await createExhibition(formData, token)
      router.push('/exhibitions')
    } catch (error: any) {
      console.error('Error creating exhibition:', error)
      setError(error.message || 'ไม่สามารถสร้างนิทรรศการได้')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Quota') || name === 'durationDay' ? parseInt(value) || 0 : value
    }))
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <nav className="mb-6">
          <Link 
            href="/exhibitions"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← กลับไปหน้านิทรรศการ
          </Link>
        </nav>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">สร้างนิทรรศการใหม่</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exhibition Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อนิทรรศการ *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ป้อนชื่อนิทรรศการ"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                รายละเอียด *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ป้อนรายละเอียดนิทรรศการ"
              />
            </div>

            {/* Venue */}
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                สถานที่จัดงาน *
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                required
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ป้อนสถานที่จัดงาน"
              />
            </div>

            {/* Date and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  วันเริ่มงาน *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="durationDay" className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนวัน *
                </label>
                <input
                  type="number"
                  id="durationDay"
                  name="durationDay"
                  required
                  min="1"
                  value={formData.durationDay}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Booth Quotas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="smallBoothQuota" className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนบูธเล็ก *
                </label>
                <input
                  type="number"
                  id="smallBoothQuota"
                  name="smallBoothQuota"
                  required
                  min="0"
                  value={formData.smallBoothQuota}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="bigBoothQuota" className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนบูธใหญ่ *
                </label>
                <input
                  type="number"
                  id="bigBoothQuota"
                  name="bigBoothQuota"
                  required
                  min="0"
                  value={formData.bigBoothQuota}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Poster Picture URL */}
            <div>
              <label htmlFor="posterPicture" className="block text-sm font-medium text-gray-700 mb-2">
                URL รูปโปสเตอร์
              </label>
              <input
                type="url"
                id="posterPicture"
                name="posterPicture"
                value={formData.posterPicture}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                ป้อน URL ของรูปภาพโปสเตอร์ (ถ้ามี)
              </p>
            </div>

            {/* Total Booths Display */}
            {(formData.smallBoothQuota > 0 || formData.bigBoothQuota > 0) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  จำนวนบูธทั้งหมด: {formData.smallBoothQuota + formData.bigBoothQuota} บูธ
                </p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end pt-6">
              <Link
                href="/exhibitions"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                {loading ? 'กำลังสร้าง...' : 'สร้างนิทรรศการ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}