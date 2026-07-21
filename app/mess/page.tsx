import type { Metadata } from "next";
import { MessDashboard } from "./mess-dashboard";

export const metadata: Metadata = {
  title: "Today's Mess | Java Bites",
  description: "View today's SRMIST hostel mess dining menu dynamically.",
};

export default function MessPage() {
  return <MessDashboard />;
}
