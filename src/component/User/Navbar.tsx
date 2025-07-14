"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import {
  LoadingOutlined,
  MenuOutlined,
  PoweroffOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [userRole, setUserRole] = useState()
  const userImage = session?.user?.image;

  //  buat responsif
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    handleResize();
    if (session) getRole()

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  const getRole = async () => {
    try {
      const res = await fetch(`/api/getProfile?email=${session?.user?.email}`);
      const {role} = await res.json()
      if(role) setUserRole(role)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-dark-blue py-2 px-5 flex justify-between items-center transition-shadow duration-300 ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="text-white">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-5 items-center text-sm text-white">
          <Link href="/" className="hover:underline">
            Beranda
          </Link>
          <Link href="/#inda" className="hover:underline">
            INDA
          </Link>
          <Link href="/#kemampuan" className="hover:underline">
            Kemampuan
          </Link>
          <Link href={`/inda`} className="hover:underline">
            Percakapan
          </Link>
          {status == "authenticated" && userRole == "admin" && (
            <Link href={`/dashboard`} className="hover:underline">
              Dashboard
            </Link>
          )}
        </div>

        {/* Authenticated Dropdown */}
        {}
        {status === "loading" ? (
          <div className="text-white">
            <LoadingOutlined />
          </div>
        ) : status === "authenticated" ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex gap-2 items-center text-white cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Image
                src={userImage || ""}
                alt="user"
                width={24}
                height={24}
                className="rounded-full"
              />
              <p className="text-sm">Halo, {session.user?.name}</p>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-40 p-2 z-50">
                <button className="flex items-center gap-2 w-full py-2 px-3 hover:bg-gray-100 cursor-pointer">
                  <Link href="/profil" className="flex gap-2">
                    <UserOutlined />
                    <span>Profil</span>
                  </Link>
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: `/login` })}
                  className="flex items-center gap-2 w-full py-2 px-3 hover:bg-gray-100 cursor-pointer"
                >
                  <PoweroffOutlined />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex gap-3 text-sm text-white">
            <Link href="/login" className="button-cyan px-4 py-2 rounded-lg">
              Masuk
            </Link>
            <Link
              href="/register"
              className="button-orange px-4 py-2 rounded-lg"
            >
              Daftar
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <MenuOutlined
            className="hidden md:hidden text-white text-xl cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        )}
      </nav>

      {/* Mobile Slide Menu */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed right-0 h-full w-1/3 bg-white z-40 p-6 flex flex-col gap-4 shadow-lg"
        >
          <Link
            href={`/inda`}
            className="no-underline hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            INDA
          </Link>
          <Link
            href="/#kemampuan"
            className="no-underline hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Kemampuan
          </Link>
          <Link
            href={`/inda`}
            className="no-underline hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Percakapan
          </Link>
          {status == "unauthenticated" && (
            <>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="button-cyan py-2 text-center rounded-lg"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="button-orange py-2 text-center rounded-lg"
              >
                Daftar
              </Link>
            </>
          )}
          {status == "authenticated" && userRole == "admin" && (
            <Link
              href={`/dashboard`}
              className="no-underline hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
    </>
  );
}
