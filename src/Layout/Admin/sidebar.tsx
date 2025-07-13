"use client";

import {
  EditOutlined,
  PoweroffOutlined,
  RadarChartOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useDarkMode } from "../../lib/context/DarkModeContext";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import logoBps from "../../../public/bps.svg"

type SidebarProps = {
  vision: boolean;
  setVision: (val: boolean) => void;
};

export default function Sidebar({ vision, setVision }: SidebarProps) {
  const path = usePathname();
  const { dark } = useDarkMode();

  return (
    <aside
      className={`
        ${dark ? "bg-gray-800 text-white" : "bg-white text-black"} 
        min-h-screen pt-5 pl-5 w-1/2 sm:w-1/5 md:w-1/5 
        fixed md:static 
        top-0 left-0 
        transition-all duration-300 ease-in-out
        ${vision ? "z-50 translate-x-0 mt-10 md:mt-0" : "-translate-x-full"} 
        md:translate-x-0 
        ${vision ? "block" : "hidden"} md:block
        shadow-md md:shadow-none 
      `}
    >
      <div className="w-full mb-5">
        <Link href="/">
          <Image
            src={logoBps}
            alt="logo bps"
            width={100}
            height={100}
            loading="lazy"
          />
        </Link>
      </div>
      <div className="mt-5">
        <div className="text-xs text-gray-500 mb-5">MENU</div>
        <div className="text-sm flex flex-col gap-8">
          <Link
            href="/dashboard"
            className={`${
              path === "/dashboard" ? "text-cyan" : ""
            } items-center`}
            onClick={() => setVision(false)}
          >
            <RadarChartOutlined className="mr-3" />
            Dashboard
          </Link>

          <Link
            href="/editfail"
            className={`${
              path === "/editfail" ? "text-cyan" : ""
            } items-center`}
            onClick={() => setVision(false)}
          >
            <EditOutlined className="mr-3" />
            Edit fail RAG
          </Link>

          <button
            className={`cursor-pointer items-center text-left`}
            onClick={() => {
              setVision(false); signOut({ callbackUrl: "/login" });
            }}
          >
            <PoweroffOutlined className="mr-3" />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
