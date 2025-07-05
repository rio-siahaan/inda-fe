"use client";

import { useDarkMode } from "@/lib/context/DarkModeContext";
import { FallOutlined, RiseOutlined } from "@ant-design/icons";
import Loading from "../Loading";

type CardProps = {
  judul: string;
  jumlah: number;
  selisih: number;
  warna: "blue" | "cyan" | "orange";
};

export default function Card({ judul, jumlah, selisih }: CardProps) {
  const { dark } = useDarkMode();

  return (
    <div
      className={`${
        dark ? "bg-gray-700" : ""
      } rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow`}
      style={{height: "inherit"}}
    >
      <p
        className={`text-xs font-bold ${dark ? "text-gray-300" : "text-black"}`}
      >
        {judul}
      </p>
      {jumlah < 0 ? (
        <div className="h-15">
          <Loading />
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <p
              className={`text-2xl font-semibold ${
                dark ? "text-white" : "text-black"
              }`}
            >
              {jumlah.toLocaleString("id-ID")}
            </p>
            {selisih < 0 ? (
              <FallOutlined className="text-orange font-bold text-4xl" />
            ) : selisih > 0 ? (
              <RiseOutlined className="text-cyan font-bold text-4xl" />
            ) : (
              <p></p>
            )}
          </div>

          <p className={`text-xs ${dark ? "text-white" : "text-black"}`}>
            {selisih < 0 ? (
              <>
                Terdapat penurunan sebesar{" "}
                <span className={`font-bold`}>
                  {Math.abs(selisih).toLocaleString("id-ID")}
                </span>{" "}
                dari bulan lalu.
              </>
            ) : selisih == 0 ? (
              <>Tidak ada peningkatan dari bulan lalu.</>
            ) : (
              <>
                Terdapat peningkatan sebesar{" "}
                <span className={`font-bold`}>
                  {selisih.toLocaleString("id-ID")}
                </span>{" "}
                dari bulan lalu.
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}
