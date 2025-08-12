"use client";

import { useDarkMode } from "../../lib/context/DarkModeContext";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

type FileInfo = {
  name: string;
  created_at: string;
};

export default function TabelData() {
  const { dark } = useDarkMode();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5); 

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch("/api/admin/listJson", {
          method: "POST"
        });
        const data = await res.json();
        // console.log("Ini adalah data dari tabel data: ", data)
        setFiles(data.files || data || []);
      } catch (error) {
        console.error("Gagal fetch data file JSON", error);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  // Format ke Bulan Tahun (misal: "Agustus 2025")
  const formatBulanTahun = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  // Hitung index data untuk pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = files.slice(indexOfFirstRow, indexOfLastRow);

  // Total halaman
  const totalPages = Math.ceil(files.length / rowsPerPage);

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
                        <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                          NAMA
                        </th>
                        <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
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
                      ) : currentRows.length > 0 ? (
                        currentRows.map((item, idx) => (
                          <tr key={idx}>
                            <td
                              className={`align-top px-6 py-4 text-sm font-medium ${
                                dark ? "text-white" : "text-black"
                              }`}
                            >
                              <div
                                className="w-[250px] truncate overflow-hidden whitespace-nowrap"
                                title={item.name}
                              >
                                {item.name}
                              </div>
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm align-top ${
                                dark ? "text-white" : "text-black"
                              }`}
                            >
                              {formatBulanTahun(item.created_at)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className={`${
                              dark ? "text-white" : "text-black"
                            } align-top px-6 py-4 text-sm font-medium`}
                          >
                            Tidak ada data yang diambil
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="flex justify-center items-center mt-4 gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span>
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
