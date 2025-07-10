"use client";
import React, { useState } from "react";

type ModalDuaProps = {
  setStatus: (value: number) => void;
  csvFiles: { name: string; url: string }[];
  setModal: (value: boolean) => void;
};

export default function ModalDua({ setStatus, csvFiles, setModal }: ModalDuaProps) {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [sukses, setSukses] = useState(false)
  const fastApiUrl = process.env.NEXT_PUBLIC_FAST_API_URL

  const handleSendToFastAPI = async () => {
    setLoading(true);
    setStatusText("Mengirim ke FastAPI...");

    for (const file of csvFiles) {
      try {
        // Ambil konten file CSV dari /tmp (API Next.js sudah generate ke sini)
        const res = await fetch(file.url);
        const csvText = await res.text();

        // Kirim isi CSV ke FastAPI
        const apiRes = await fetch(`${fastApiUrl}/ingest`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: file.name,
            content: csvText,
          }),
        });

        if (!apiRes.ok) {
          throw new Error(`Gagal kirim ${file.name}`);
        }

        setStatusText(`✅ Berhasil kirim: ${file.name}`);
        setSukses(true)
      } catch (err) {
        console.error(err);
        setStatusText(`❌ Gagal kirim: ${file.name}`);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <h2 className="mt-5 text-xl font-bold mb-4">Hasil Konversi CSV</h2>

      {csvFiles.length > 0 ? (
        <div className="bg-gray-100 rounded-md p-4 max-h-64 overflow-y-auto">
          <ul className="text-sm space-y-3">
            {csvFiles.map((file, idx) => (
              <li
                key={idx}
                className="border-b border-gray-300 pb-2 flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">{file.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 italic mt-2">Belum ada file CSV yang tersedia.</p>
      )}

      {statusText && <p className="mt-4 text-sm text-gray-600">{statusText}</p>}

      <div className="flex justify-end gap-4 mt-6">
        {sukses ? 
        <button
        disabled={loading || csvFiles.length === 0}
        onClick={() => setModal(false)}
        className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded"
        >
          Tutup
        </button>
        :
        <>
        <button
        onClick={() => setStatus(1)}
        className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
        >
          Kembali
        </button>
        <button
        disabled={loading || csvFiles.length === 0}
        onClick={handleSendToFastAPI}
        className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded"
        >
          {loading ? "Mengirim..." : "Kirim ke Basis Data"}
        </button>
          </>
        }
      </div>
    </>
  );
}
