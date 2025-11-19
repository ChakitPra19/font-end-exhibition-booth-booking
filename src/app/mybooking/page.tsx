"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Divider
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { Booking } from "../../../interface";

export default function MyBooking() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch bookings
  useEffect(() => {
    if (!token || !user) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5001/api/v1/booking", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data.data || []);
      } catch (err) {
        console.error(err);
        alert("Cannot load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, user]);

  const handleEdit = (id: string) => {
    router.push(`/booking/edit?bookingId=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    setDeletingId(id);

    try {
      const res = await fetch(`http://localhost:5001/api/v1/booking/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete booking");

      setBookings((prev) => prev.filter((b) => b._id !== id));
      alert("Booking deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!bookings.length) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography variant="h5" sx={{ color: "#000" }}>
          ไม่พบข้อมูลการจอง
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={5} px={3} pb={5}>
      <Typography variant="h4" mb={3} sx={{ color: "#000" }}>
        การจองทั้งหมด
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {bookings.map((booking) => {
          let exhibitionName = "Unknown Exhibition";
          let exhibitionStartDate = "No date";
          if (booking.exhibition && typeof booking.exhibition === "object") {
            exhibitionName = booking.exhibition.name ?? "Unknown Exhibition";
            exhibitionStartDate = booking.exhibition.startDate
              ? new Date(booking.exhibition.startDate).toLocaleDateString()
              : "No date";
          }

          const boothType = booking.boothType
            ? booking.boothType.charAt(0).toUpperCase() + booking.boothType.slice(1)
            : "N/A";

          let bookedByName = "N/A";
          let bookedByEmail = "N/A";
          if (booking.user && typeof booking.user === "object") {
            bookedByName = booking.user.name ?? "N/A";
            bookedByEmail = booking.user.email ?? "N/A";
          }

          return (
            <Box
              key={String(booking._id)}
              sx={{
                flex: { xs: '1 1 100%', md: '1 1 48%' },
                minWidth: { xs: '100%', md: '48%' },
                boxSizing: 'border-box',
              }}
            >
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {exhibitionName}
                  </Typography>
                  <Typography>ประเภทบูธ: {boothType === "Small" ? "เล็ก" : boothType === "Big" ? "ใหญ่" : boothType}</Typography>
                  <Typography>จำนวนบูธ: {booking.amount}</Typography>
                  <Typography>วันที่: {exhibitionStartDate}</Typography>

                  {user?.role === "admin" && (
                    <Typography>
                      จองโดย: {bookedByName} ({bookedByEmail})
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleEdit(String(booking._id))}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(String(booking._id))}
                      disabled={deletingId === booking._id}
                    >
                      {deletingId === booking._id ? "กำลังโหลด..." : "ลบ"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
