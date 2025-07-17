"use client"

import { useState } from "react";
// import SidebarInda from "@/component/User/Inda/Sidebar";
import SidebarInda from "../../../../component/User/Inda/Sidebar";
// import NavbarInda from "@/component/User/Inda/Navbar";
import NavbarInda from "../../../../component/User/Inda/Navbar";
// import ChatInda from "@/component/User/Inda/Chat";
import ChatInda from "../../../../component/User/Inda/Chat";

export default function IndaChat() {
  const [sidebar, setSidebar] = useState(true);

  return (
    <div className={`flex`}>
      <SidebarInda sidebar={sidebar} setSidebar={setSidebar}/>

      <div className="flex flex-col h-screen w-full">
        <NavbarInda sidebar={sidebar} setSidebar={setSidebar}/>

        <ChatInda/>        
      </div>
    </div>
  );
}
