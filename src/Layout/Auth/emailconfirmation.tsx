"use client";

import Image from "next/image";
import { useState } from "react";
import forgotPassword from "../../../public/forgot password.png"

export default function EmailConfirmationPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/reset/send-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.nessage || "Gagal mengirim email.");
        return;
      }

      setSuccess("Link reset telah dikirim ke email.");
    } catch (error) {
      setError(`Terjadi kesalahan karena ${error}.`);
    }
  };

  return (
    <section className="h-screen flex justify-around items-center">
      <aside className="w-3/4 md:w-1/3 flex-col justify-center items-start gap-10">
        <p className="font-bold">Lupa password</p>
        <p className="text-red-500">
          Masukkan email Anda untuk mereset password.
        </p>
        <form action="" method="post" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mt-5 justify-between">
            <label className="font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Masukkan Email Anda"
              className="border border-form-input rounded-lg px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="button-blue text-white rounded-lg py-2 cursor-pointer"
            >
              Kirim konfirmasi
            </button>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          {success && <p className="text-green-600 mt-2">{success}</p>}
        </form>
      </aside>
      <aside>
        <Image
          className="md:block hidden"
          src={forgotPassword}
          alt="forgot password"
          width={500}
          height={500}
        />
      </aside>
    </section>
  );
}
