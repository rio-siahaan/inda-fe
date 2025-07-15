"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

export default function RegisterPage() {
  const namaRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    namaRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccess(false);
    setError("");
    setLoading(true);

    const nama = namaRef.current?.value;
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    const personifikasi = (
      document.getElementById("personifikasi") as HTMLInputElement
    )?.value;

    // 🔒 Validasi password minimal 5 karakter, ada huruf besar dan kecil
    const passwordValid =
      password &&
      password.length >= 5 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password);

    if (!passwordValid) {
      setError(
        "Password harus minimal 5 karakter dan mengandung huruf besar serta huruf kecil."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ nama, email, password, personifikasi }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setSuccess(true);
        window.location.href = "/login";
      } else {
        const data = await res.json();
        setError("Terdapat kesalahan : " + data.error);
      }
    } catch (error) {
      setError("Terjadi kesalahan jaringan.");
    }

    setLoading(false);
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-md">
        {success && (
          <p className="text-green-500 text-center text-sm mt-4">
            Register berhasil!
          </p>
        )}
        {error && (
          <p className="text-red-500 text-center text-sm mt-4">{error}</p>
        )}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-dark-blue text-white text-center py-6 px-4 rounded-t-xl">
            <h2 className="text-xl font-bold mb-1">Ayo mendaftar!</h2>
            <p className="text-sm">Segera mendaftar untuk melihat keajaiban!</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div className="relative">
              <input
                ref={namaRef}
                type="text"
                id="nama"
                placeholder=" "
                required
                className="peer w-full border-b-2 border-gray-300 bg-transparent text-sm text-gray-900 focus:border-blue-500 focus:outline-none pt-6 pb-2 placeholder-transparent"
              />
              <label
                htmlFor="nama"
                className="absolute left-0 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                Nama
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder=" "
                required
                className="peer w-full border-b-2 border-gray-300 bg-transparent text-sm text-gray-900 focus:border-blue-500 focus:outline-none pt-6 pb-2 placeholder-transparent"
              />
              <label
                htmlFor="email"
                className="absolute left-0 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                required
                className="peer w-full border-b-2 border-gray-300 bg-transparent text-sm text-gray-900 focus:border-blue-500 focus:outline-none pt-6 pb-2 placeholder-transparent"
              />
              <label
                htmlFor="password"
                className="absolute left-0 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                Password
              </label>

              {/* Toggle eye icon */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-4 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                id="personifikasi"
                placeholder=" "
                className="peer w-full border-b-2 border-gray-300 bg-transparent text-sm text-gray-900 focus:border-blue-500 focus:outline-none pt-6 pb-2 placeholder-transparent"
              />
              <label
                htmlFor="personifikasi"
                className="absolute left-0 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                Personifikasi
              </label>
            </div>

            {loading ? (
              <button
                disabled
                className="w-full bg-orange-400 text-white py-2 rounded-lg cursor-not-allowed"
              >
                <LoadingOutlined />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-2 rounded-lg"
              >
                Daftar
              </button>
            )}
          </form>

          <p className="text-center text-sm text-gray-700 pb-6">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
