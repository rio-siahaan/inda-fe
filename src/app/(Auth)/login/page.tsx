import LoginPage from "@/Layout/Auth/login";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Login",
  description: "Halaman Login INDA"
}

export default function Login(){
    return <LoginPage/>
}