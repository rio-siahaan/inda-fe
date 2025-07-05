"use client";

import { useDarkMode } from "@/lib/context/DarkModeContext";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

type FileInfo = {
  filename: string;
  waktu_masuk: string;
};

export default function TabelData() {
  const { dark } = useDarkMode();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch("/api/admin/listJson");
        const data = await res.json();
        setFiles(data.files || []);
      } catch (error) {
        console.error("Gagal fetch data file JSON", error);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  return (
    <div className="w-full">
      <div className={`${dark ? "text-white" : "text-black"}`}>
        <p className="font-bold">
          Tabel Dokumen <span className="font-normal text-sm">saat ini</span>
        </p>
      </div>
      <div
        className={`${
          dark ? "bg-gray-800" : "bg-white"
        } shadow-md mt-6 border border-gray-300`}
      >
        <div
          className={`p-5 ${dark ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}
        >
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          NAMA
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                        >
                          TANGGAL MASUK
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={2} className="text-center py-4">
                            <LoadingOutlined
                              className={`${
                                dark ? "text-white" : "text-black"
                              }`}
                            />
                          </td>
                        </tr>
                      ) : files.length > 0 ? (
                        files.map((item) => (
                          <tr key={item.filename}>
                            <td
                              className={`align-top px-6 py-4 text-sm font-medium text-gray-800 ${
                                dark ? "text-white" : "text-black"
                              }`}
                            >
                              <div
                                className="w-[250px] truncate overflow-hidden whitespace-nowrap"
                                title={item.filename}
                              >
                                {item.filename}
                              </div>
                            </td>

                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm text-gray-800 align-top ${
                                dark ? "text-white" : "text-black"
                              }`}
                            >
                              {item.waktu_masuk}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className={`${
                              dark ? "text-white" : "text-black"
                            } align-top px-6 py-4 text-sm font-medium text-gray-800`}
                          >
                            Tidak ada data yang diambil
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-sm">
          dibaharui oleh : <span className="italic">"nama"</span>
        </p>
        <p className="text-sm">19-05-2020</p>
      </div>
    </div>
  );
}
