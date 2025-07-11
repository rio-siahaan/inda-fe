"use client";

import {
  AppstoreOutlined,
  BulbFilled,
  BulbOutlined,
  DoubleRightOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import Admin from "./Admin";
import { useState } from "react";
import { useDarkMode } from "../../lib/context/DarkModeContext";
import { signOut } from "next-auth/react";

type HeaderProps = {
  sidebar: boolean;
  setSidebar: (visible: boolean) => void;
};

export default function Header({ sidebar, setSidebar }: HeaderProps) {
  const [adminMenu, setAdminMenu] = useState(false);
  const { dark, setDark } = useDarkMode();

  return (
    <>
      <nav
        className={`flex justify-between px-5 py-2 sticky top-0 z-50 items-center ${
          dark ? "bg-gray-800 text-white" : "bg-white text-dark"
        }`}
      >
        <button
          className="cursor-pointer md:hidden"
          onClick={() => setSidebar(!sidebar)}
        >
          {sidebar ? (
            <AppstoreOutlined className="text-xl" />
          ) : (
            <DoubleRightOutlined className="text-xl" />
          )}
        </button>
        <div className="hidden md:block"></div>
        <div className="flex gap-10">
          <button
            className="cursor-pointer"
            onClick={() => setDark(!dark)}
            title="Ubah mode"
          >
            {dark ? (
              <div className="flex items-center text-xs gap-2">
                <BulbOutlined /> <p>Mode gelap</p>
              </div>
            ) : (
              <div className="flex items-center text-xs gap-2">
                <BulbFilled /> <p>Mode terang</p>
              </div>
            )}
          </button>
          <button
            className="cursor-pointer"
            onClick={() => setAdminMenu(!adminMenu)}
          >
            <Admin />
          </button>
        </div>
      </nav>

      {/* Sticky Dropdown */}
      {adminMenu && (
        <div
          className={`fixed top-14 right-5 w-40 rounded-lg shadow-lg z-50 p-4 ${
            dark ? "bg-dark-blue text-white" : "bg-white text-black"
          }`}
        >
          {/* <button className="cursor-pointer flex items-center gap-3 w-full py-2 px-2 hover:bg-gray-100 dark:hover:bg-dark">
            <UserOutlined />
            <span>Profil</span>
          </button> */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="cursor-pointer flex items-center gap-3 w-full py-2 px-2 hover:bg-gray-100 dark:hover:bg-dark"
          >
            <PoweroffOutlined />
            <span>Keluar</span>
          </button>
        </div>
      )}
    </>
  );
}
