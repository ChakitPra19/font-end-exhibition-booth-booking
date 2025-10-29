'use client'
import BookingList from "@/components/BookingList";

export default function MyBooking() {
  return (
    <main className="w-full min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">My Bookings</h1>
        <BookingList />
      </div>
    </main>
  );
}