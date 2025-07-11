"use client";

import TabelData from "../../component/Admin/TabelData";
import { useDarkMode } from "../../lib/context/DarkModeContext";
import { WarningOutlined } from "@ant-design/icons";
import { useState } from "react";
import KepalaModal from "./kepalaModal";
import ModalNol from "./modal0";
import ModalSatu from "./modal1";
import ModalDua from "./modal2";

export default function NewEditFailLayout() {
  const { dark } = useDarkMode();
  const [status, setStatus] = useState<number>(0);
  const [modal, setModal] = useState(false);
  const [csvFiles, setCsvFiles] = useState<{ name: string; url: string }[]>([]);

  return (
    <div
      className={`${
        dark ? "bg-gray-800" : "bg-white-2"
      } px-4 py-2 min-h-screen`}
    >
      <div className="flex flex-1 mt-5 gap-10">
        <div className="w-1/2">
          <TabelData />
        </div>
        <div className="">
          <p className={`${dark ? "text-white" : "text-black"} font-bold`}>
            Perbaharui Dokumen
          </p>
          <p
            className={`${
              dark ? "text-white" : "text-black"
            } text-sm italic mt-5`}
          >
            <span className="text-red-500">
              <WarningOutlined />
            </span>
            <br />
            Pembaruan dokumen untuk model RAG hanya dapat dilakukan satu kali
            dalam sehari. Pastikan data yang Anda unggah sudah final. <br />
            <span className="text-red-500 float-right">
              <WarningOutlined />
            </span>
          </p>
          <br />
          <button
            onClick={() => setModal(true)}
            className="button-cyan p-2 rounded-lg cursor-pointer float-right"
          >
            Mulai
          </button>
        </div>
      </div>
      {/* popup disini */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={` ${
              dark ? "bg-gray-800 text-white" : "bg-white text-black"
            } rounded-lg p-6 w-[90%] max-w-md shadow-lg`}
          >
            {/* kepalanya angka angka */}
            <KepalaModal status={status} />

            {/* isi modal status 0 */}
            {status == 0 && (
              <ModalNol setModal={setModal} setStatus={setStatus} />
            )}
            {/* selesai isi modal */}

            {/* isi modal status 1 */}
            {status == 1 && <ModalSatu setCsvFiles={setCsvFiles} setStatus={setStatus} />}
            {/* selesai isi modal */}

            {/* isi modal status 2 */}
            {status == 2 && (
              <ModalDua
                setModal={setModal}
                setStatus={setStatus}
                csvFiles={csvFiles}
              />
            )}
            {/* selesai isi modal */}
          </div>
        </div>
      )}
    </div>
  );
}
