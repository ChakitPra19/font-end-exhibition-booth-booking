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
  Grid,
  Divider,
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
          No bookings found
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={5} px={3} pb={5}>
      <Typography variant="h4" mb={3} sx={{ color: "#000" }}>
        My Bookings
      </Typography>

      <Grid container spacing={2}>
        {bookings.map((booking) => {
          const exhibitionName = booking.exhibition?.name ?? "Unknown Exhibition";
          const exhibitionStartDate = booking.exhibition?.startDate
            ? new Date(booking.exhibition.startDate).toLocaleDateString()
            : "No date";

          const boothType = booking.boothType
            ? booking.boothType.charAt(0).toUpperCase() + booking.boothType.slice(1)
            : "N/A";

          const bookedByName = booking.user?.name ?? "N/A";
          const bookedByEmail = booking.user?.email ?? "N/A";

          return (
            <Grid item xs={12} md={6} key={booking._id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {exhibitionName}
                  </Typography>
                  <Typography>Booth Type: {boothType}</Typography>
                  <Typography>Amount: {booking.amount}</Typography>
                  <Typography>Exhibition Date: {exhibitionStartDate}</Typography>

                  {user?.role === "admin" && (
                    <Typography>
                      Booked By: {bookedByName} ({bookedByEmail})
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleEdit(booking._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(booking._id)}
                      disabled={deletingId === booking._id}
                    >
                      {deletingId === booking._id ? "Deleting..." : "Delete"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
