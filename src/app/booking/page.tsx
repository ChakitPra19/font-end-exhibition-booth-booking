"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Select, MenuItem, Button, FormControl, InputLabel, Divider, CircularProgress } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { Exhibition } from "../../../interface";

export default function CreateBooking() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const exhibitionId = searchParams.get("exhibitionId") || "";

  const { user, token } = useAuth(); // ใช้ token จาก context

  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [boothType, setBoothType] = useState("");
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load exhibition info
  useEffect(() => {
    if (!exhibitionId) return;

    const fetchExhibition = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/v1/exhibitions/${exhibitionId}`);
        if (!res.ok) throw new Error("Failed to fetch exhibition");
        const data = await res.json();
        setExhibition(data.data);
      } catch (err) {
        console.error(err);
        alert("Cannot load exhibition");
      } finally {
        setLoading(false);
      }
    };

    fetchExhibition();
  }, [exhibitionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !user) {
      alert("You must login first");
      return;
    }

    if (!exhibition) return;

    setSubmitting(true);

    const payload = {
      exhibition: exhibition._id,
      boothType,
      amount,
    };

    try {
      const res = await fetch("http://localhost:5001/api/v1/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Booking failed");
      }

      alert("Booking created successfully!");
      router.push("/mybooking");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!exhibition) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography variant="h6">ไม่พบนิทรรศการ</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" mt={10} px={3} pb={5}>
      <Card sx={{ width: 450, p: 1, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            จองบูธ
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <form onSubmit={handleSubmit}>
            {/* Exhibition (disabled) */}
            <TextField
              label="นิทรรศการ"
              fullWidth
              margin="normal"
              value={exhibition.name}
              disabled
            />

            {/* Booth Type */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="booth-label">ประเภทบูธ</InputLabel>
              <Select
                labelId="booth-label"
                label="ประเภทบูธ"
                value={boothType}
                onChange={(e) => setBoothType(e.target.value)}
                required
              >
                <MenuItem value="small">เล็ก</MenuItem>
                <MenuItem value="big">ใหญ่</MenuItem>
              </Select>
            </FormControl>

            {/* Amount */}
            <TextField
              label="จำนวนบูธ"
              type="number"
              fullWidth
              margin="normal"
              value={amount}
              inputProps={{ min: 1, max: 6 }}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={submitting}
            >
              {submitting ? "กำลังโหลด..." : "ตกลง"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
