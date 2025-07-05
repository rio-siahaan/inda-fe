"use client";

import TabelData from "@/component/Admin/TabelData";
import { useDarkMode } from "@/lib/context/DarkModeContext";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";

export default function EditFailLayout() {
  const { dark } = useDarkMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [proses, setProses] = useState(0);
  const [tahap, setTahap] = useState(0);
  const [json, setJson] = useState<any[]>([]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleMintaData = async (e: React.FormEvent) => {
    e.preventDefault();

    const batasBawah = parseInt(
      (document.getElementById("batasBawah") as HTMLInputElement)?.value
    );
    const batasAtas = parseInt(
      (document.getElementById("batasAtas") as HTMLInputElement)?.value
    );

    setLoading(true);
    setProses(0);
    setStatus("Mengirim permintaan ke server...");
    setJson([]);

    const totalSemua = batasAtas - batasBawah;
    try {
      const res = await fetch("/api/admin/fetchJson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batasAtas: batasAtas,
          batasBawah: batasBawah,
        }),
      });

      if (!res.body) throw new Error("No body in response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let progres = 0;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop()!; // keep last unfinished line

        for (const line of lines) {
          if (line.trim()) {
            const parsed = JSON.parse(line);
            setJson((prev) => [...prev, parsed]);

            progres += 1;
            setProses((progres / totalSemua) * 100);
          }
        }
      }

      setStatus("Selesai streaming data. Silahkan reload untuk melihat hasil");
      setLoading(false);
      setTahap(1);
    } catch (error) {
      console.error("Streaming error:", error);
      setStatus("Gagal streaming data.");
      setLoading(false);
    }
  };

  const jsonToCsv = () => {
    setProses(0);
    setStatus("Memulai konversi ke CSV...");
    setLoading(true);

    const evtSource = new EventSource("/api/admin/json_to_csv");

    evtSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.progress !== undefined) {
          setProses(data.progress);
          setStatus(data.message);
        }
      } catch {
        // ignore
      }
    };

    evtSource.addEventListener("done", () => {
      setStatus("Konversi JSON ke CSV selesai!");
      setLoading(false);
      setTahap(2);
      evtSource.close();
    });

    evtSource.addEventListener("error", () => {
      setStatus("Terjadi kesalahan saat konversi.");
      setLoading(false);
      evtSource.close();
    });
    setTahap(2);
    setStatus(
      "Dokumen telah dimasukkan ke Database. Silakan dicoba di halaman percakapan."
    );
  };

  const handleUpload = () => {
    setStatus("Memulai upload CSV ke vector DB...");
    setProses(0);
    setLoading(true);

    const evtSource = new EventSource("/api/admin/csv_to_vector");

    evtSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.totalUploaded !== undefined) {
          setStatus(`Sudah upload ${data.totalUploaded} batch...`);
        }
        if (data.progress !== undefined) {
          setProses(data.progress);
        }
      } catch {
        // ignore jika bukan JSON valid
      }
    };

    evtSource.addEventListener("done", () => {
      setStatus("Upload selesai!");
      setProses(100);
      setLoading(false);
      evtSource.close();
      setTahap(3);
    });

    evtSource.addEventListener("error", (e) => {
      console.error("SSE error event:", e);
      setError("Terjadi error saat upload vektor.");
      setLoading(false);
      evtSource.close();
    });

    // Set tahap 3 saat mulai upload supaya UI langsung berubah
    setTahap(3);
  };

  return (
    <div className={`${dark ? "bg-gray-500" : "bg-white"} min-h-screen p-4`}>
      <div className="grid grid-cols-12 gap-5">
        <div className="md:col-span-8">
          <TabelData />
        </div>
        <div
          className={`${dark ? "text-white" : "text-dark"} md:col-span-4 mt-12`}
        >
          <div className="font-bold text-xl">Minta data baru</div>
          {tahap == 0 && (
            <>
              <div className="font-medium">
                Silakan masukkan batas bawah dan batas atas permintaan
              </div>
              <form action="" onSubmit={(e) => handleMintaData(e)}>
                <div className="flex justify-between">
                  <input
                    type="number"
                    name="batasBawah"
                    id="batasBawah"
                    className={`w-1/3 rounded-lg border px-2 py-1
                ${
                  dark
                    ? "border-gray-200 focus:border-blue-300"
                    : "border-gray-800 focus:border-blue-600"
                }
                focus:outline-none`}
                    ref={inputRef}
                    required
                  />
                  sampai
                  <input
                    type="number"
                    name="batasAtas"
                    id="batasAtas"
                    className={`w-1/3 rounded-lg border px-2 py-1
                ${
                  dark
                    ? "border-gray-200 focus:border-blue-300"
                    : "border-gray-800 focus:border-blue-600"
                }
                focus:outline-none`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="mt-5 cursor-pointer p-2 button-cyan rounded-lg"
                >
                  Minta
                </button>
              </form>
            </>
          )}
          {tahap == 0 && loading && (
            <div className="mt-3 text-sm">
              <div className="text-blue-500 animate-pulse">{status}</div>
              <div className="mt-2 w-full bg-gray-300 rounded-full h-4">
                <div
                  className="bg-cyan h-4 rounded-full transition-all duration-300"
                  style={{ width: `${proses}%` }}
                ></div>
              </div>
              <div className="text-xs mt-1 text-right text-gray-600">
                {Math.round(proses)}%
              </div>
            </div>
          )}
          {tahap == 1 && (
            <>
              <p>{status}</p>
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
                onClick={() => {
                  jsonToCsv();
                }}
                disabled={loading}
              >
                Lanjutkan ke Konversi CSV
              </button>
            </>
          )}
          {tahap == 1 && loading && (
            <div className="mt-3 text-sm">
              <div
                className={`${dark ? "text-white" : "text-dark"} animate-pulse`}
              >
                {status}
              </div>
              <div className="mt-2 w-full bg-gray-300 rounded-full h-4">
                <div
                  className="bg-cyan h-4 rounded-full transition-all duration-300"
                  style={{ width: `${proses}%` }}
                ></div>
              </div>
              <div className="text-xs mt-1 text-right text-gray-600">
                {Math.round(proses)}%
              </div>
            </div>
          )}

          {tahap == 2 && (
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
              onClick={() => {
                handleUpload();
              }}
              disabled={loading}
            >
              Kirim ke Vector DB
            </button>
          )}
          {tahap == 2 && loading && (!error) &&  (
            <div className="mt-3 text-sm">
              <div
                className={`${dark ? "text-white" : "text-dark"} animate-pulse`}
              >
                {status}
              </div>
              <div className="mt-2 w-full bg-gray-300 rounded-full h-4">
                <div
                  className="bg-cyan h-4 rounded-full transition-all duration-300"
                  style={{ width: `${proses}%` }}
                ></div>
              </div>
              <div className="text-xs mt-1 text-right text-gray-600">
                {Math.round(proses)}%
              </div>
            </div>
          )}
          {tahap == 2 && error && 
          <div className="mt-3 text-sm">
              <div
                className="text-dark-300"
              >
                {error}
              </div>
            </div>
          }
          {tahap == 3 && (
            <div className="mt-3 text-sm">
              <div
                className={`${dark ? "text-white" : "text-dark"} animate-pulse`}
              >
                {status}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
