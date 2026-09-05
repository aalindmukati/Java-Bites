import type { Metadata } from "next";
import { MessDashboard } from "./mess-dashboard";

export const metadata: Metadata = {
  title: "Today's Mess | Java Bites",
  description: "You dont like this food anyway",
};

export default function MessPage() {
  return <MessDashboard />;
}
