import React from "react";
import { Input } from "@/components/ui/input";
import { toISODate, fromISODate } from "../utils/date";

export default function DateField({ date, setDate, placeholder = "Выберите дату" }) {
  return (
    <Input
      type="date"
      value={toISODate(date)}
      onChange={(e) => setDate(fromISODate(e.target.value))}
      placeholder={placeholder}
    />
  );
}
