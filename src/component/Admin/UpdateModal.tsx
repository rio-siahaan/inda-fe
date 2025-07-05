import { useDarkMode } from "@/lib/context/DarkModeContext";
import { useState } from "react";

export default function InputBatasVar(){
    const dark = useDarkMode()
    const [status, setStatus] = useState<number>(1)
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`bg-white ${
              dark ? "bg-gray-800 text-white" : "text-black"
            } rounded-lg p-6 w-[90%] max-w-md shadow-lg`}
          >
            <h2 className="text-xl font-bold mb-4">Konfirmasi</h2>
            <p className="mb-6">
              Apakah Anda yakin ingin memperbaharui dokumen sekarang?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setStatus(0)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  // logika submit di sini
                  setStatus(0);
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
    )
}