"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getExhibition,
  updateExhibition,
  deleteExhibition,
  Exhibition,
  CreateExhibitionData,
} from "@/lib/api/exhibitions";

export default function EditExhibitionPage() {
  const { user, token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<CreateExhibitionData>({
    name: "",
    description: "",
    venue: "",
    startDate: "",
    durationDay: 1,
    smallBoothQuota: 0,
    bigBoothQuota: 0,
    posterPicture: "",
  });

  // Redirect if not admin
  if (user && user.role !== "admin") {
    router.push("/exhibitions");
    return null;
  }

  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        setFetching(true);
        const id = params.id as string;
        const response = await getExhibition(id);
        const exhibitionData = response.data;

        setExhibition(exhibitionData);
        setFormData({
          name: exhibitionData.name,
          description: exhibitionData.description,
          venue: exhibitionData.venue,
          startDate: exhibitionData.startDate.split("T")[0], // Format for date input
          durationDay: exhibitionData.durationDay,
          smallBoothQuota: exhibitionData.smallBoothQuota,
          bigBoothQuota: exhibitionData.bigBoothQuota,
          posterPicture: exhibitionData.posterPicture || "",
        });
      } catch (error) {
        console.error("Error fetching exhibition:", error);
        setError("ไม่สามารถโหลดข้อมูลนิทรรศการได้");
      } finally {
        setFetching(false);
      }
    };

    if (params.id) {
      fetchExhibition();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate start date is not in the past
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        setError("วันเริ่มงานต้องไม่เป็นวันที่ผ่านมาแล้ว");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("ไม่พบ token การยืนยันตัวตน");
        setLoading(false);
        return;
      }

      const id = params.id as string;
      await updateExhibition(id, formData, token);
      router.push("/exhibitions");
    } catch (error: any) {
      console.error("Error updating exhibition:", error);
      setError(error.message || "ไม่สามารถอัปเดตนิทรรศการได้");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!token) {
        setError("ไม่พบ token การยืนยันตัวตน");
        setLoading(false);
        return;
      }

      const id = params.id as string;
      await deleteExhibition(id, token);
      router.push("/exhibitions");
    } catch (error: any) {
      console.error("Error deleting exhibition:", error);
      setError(error.message || "ไม่สามารถลบนิทรรศการได้");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Quota") || name === "durationDay"
          ? parseInt(value) || 0
          : value,
    }));
  };

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
    );
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <nav className="mb-8">
            <Link
              href="/exhibitions"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              กลับไปหน้านิทรรศการ
            </Link>
          </nav>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-white">แก้ไขนิทรรศการ</h1>
                  <p className="text-blue-100 mt-1">จัดการข้อมูลนิทรรศการ</p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg"
                >
                  ลบนิทรรศการ
                </button>
              </div>
            </div>

            <div className="p-8">

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Exhibition Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-900"
              >
                ชื่อนิทรรศการ *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"
                placeholder="กรอกชื่อนิทรรศการ"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-900"
              >
                รายละเอียด *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm resize-none"
                placeholder="กรอกรายละเอียดของนิทรรศการ"
              />
            </div>

            {/* Venue */}
            <div>
              <label
                htmlFor="venue"
                className="block text-sm font-semibold text-gray-900"
              >
                สถานที่จัดงาน *
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                required
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"
                placeholder="กรอกสถานที่จัดงาน"
              />
            </div>

            {/* Date and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-semibold text-gray-900"
                >
                  วันเริ่มงาน *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="durationDay"
                  className="block text-sm font-semibold text-gray-900"
                >
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"
                  placeholder="จำนวนวัน"
                />
              </div>
            </div>

            {/* Booth Quotas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="smallBoothQuota"
                  className="block text-sm font-semibold text-gray-900"
                >
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label
                  htmlFor="bigBoothQuota"
                  className="block text-sm font-semibold text-gray-900"
                >
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Poster Picture URL */}
            <div>
              <label
                htmlFor="posterPicture"
                className="block text-sm font-semibold text-gray-900"
              >
                URL รูปโปสเตอร์
              </label>
              <input
                type="url"
                id="posterPicture"
                name="posterPicture"
                value={formData.posterPicture}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            {/* Total Booths Display */}
            {(formData.smallBoothQuota > 0 || formData.bigBoothQuota > 0) && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-800">
                  จำนวนบูธทั้งหมด:{" "}
                  <span className="text-lg">{formData.smallBoothQuota + formData.bigBoothQuota}</span> บูธ
                </p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
              <Link
                href="/exhibitions"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                ยกเลิก
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    กำลังอัปเดต...
                  </span>
                ) : (
                  "อัปเดตนิทรรศการ"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900">
                    ยืนยันการลบ
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  คุณแน่ใจหรือไม่ที่จะลบนิทรรศการ <strong>"{exhibition?.name}"</strong>?
                  การกระทำนี้ไม่สามารถย้อนกลับได้
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        กำลังลบ...
                      </span>
                    ) : (
                      "ลบ"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
