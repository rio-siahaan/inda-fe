import RegisterPage from "../../../Layout/Auth/register";
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Register",
  description: "Halaman Register INDA"
}

export default function Register() {
    return(
        <RegisterPage/>
    )
}
