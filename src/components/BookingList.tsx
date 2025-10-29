"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { removeBooking } from "@/redux/features/bookSlice";
import { BookingItem } from "../../interface";
import { Button } from "@mui/material";

export default function BookingList() {
  const bookItems = useSelector((state: RootState) => state.bookSlice.bookItems);
  const dispatch = useDispatch<AppDispatch>();

  const handleRemove = (booking: BookingItem) => {
    dispatch(removeBooking(booking));
  };

  if (bookItems.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No Venue Booking
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-5 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Booking List</h2>
      {bookItems.map((booking, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ชื่อ-นามสกุล</p>
              <p className="font-semibold">{booking.nameLastname}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">หมายเลขติดต่อ</p>
              <p className="font-semibold">{booking.tel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">สถานที่จัดเลี้ยง</p>
              <p className="font-semibold">{booking.venue}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">วันที่จอง</p>
              <p className="font-semibold">{booking.bookDate}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemove(booking)}
            >
              ยกเลิกการจอง
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}