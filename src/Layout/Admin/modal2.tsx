type ModalDuaProps = {
  setStatus: (value: number) => void;
  csvFiles: { name: string; url: string }[];
};

export default function ModalDua({ setStatus, csvFiles }: ModalDuaProps) {
  return (
    <>
      <h2 className="mt-5 text-xl font-bold mb-4">Hasil Konversi CSV</h2>

      {csvFiles.length > 0 ? (
        <ul className="text-sm space-y-2 max-h-60 overflow-y-auto">
          {csvFiles.map((file, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center border-b pb-1"
            >
              <span>{file.name}</span>
              <a
                href={file.url}
                download={file.name}
                className="text-blue-600 hover:underline"
              >
                Unduh
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Tidak ada file CSV ditemukan.</p>
      )}

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setStatus(0)}
          className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
        >
          Tutup
        </button>
      </div>
    </>
  );
}
