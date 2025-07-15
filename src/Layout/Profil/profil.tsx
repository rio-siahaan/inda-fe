"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import avatar from "../../../public/avatar-2.jpg";

export default function ProfilLayout() {
  const { data: session, update, status } = useSession();
  const [name, setName] = useState("");
  const [persona, setPersona] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const email_user = session?.user?.email;
  const gambar_user = session?.user?.image;

  useEffect(() => {
    if (email_user) getProfile();
  }, [email_user]);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const getProfile = async () => {
    try {
      const profilUser = await fetch(`/api/getProfile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email_user }),
      });
      const { name, personifikasi } = await profilUser.json();
      if (name && personifikasi) {
        setName(name);
        setPersona(personifikasi);
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          personifikasi: persona,
          email: email_user,
        }),
      });

      router.refresh();

      if (!res.ok) {
        console.log("Status respons tidak ok karena ", res.status);
        setError(true);
      } else {
        await update({ name, personifikasi: persona });
        setSuccess(true);
      }
    } catch (error) {
      console.log("Terjadi eror: ", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return status === "loading" ? (
    <div className="w-full flex justify-center mt-20">
      <LoadingOutlined className="text-2xl text-blue-500" />
    </div>
  ) : (
    <div className="w-full max-w-3xl mx-auto mt-10 px-4">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 relative">
          <Image
            src={gambar_user || avatar}
            alt="User avatar"
            className="rounded-full object-cover"
            fill
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Profil Pengguna
        </h2>
      </div>

      {error && (
        <div className="bg-red-300 p-2 mb-2">
          <p>Terjadi kesalahan dalam mengubah profil Anda. Cobalah lain kali.</p>
        </div>
      )}
      {success && (
        <div className="bg-green-300 p-2 mb-2">
          <p>Sukses mengganti profil.</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="email"
            id="email"
            disabled
            value={email_user || ""}
            className="peer w-full border-b-2 border-gray-300 bg-gray-100 text-sm text-gray-700 focus:border-blue-500 focus:outline-none pt-6 pb-2 placeholder-transparent"
            placeholder="Email"
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
            ref={nameRef}
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="peer w-full border-b-2 border-gray-300 bg-transparent text-sm text-gray-900 focus:border-blue-500 focus:outline-none pt-6 pb-2 placeholder-transparent"
            placeholder="Nama Anda"
          />
          <label
            htmlFor="name"
            className="absolute left-0 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Nama Anda
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            id="personifikasi"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="peer w-full border-b-2 border-gray-300 bg-transparent text-sm text-gray-900 focus:border-blue-500 focus:outline-none pt-6 pb-2 placeholder-transparent"
            placeholder="Personifikasi Anda"
          />
          <label
            htmlFor="personifikasi"
            className="absolute left-0 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Personifikasi Anda
          </label>
        </div>

        <div className="flex gap-2 justify-end">
          <Link href="/">
            <button type="button" className="button-orange p-2 cursor-pointer rounded-lg">
              Kembali
            </button>
          </Link>
          <button
            type="submit"
            className="button-cyan p-2 cursor-pointer rounded-lg"
          >
            {loading ? <LoadingOutlined /> : "Ubah Profil"}
          </button>
        </div>
      </form>
    </div>
  );
}
