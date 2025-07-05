"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  GoogleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { push } = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccess(false);
    setError("");
    setLoading(true);

    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: callbackUrl,
    });

    if (res?.error) {
      setError("Email atau password Anda salah");
    } else {
      setSuccess(true);
      push(callbackUrl);
    }

    setLoading(false);
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100 p-10">
      <div className="w-full max-w-sm">
        {success && (
          <p className="text-green-500 text-center text-sm mb-3">
            Login sukses!
          </p>
        )}
        {error && (
          <p className="text-red-500 text-center text-sm mb-3">{error}</p>
        )}
        <div className="bg-dark-blue rounded-t-xl text-white p-6 h-[20%] flex flex-col justify-center">
          <p className="font-bold text-center">Ayo mendaftar!</p>
          <p className="font-normal text-center">
            Segera mendaftar untuk melihat keajaiban!
          </p>
        </div>
        <div className="px-8 py-10 bg-white shadow-md rounded-xl">
          <form onSubmit={(e) => handleLogin(e)} className="space-y-6">
            <div className="relative">
              <input
                ref={emailRef}
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
            
            <div className="text-right">
              <Link
                href="/emailconfirmation"
                className="text-sm text-blue-500 hover:underline"
              >
                Lupa password
              </Link>
            </div>
            {loading ? (
              <button
                disabled
                className="w-full bg-green-500 text-white py-2 rounded-lg cursor-not-allowed"
              >
                <LoadingOutlined />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 transition text-white py-2 rounded-lg cursor-pointer"
              >
                Masuk
              </button>
            )}
          </form>

          <p className="text-center mt-6 text-sm">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-black hover:underline"
            >
              Daftar
            </Link>
          </p>

          <div className="mt-5 text-center text-sm text-gray-500">Atau</div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() =>
                signIn("google", {
                  callbackUrl: callbackUrl,
                  redirect: false,
                })
              }
              className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <GoogleOutlined style={{ fontSize: "20px" }} />
              <span className="text-sm font-medium">Masuk dengan Google</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
