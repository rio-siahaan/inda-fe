import { LoadingOutlined } from "@ant-design/icons";
import React, { useState } from "react";

type ModalSatuProps = {
  setStatus: (value: number) => void;
  setCsvFiles: (files: { name: string; url: string }[]) => void;
};

export default function ModalSatu({ setStatus, setCsvFiles }: ModalSatuProps) {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [jsonFiles, setJsonFiles] = useState<File[]>([]);

  const handleFile = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert(`File ${file.name} terlalu besar (maks 2MB).`);
      return;
    }

    if (file.type !== "application/json") {
      alert(`File ${file.name} bukan JSON.`);
      return;
    }

    if (jsonFiles.length >= 5) {
      alert("Maksimal 5 file JSON.");
      return;
    }

    try {
      setJsonFiles((prev) => [...prev, file]);
    } catch (e) {
      alert(`File ${file.name} tidak valid JSON karena ${e}.`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);

    files.forEach((file) => handleFile(file));
  };

  const handleUpload = async () => {
  setLoading(true);
  if (jsonFiles.length === 0) {
    alert("Belum ada file yang dipilih.");
    setLoading(false)
    return;
  }

  const formData = new FormData();
  jsonFiles.forEach((file) => formData.append("files", file));

  try {
    const res = await fetch(`/api/admin/convert-to-csv/`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Gagal mengonversi");

    const { results } = await res.json(); // ✅ hanya panggil json() satu kali

    const files = results
      .filter((r: any) => r.success)
      .map((r: any) => ({
        name: r.filename,
        url: `api/tmp-file?name=${r.filename}`, // 💡 atau sesuaikan jika dari GitHub
      }));

    setCsvFiles(files);
    setStatus(2);
  } catch (err) {
    alert(`Terjadi kesalahan saat konversi karena ${err}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <h2 className="mt-5 text-xl font-bold mb-4">Upload File JSON</h2>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed p-6 text-center rounded-lg ${
          dragOver ? "border-cyan-500 bg-cyan-50" : "border-gray-300"
        }`}
      >
        <p className="text-sm">
          {dragOver
            ? "Lepaskan file JSON di sini"
            : "Tarik dan lepas file JSON di sini"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (maks 2MB | hanya .json | maksimal 5 file)
        </p>
      </div>

      <div className="text-center mt-2">
        <span className="text-gray-200">Atau</span>
        <br />
        <input
          type="file"
          accept="application/json"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            files.forEach((file) => handleFile(file));
          }}
          className="cursor-pointer button-blue rounded-lg p-2 w-3/4"
        />
      </div>

      {/* Preview file */}
      {jsonFiles.length > 0 && (
        <div className="mt-5 text-sm text-left max-h-64 overflow-y-auto bg-gray-100 p-4 rounded">
          <p className="font-bold mb-2 text-black">Pratinjau JSON:</p>
          {jsonFiles.map((file) => (
            <div key={file.name} className="mb-3">
              <p className="font-semibold text-blue-700">{file.name}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={() => setStatus(0)}
          className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
        >
          Batal
        </button>
        <button
          disabled={loading}
          onClick={handleUpload}
          className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded"
        >
          {loading ? <LoadingOutlined /> : "Konversi ke CSV"}
        </button>
      </div>
    </>
  );
}
