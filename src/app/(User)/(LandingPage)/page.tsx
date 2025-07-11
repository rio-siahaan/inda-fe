import LandingPage from "../../../Layout/User/landingpage";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Dashboard",
  description: "Halaman Landing Page INDA"
}

export default function Landing(){
    return <LandingPage/>
}