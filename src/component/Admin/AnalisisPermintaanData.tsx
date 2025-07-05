"use client"

import { useDarkMode } from "@/lib/context/DarkModeContext";

export default function AnalisisPermintaanData() {
  const { dark } = useDarkMode();
  return (
    <div className="w-full">
      <div className={`${dark ? "text-white" : "text-black"} font-bold`}>
        Analisis Permintaan Data
      </div>
      <div
        className={`${
          dark ? "bg-gray-800" : "bg-white"
        } shadow-md mt-6 border border-gray-300`}
      >
        <div className={`${dark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} p-5`}>
          <div className="grid grid-cols-12">
            <div className="col-span-10">
              <p className={`${dark ? "text-white" : "text-black"} text-xs`}>
                [Seri 2010] Indeks Perkembangan PDRB Atas Dasar Harga Berlaku
                menurut Pengeluaran
              </p>
            </div>
            <div className="col-span-2">
              <p
                className={`${
                  dark ? "text-white" : "text-black"
                } font-bold text-center text-sm`}
              >
                20
              </p>
            </div>
          </div>
        </div>
        <hr className="w-full text-gray-300" />

        <div className={`p-5 hover:bg-gray-100 ${dark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
          <div className="grid grid-cols-12">
            <div className="col-span-10">
              <p className={`${dark ? "text-white" : "text-black"} text-xs`}>
                [Seri 2010] Indeks Perkembangan PDRB Atas Dasar Harga Berlaku
                menurut Pengeluaran
              </p>
            </div>
            <div className="col-span-2">
              <p
                className={`${
                  dark ? "text-white" : "text-black"
                } font-bold text-center text-sm`}
              >
                20
              </p>
            </div>
          </div>
        </div>
        <hr className="w-full text-gray-300" />

        <div className={`${dark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} p-5`}>
          <div className="grid grid-cols-12">
            <div className="col-span-10">
              <p className={`${dark ? "text-white" : "text-black"} text-xs`}>
                [Seri 2010] Indeks Perkembangan PDRB Atas Dasar Harga Berlaku
                menurut Pengeluaran
              </p>
            </div>
            <div className="col-span-2">
              <p
                className={`${
                  dark ? "text-white" : "text-black"
                } font-bold text-center text-sm`}
              >
                20
              </p>
            </div>
          </div>
        </div>
        <hr className="w-full text-gray-300" />
      </div>
    </div>
  );
}
