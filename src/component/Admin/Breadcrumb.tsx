"use client";

import { useDarkMode } from "../../lib/context/DarkModeContext";
import { RightOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const path = usePathname();
  const {dark} = useDarkMode()

  return (
    <div className={`flex flex-wrap gap-10 ${dark ? 'bg-gray-800' : 'bg-white-2'} p-4`}>
      <div className={`font-bold ${dark ? "text-white" : "text-black"}`}>
        {path === "/dashboard"
          ? "Dashboard"
          : path === "/neweditfail"
          ? "Edit fail"
          : path === "/editmodel"
          ? "Edit model"
          : ""}
      </div>
      <div className="flex gap-5 items-center">
        <p className={`text-sm ${dark ? "text-gray-200" : "text-gray-500"}`}>
          Admin
        </p>
        <div className={`text-sm ${dark ? "text-gray-200" : "text-gray-500"}`}>
          <RightOutlined
          />
        </div>
        <p className={`text-sm ${dark ? "text-gray-200" : "text-gray-500"}`}>
          {path === "/dashboard"
            ? "Dashboard"
            : path === "/neweditfail"
            ? "Edit fail"
            : path === "/editmodel"
            ? "Edit model"
            : ""}
        </p>
      </div>
    </div>
  );
}
