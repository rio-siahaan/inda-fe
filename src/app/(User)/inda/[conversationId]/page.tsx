"use client"

import { useState } from "react";
import SidebarInda from "@/component/User/Inda/Sidebar";
import NavbarInda from "@/component/User/Inda/Navbar";
import ChatInda from "@/component/User/Inda/Chat";
import { useDarkMode } from "@/lib/context/DarkModeContext";

export default function IndaChat() {
  const [sidebar, setSidebar] = useState(true);
  const {dark} = useDarkMode()

  return (
    <div className={`min-h-screen ${(dark) ? 'bg-dark-blue text-white' : 'bg-white-2 text-black'} flex`}>
      <SidebarInda sidebar={sidebar} setSidebar={setSidebar}/>

      <div className="flex flex-col h-screen w-full">
        <NavbarInda sidebar={sidebar} setSidebar={setSidebar}/>

        <ChatInda/>        
      </div>
    </div>
  );
}
