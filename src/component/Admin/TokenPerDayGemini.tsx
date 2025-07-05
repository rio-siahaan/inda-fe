"use ciient";

import { useDarkMode } from "@/lib/context/DarkModeContext";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function TokenPerDayGemini() {
  const { dark } = useDarkMode();
  const [gemini, setGemini] = useState<{
    totalUsage: number,
    totalInput: number;
    totalOutput: number;
  }>({ totalUsage: 0, totalInput: 0, totalOutput: 0 });
  const [loading, setLoading] = useState(true);
  const MAX_TOKENS = 1000000;

  useEffect(() => {
    fetchToken();
    setLoading(false);
  }, []);

  const fetchToken = async () => {
    try {
      const res = await fetch("/api/admin/countTokenPerDayGemini", {
        method: "POST",
      });
      const {totalUsage, totalInput, totalOutput } = await res.json();
      if (
        typeof totalInput == "undefined" ||
        typeof totalOutput == "undefined"
      ) {
        throw new Error("Tidak mendapatkan data dari API dengan baik");
      }
      if (totalInput && totalOutput) {
        setGemini({
          totalUsage: totalUsage,
          totalInput: totalInput,
          totalOutput: totalOutput,
        });
      }
    } catch (error) {
      console.error(
        "Terdapat kesalahan di token per day Gemini karena: ",
        error
      );
    }
  };

  const totalUsed = gemini.totalInput + gemini.totalOutput;
  const progress = Math.min((totalUsed / MAX_TOKENS) * 100, 100);

  return (
    <div className="w-full ">
      <div className={`${dark ? "text-white" : "text-black"}`}>
        {loading ? (
          <div className="flex justify-center items-center">
            <LoadingOutlined />
          </div>
        ) : (
          <>
            <div className="font-bold text-lg mb-2">Gemini Harian</div>
            <p>Rata-rata input token: {gemini.totalInput}</p>
            <p>Rata-rata output token: {gemini.totalOutput}</p>
            <p className="mt-2 font-medium">
              Total penggunaan hari ini: {totalUsed} dari 1.000.000 token
            </p>

            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 mt-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm mt-1">
              {progress.toFixed(2)}% dari kuota tercapai
            </p>
          </>
        )}
      </div>
    </div>
  );
}
