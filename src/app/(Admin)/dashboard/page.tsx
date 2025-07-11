
// import Breadcrumb from "@/component/Admin/Breadcrumb";
import DashboardLayout from "../../../Layout/Admin/dashboard";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Dashboard",
  description: "Dashboard admin INDA"
}

export default function Dashboard() {
  return (
    <div>
      <DashboardLayout />
    </div>
  );
}
