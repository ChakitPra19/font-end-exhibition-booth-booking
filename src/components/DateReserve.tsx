"use client";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Select, MenuItem } from "@mui/material";
import { Dayjs } from 'dayjs';

interface DateReserveProps {
  onDateChange: (date: string) => void;
}
export default function DateReserve({ onDateChange }: DateReserveProps) {
  const handleDateChange = (value: Dayjs | null) => {
    if (value) {
      onDateChange(value.format('YYYY-MM-DD'));
    }
  };

  return (
    <div className="bg-slate-100 rounded-lg space-x-5 space-y-2 w-fit px-10 py-5 flex flex-row justify-center">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker className="bg-white" onChange={handleDateChange}/>
      </LocalizationProvider>

      {/* <Select
        variant="standard"
        name="location"
        id="location"
        className="h-[2em] w-[200px]"
      >
        <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
        <MenuItem value="Spark">Spark Space</MenuItem>
        <MenuItem value="GrandTable">The Grand Table</MenuItem>
      </Select> */}
    </div>
  );
}
