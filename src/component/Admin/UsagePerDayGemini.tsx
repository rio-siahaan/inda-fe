"use ciient";

import { useDarkMode } from "../../lib/context/DarkModeContext";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function UsagePerDayGemini() {
  const { dark } = useDarkMode();
  const [usage, setUsage] = useState<number>(0)
  const [loading, setLoading] = useState(true);
  const MAX_TOKENS = 1500;

  useEffect(() => {
    fetchToken();
    setLoading(false);
  }, []);

  const fetchToken = async () => {
    try {
      const res = await fetch("/api/admin/countUsagePerDayGemini", {
        method: "POST",
      });
      const { usage } = await res.json();
      if (
        typeof usage == "undefined" 
      ) {
        throw new Error("Tidak mendapatkan data dari API dengan baik");
      }
      if (usage) {
        setUsage(usage)
      }
    } catch (error) {
      console.error(
        "Terdapat kesalahan di token per day Gemini karena: ",
        error
      );
    }
  };

  const progress = Math.min((usage / MAX_TOKENS) * 100, 100);

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
            <p>Jumlah penggunaan harian: {usage}</p>
            <p className="mt-2 font-medium">
              Total penggunaan hari ini: {usage} dari 1.500 token
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
