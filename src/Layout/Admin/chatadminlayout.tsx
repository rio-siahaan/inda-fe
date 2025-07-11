"use client";

import Header from "../../component/Admin/Header";
import Sidebar from "../../Layout/Admin/sidebar";
import { DarkModeProvider } from "../../lib/context/DarkModeContext";
import { useState } from "react";

export default function ChatAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebar, setSidebar] = useState(false);

  return (
    <DarkModeProvider>
      <div className="flex min-h-screen">
        <Sidebar vision={sidebar} setVision={setSidebar} />
        <div className="flex-col w-full min-h-screen">
          <Header sidebar={sidebar} setSidebar={setSidebar} />
          <main className={`flex-1`}>{children}</main>
        </div>
      </div>
    </DarkModeProvider>
  );
}
