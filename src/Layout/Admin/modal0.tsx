import { WarningOutlined } from "@ant-design/icons";

type ModalSatuProps = {
    setModal: (value: boolean) => void
    setStatus: (value: number) => void
}

export default function ModalNol({setModal, setStatus}: ModalSatuProps){
    return(
        <>
                <h2 className="mt-5 text-xl font-bold mb-4">Konfirmasi</h2>
                <p className="mb-5">
                  Apakah Anda yakin ingin memperbaharui dokumen sekarang? <br />
                  <span className="text-sm italic text-red-500">
                    diharapkan tidak reload halaman karena progres akan{" "}
                    <span className="font-bold">terhapus</span> <br />
                    <WarningOutlined /> persiapkan jaringan yang baik
                  </span>
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setModal(false)}
                    className="bg-gray-400 hover:bg-gray-500  px-4 py-2 rounded"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      // logika submit di sini
                      setStatus(1);
                    }}
                    className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded"
                  >
                    Lanjutkan
                  </button>
                </div>
              </>
    )
}