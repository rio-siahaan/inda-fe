"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function FormComponent() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setError("Password tidak cocok!");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Terjadi kesalahan.");
        return;
      }

      setSuccess("Password berhasil diubah!");
      router.push("/login");
    } catch (error) {
      setError(`Terjadi kesalahan ${error}.`);
    }
  };

  return (
    <>
      <aside className="w-1/3 flex-col justify-center items-start gap-10">
        <p className="font-bold">Ganti Password</p>
        <p className="text-red-500">
          Harap masukkan kata sandi baru dan konfirmasi untuk menjaga keamanan akun Anda.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mt-5 justify-between">
            <label className="font-medium" htmlFor="new_password">Password baru</label>
            <input
              type="password"
              id="new_password"
              placeholder="Masukkan password baru Anda"
              className="border border-form-input rounded-lg px-4 py-2"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />

            <label className="font-medium" htmlFor="confirm_new_password">Konfirmasi password baru</label>
            <input
              type="password"
              id="confirm_new_password"
              placeholder="Konfirmasi password baru Anda"
              className="border border-form-input rounded-lg px-4 py-2"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />

            <button type="submit" className="button-blue text-white rounded-lg">Ubah password</button>
          </div>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </aside>
    </>
  );
}

export default function NewPasswordPage() {
  return (
    <section className="h-screen flex justify-around items-center">
      <Suspense fallback={<div>Memuat form...</div>}>
        <FormComponent />
      </Suspense>
      <aside>
        <Image
          className="md:block hidden"
          src="/email confirmation.png"
          alt="email confirmation"
          width={500}
          height={500}
          priority
        />
      </aside>
    </section>
  );
}
