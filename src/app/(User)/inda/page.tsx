"use client";

import { useState } from "react";
import SidebarInda from "@/component/User/Inda/Sidebar";
import NavbarInda from "@/component/User/Inda/Navbar";
import { useDarkMode } from "@/lib/context/DarkModeContext";

export default function IndaRedirect() {
  const [sidebar, setSidebar] = useState(true);
  const { dark } = useDarkMode();

  return (
    <div
      className={`min-h-screen ${
        dark ? "bg-gray-600 text-white" : "bg-white-2 text-black"
      } flex`}
    >
      <SidebarInda sidebar={sidebar} setSidebar={setSidebar} />

      <div className="flex flex-col h-screen w-full">
        <NavbarInda sidebar={sidebar} setSidebar={setSidebar} />

        <div className="flex justify-center items-center h-screen">
          Pilih percakapan Anda!
        </div>
      </div>
    </div>
  );
}
