'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getExhibition, updateExhibition, deleteExhibition, Exhibition, CreateExhibitionData } from '@/lib/api/exhibitions'

export default function EditExhibitionPage() {
  const { user, token } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [exhibition, setExhibition] = useState<Exhibition | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        setFetching(true)
        const id = params.id as string
        const response = await getExhibition(id)
        const exhibitionData = response.data
        
        setExhibition(exhibitionData)
        setFormData({
          name: exhibitionData.name,
          description: exhibitionData.description,
          venue: exhibitionData.venue,
          startDate: exhibitionData.startDate.split('T')[0], // Format for date input
          durationDay: exhibitionData.durationDay,
          smallBoothQuota: exhibitionData.smallBoothQuota,
          bigBoothQuota: exhibitionData.bigBoothQuota,
          posterPicture: exhibitionData.posterPicture || ''
        })
      } catch (error) {
        console.error('Error fetching exhibition:', error)
        setError('ไม่สามารถโหลดข้อมูลนิทรรศการได้')
      } finally {
        setFetching(false)
      }
    }

    if (params.id) {
      fetchExhibition()
    }
  }, [params.id])

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

      const id = params.id as string
      await updateExhibition(id, formData, token)
      router.push('/exhibitions')
    } catch (error: any) {
      console.error('Error updating exhibition:', error)
      setError(error.message || 'ไม่สามารถอัปเดตนิทรรศการได้')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setError(null)
    setLoading(true)

    try {
      if (!token) {
        setError('ไม่พบ token การยืนยันตัวตน')
        setLoading(false)
        return
      }

      const id = params.id as string
      await deleteExhibition(id, token)
      router.push('/exhibitions')
    } catch (error: any) {
      console.error('Error deleting exhibition:', error)
      setError(error.message || 'ไม่สามารถลบนิทรรศการได้')
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Quota') || name === 'durationDay' ? parseInt(value) || 0 : value
    }))
  }

  if (fetching) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !exhibition) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">แก้ไขนิทรรศการ</h1>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ลบนิทรรศการ
            </button>
          </div>

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
              />
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
                {loading ? 'กำลังอัปเดต...' : 'อัปเดตนิทรรศการ'}
              </button>
            </div>
          </form>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ยืนยันการลบ</h3>
              <p className="text-gray-600 mb-6">
                คุณแน่ใจหรือไม่ที่จะลบนิทรรศการ "{exhibition?.name}"? 
                การกระทำนี้ไม่สามารถย้อนกลับได้
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
                >
                  {loading ? 'กำลังลบ...' : 'ลบ'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}