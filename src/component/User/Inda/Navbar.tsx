"use client"

import { useDarkMode } from "@/lib/context/DarkModeContext";
import { AppstoreOutlined, DoubleRightOutlined, LogoutOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";

type NavbarType = {
    sidebar : boolean,
    setSidebar : (visible : boolean) => void,
}

export default function NavbarInda({sidebar, setSidebar} : NavbarType){
  const {dark} = useDarkMode();
    return(
        <nav className={`flex justify-between items-center ${dark ? 'bg-gray-700' : 'bg-white-2'} py-4 px-6`}>
          <div className="flex gap-5">
            <button
              onClick={() => setSidebar(!sidebar)}
              className="cursor-pointer md:hidden"
            >
              {sidebar ? (
                <AppstoreOutlined className="" />
              ) : (
                <DoubleRightOutlined className="" />
              )}
            </button>
          </div>
          <button onClick={() => (
            signOut({callbackUrl: `/login`}))} className="flex justify-center items-center gap-2 cursor-pointer">
            <LogoutOutlined style={{ fontSize: "20px" }} />
          </button>
        </nav>
    )
}