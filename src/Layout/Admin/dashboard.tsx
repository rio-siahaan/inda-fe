"use client";

import Card from "@/component/Admin/Card";
import LineChartBulanan from "@/component/Admin/LineChartBulanan";
import TokenPerDayGemini from "@/component/Admin/TokenPerDayGemini";
import { useDarkMode } from "@/lib/context/DarkModeContext";
import { useEffect, useState } from "react";
import TokenPerDayLlama from "@/component/Admin/TokenPerDayLlama";
import UsagePerDayGemini from "@/component/Admin/UsagePerDayGemini";
import UsagePerDayLlama from "@/component/Admin/UsagePerDayLlama";
import ResponsePerDayGemini from "@/component/Admin/ResponsePerDayGemini";
import ResponsePerDayLlama from "@/component/Admin/ResponsePerDayLlama";

export default function DashboardLayout() {
  const { dark } = useDarkMode() ?? {};
  const [totalUser, setTotalUser] = useState<{
    totalUsers: number;
    selisihUserPerMonth: number;
  }>({ totalUsers: -1, selisihUserPerMonth: 0 });
  const [totalFail, setTotalFail] = useState<{
    totalFail: number;
    selisihFailPerMonth: number;
  }>({ totalFail: -1, selisihFailPerMonth: 0 });
  const [totalMessages, setTotalMessages] = useState<{
    totalMessages: number;
    selisihTotalMessagesPerMonth: number;
  }>({ totalMessages: -1, selisihTotalMessagesPerMonth: 0 });
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([
      fetchTotalUser(),
      fetchTotalFail(),
      fetchTotalMessage(),
    ]);
  };
  const fetchTotalUser = async () => {
    try {
      const res = await fetch("/api/admin/countUser", { method: "POST" });
      const { total, selisihUserPerMonth } = await res.json();
      if (
        typeof total === "undefined" ||
        typeof selisihUserPerMonth === "undefined"
      ) {
        throw new Error("Data dari API total user tidak lengkap");
      }
      setTotalUser({
        totalUsers: total,
        selisihUserPerMonth: selisihUserPerMonth,
      });
    } catch (error) {
      console.error("Terjadi eror di fetchTotalUser: ", error);
      setError("Gagal menghitung jumlah pengguna");
    }
  };

  const fetchTotalFail = async () => {
    try {
      const res = await fetch("/api/admin/countFile", { method: "POST" });
      const { count, selisih } = await res.json();
      if (typeof count === "undefined" || typeof selisih === "undefined") {
        throw new Error("Data dari API total fail tidak lengkap");
      }
      setTotalFail({
        totalFail: count,
        selisihFailPerMonth: selisih,
      });
    } catch (error) {
      console.error("Terjadi masalah di fetch total fail: ", error);
      setError(`Gagal menghitung jumlah fail karena ${error}`);
    }
  };

  const fetchTotalMessage = async () => {
    try {
      const res = await fetch("/api/admin/countMessages", { method: "POST" });
      const { totalMessages, selisihMessagesPerMonth } = await res.json();
      if (
        typeof totalMessages === "undefined" ||
        typeof selisihMessagesPerMonth === "undefined"
      ) {
        throw new Error("Data dari API total Messages tidak lengkap");
      }
      setTotalMessages({
        totalMessages: totalMessages,
        selisihTotalMessagesPerMonth: selisihMessagesPerMonth,
      });
    } catch (error) {
      setError(`Gagal menghitung jumlah penggunaan karena ${error}`);
    }
  };

  return (
    <div className={`${dark ? "bg-gray-800" : "bg-white-2"} px-4 py-2 min-h-screen`}>
      {error && `Terjadi eror : ${error}`}
      <div className="grid grid-cols-12 gap-4 ">
        <div className="col-span-4 h-50 md:h-30">
          <Card
            judul="Jumlah pengguna"
            jumlah={totalUser.totalUsers}
            selisih={totalUser.selisihUserPerMonth}
            warna="blue"
          />
        </div>

        <div className="col-span-4 h-50 md:h-30">
          <Card
            judul="Jumlah Dokumen"
            jumlah={totalFail.totalFail}
            selisih={totalFail.selisihFailPerMonth}
            warna="blue"
          />
        </div>
        <div className="col-span-4 h-50 md:h-30">
          <Card
            judul="Jumlah penggunaan"
            jumlah={totalMessages.totalMessages}
            selisih={totalMessages.selisihTotalMessagesPerMonth}
            warna="orange"
          />
        </div>
      </div>
      <div className="mt-3">
        <LineChartBulanan />
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button
          className={`${selectedView == 1 ? "button-cyan" : "bg-transparent"} p-2 rounded-lg cursor-pointer ${dark ? "text-white" : "text-black"}`}
          onClick={() => setSelectedView(1)}
        >
          <p className={`text-sm`}>Token</p>
        </button>
        <button
          className={`${selectedView == 2 ? "button-orange" : "bg-transparent"} p-2 rounded-lg cursor-pointer ${dark ? "text-white" : "text-black"}`}
          onClick={() => setSelectedView(2)}
        >
          <p className={`text-sm`}>Penggunaan</p>
        </button>
        <button
          className={`${selectedView == 3 ? "button-gray" : "bg-transparent"} p-2 rounded-lg cursor-pointer ${dark ? "text-white" : "text-black"}`}
          onClick={() => setSelectedView(3)}
        >
          <p className={`text-sm`}>Waktu Respon</p>
        </button>
      </div>

      <hr className={`mt-2 ${dark ? "text-white" : "text-black"}`} />

      {selectedView == 1 && (
        <div className="grid md:grid-cols-12 gap-10 mt-5">
          <div
            className={`${
              dark ? "bg-gray-700" : "bg-white"
            } p-4 rounded-lg md:col-span-6`}
          >
            <TokenPerDayGemini />
          </div>
          <div
            className={`${
              dark ? "bg-gray-700" : "bg-white"
            } p-4 rounded-lg md:col-span-6`}
          >
            <TokenPerDayLlama />
          </div>
        </div>
      )}

      {selectedView == 2 && (
        <div className="grid md:grid-cols-12 gap-10 mt-5">
          <div
            className={`${
              dark ? "bg-gray-700" : "bg-white"
            } p-4 rounded-lg md:col-span-6`}
          >
            <UsagePerDayGemini />
          </div>
          <div
            className={`${
              dark ? "bg-gray-700" : "bg-white"
            } p-4 rounded-lg md:col-span-6`}
          >
            <UsagePerDayLlama />
          </div>
        </div>
      )}
      {selectedView == 3 && (
        <div className="grid md:grid-cols-12 gap-10 mt-5">
          <div
            className={`${
              dark ? "bg-gray-700" : "bg-white"
            } p-4 rounded-lg md:col-span-6`}
          >
            <ResponsePerDayGemini />
          </div>
          <div
            className={`${
              dark ? "bg-gray-700" : "bg-white"
            } p-4 rounded-lg md:col-span-6`}
          >
            <ResponsePerDayLlama />
          </div>
        </div>
      )}
    </div>
  );
}
