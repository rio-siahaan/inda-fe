"use ciient";

import { useDarkMode } from "@/lib/context/DarkModeContext";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

export default function ResponsePerDayGemini() {
  const { dark } = useDarkMode();
  const [avgResponse, setAvgResponse] = useState<number>(0)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchToken();
    setLoading(false);
  }, []);

  const fetchToken = async () => {
    try {
      const res = await fetch("/api/admin/countResponsePerDayGemini", {
        method: "POST",
      });
      const { avgResponse } = await res.json();
      if (
        typeof avgResponse == "undefined" 
      ) {
        throw new Error("Tidak mendapatkan data dari API dengan baik");
      }
      if (avgResponse) {
        setAvgResponse(avgResponse)
      }
    } catch (error) {
      console.error(
        "Terdapat kesalahan di token per day Gemini karena: ",
        error
      );
    }
  };

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
            <p>Rata-rata lama waktu respons: {avgResponse} ms</p>
          </>
        )}
      </div>
    </div>
  );
}
