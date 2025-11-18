"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  // if (user) {
  //   router.push('/')
  //   return null
  // }
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log("Login form submitted with:", formData); // Debug

    try {
      await login(formData.email, formData.password);
      console.log("Login successful, redirecting..."); // Debug log

      // Use router.push instead of window.location.href to avoid full page reload
      router.push("/");
    } catch (error: any) {
      console.error("Login failed:", error); // Debug
      setError(error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="lg:grid lg:grid-cols-2">
            {/* Left side - Info */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 text-white">
              <div className="max-w-md mx-auto lg:max-w-none">
                <div className="text-center lg:text-left">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-6">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                    เข้าสู่ระบบ
                  </h1>
                  <p className="text-blue-100 text-lg mb-6">
                    เข้าสู่ระบบเพื่อจองบูธนิทรรศการ
                  </p>
                  <p className="text-blue-200 text-sm">
                    ยังไม่มีบัญชี?{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-white hover:text-yellow-200 transition-colors duration-300 underline underline-offset-4"
                    >
                      สมัครสมาชิกใหม่
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="p-8 lg:p-12">
              <form
                className="space-y-6 max-w-md mx-auto lg:max-w-none"
                onSubmit={handleSubmit}
              >
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  <div className="group">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                        อีเมล
                      </span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
                      placeholder="กรอกอีเมล"
                    />
                  </div>

                  <div className="group">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        รหัสผ่าน
                      </span>
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400"
                      placeholder="กรอกรหัสผ่าน"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                      <svg
                        className="h-6 w-6 text-white/70 group-hover:text-white transition-colors"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        กำลังเข้าสู่ระบบ...
                      </span>
                    ) : (
                      "เข้าสู่ระบบ"
                    )}
                  </button>
                </div>

                <div className="text-center pt-6">
                  <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors duration-300"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    กลับสู่หน้าหลัก
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
