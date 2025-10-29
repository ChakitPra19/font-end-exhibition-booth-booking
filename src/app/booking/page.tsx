'use client'

import DateReserve from "@/components/DateReserve";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addBooking } from "@/redux/features/bookSlice";
import { BookingItem } from "../../../interface";

// import { getServerSession } from 'next-auth'
// import { authOptions } from "../api/auth/[...nextauth]/authOptions";
// import getUserProfile from "../../libs/getUserProfile";

export default function Booking() {
  // const [venue, setVenue] = useState("");
  // const session = await getServerSession(authOptions)
  // if(!session || !session.user.token) return null

  // const profile = await getUserProfile(session.user.token)
  // var createdAt = new Date(profile.data.createdAt)
  const [nameLastname, setNameLastname] = useState("");
  const [tel, setTel] = useState("");
  const [venue, setVenue] = useState("");
  const [bookDate, setBookDate] = useState<string>("");
  
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingData: BookingItem = {
      nameLastname,
      tel,
      venue,
      bookDate
    };
    
    dispatch(addBooking(bookingData));
    
    // Reset form
    setNameLastname("");
    setTel("");
    setVenue("");
    setBookDate("");
  };

  return (
    <main className="w-[100%] flex flex-col iterms-center space-y-4">
      {/* <div className="text-21">
        {profile.data.name}
      </div> */}
      {/* <table className="table-auto border-separate border-spacing-2"><tbody>
        <tr><td>Email</td><td>{profile.data.email}</td></tr>
        <tr><td>Tel.</td><td>{profile.data.tel}</td></tr>
        <tr><td>Member Since</td><td>{createdAt.toString()}</td></tr>
      </tbody></table> */}
      <div className="text-xl font-medium">Venue Booking</div>
      <form className="flex flex-col gap-6 max-w-md" onSubmit={handleSubmit}>
        <TextField
          name="Name-Lastname"
          label="Name-Lastname"
          variant="standard"
          value={nameLastname}
          onChange={(e) => setNameLastname(e.target.value)}
          required
        />
        <TextField
          name="Contact-Number"
          label="Contact-Number"
          variant="standard"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          required
        />
        <Select
          id="venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          required
        >
          <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
          <MenuItem value="Spark">Spark Space</MenuItem>
          <MenuItem value="GrandTable">The Grand Table</MenuItem>
        </Select>

        <div className="w-fit space-y-2">
        <div className="text-md text-left text-gray-600">
          Pick-Up Date and Location
        </div>
        <DateReserve onDateChange={(date: string) => setBookDate(date)} />
      </div>

      <Button type="submit" variant="contained">
        Book Venue
      </Button>
      </form>
    </main>
  );
}
