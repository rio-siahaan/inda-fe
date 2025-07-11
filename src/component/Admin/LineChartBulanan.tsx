"use client";

import { useDarkMode } from "../../lib/context/DarkModeContext";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LineChartBulanan = () => {
  const { dark } = useDarkMode();
  // const series = [
  //   {
  //     name: "Penggunaan Bulanan",
  //     data: [400, 600, 750, 900, 850, 1000, 1100, 1200, 1214, 1290, 1360, 1600],
  //   },
  // ];

  const [loading, setLoading] = useState(true);

  const [series, setSeries] = useState([
    {
      name: "Penggunaan bulanan",
      data: Array(12).fill(0),
    },
  ]);

  useEffect(() => {
    fetchUsage();
    setLoading(false);
  }, []);

  const fetchUsage = async () => {
    try {
      const res = await fetch("/api/admin/countUsagePerMonth", {
        method: "POST",
      });
      const { usage } = await res.json();
      if (typeof usage == "undefined") {
        throw new Error("Tidak mendapatkan data dari API dengan baik");
      }
      if (usage) {
        setSeries([{ name: "Penggunaan bulanan", data: usage }]);
      }
    } catch (error) {
      throw new Error(`Terdapat kesalahan di line chart karena ${error}`);
    }
  };

  const options = {
    chart: {
      id: "line-chart",
      toolbar: {
        show: false,
      },
      background: "transparent", // untuk menghindari white bg default
    },
    xaxis: {
      categories: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ],
      title: {
        text: "Periode",
        style: {
          color: dark ? "#ffffff" : "#000000",
        },
      },
      labels: {
        style: {
          colors: dark ? "#ffffff" : "#000000",
        },
      },
    },
    yaxis: {
      title: {
        text: "Jumlah Pengguna",
        style: {
          color: dark ? "#ffffff" : "#000000",
        },
      },
      labels: {
        style: {
          colors: dark ? "#ffffff" : "#000000",
        },
      },
    },
    stroke: {
      // curve: 'smooth'
    },
    colors: ["#1E90FF", "#FF7F50"],
  };

  return (
    <div
      className={`${
        dark ? "bg-gray-700" : "bg-white"
      } rounded-xl shadow-md p-5 w-full mt-6`}
    >
      <h3
        className={`${
          dark ? "text-white" : "text-black"
        } text-md font-semibold mb-3`}
      >
        Grafik Penggunaan Layanan
      </h3>
      {loading ? (
        <div className="h-30">
          <Loading />
        </div>
      ) : (
        <Chart options={options} series={series} type="line" height={300} />
      )}
    </div>
  );
};

export default LineChartBulanan;
