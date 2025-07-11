"use client"

import Link from "next/link";
import Image from "next/image";
import Footer from "../../component/User/Footer";
import {
  AppstoreAddOutlined,
  ArrowRightOutlined,
  BulbOutlined,
  FundOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import Navbar from "../../component/User/Navbar";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <section className="h-screen bg-dark-blue flex justify-around items-center">
        <div className="w-3/4 md:w-1/3 flex flex-col justify-center items-start gap-10">
          <p className="font-extrabold text-white text-2xl">
            Statistik resmi dalam genggaman Anda!
          </p>
          <p className="font-normal text-white text-lg">
            Cukup ketik pertanyaan Anda, dan chatbot AI kami akan memberikan
            data yang Anda butuhkan dalam hitungan detik.
          </p>
          <Link
            href="/inda"
            className="button-orange text-white px-4 py-2 rounded-md mt-4 w-35 flex justify-between items-center gap-2"
          >
            Mulai chat
            <ArrowRightOutlined />
          </Link>
        </div>
        <div>
          <Image
            className="hidden md:block"
            src="/hero.svg"
            alt="Hero.png"
            width={500}
            height={500}
            priority
          />
        </div>
      </section>

      <section className="mt-10" id="inda">
        <div className="text-center">
          <p className="font-extrabold">INDA</p>
          <hr className="w-1/8 h-[2px] bg-dark-blue mx-auto my-4 border-none" />
          Intelligent Data Assistance
        </div>
        <div className="flex justify-around items-center">
          <p className="w-3/4 md:w-1/3 text-justify font-normal text-lg mt-5">
            INDA adalah sistem berbasis AI yang membantu Anda dalam menangani
            permintaan data BPS Provinsi Sumatera Utara dan konsultasi statistik
            resmi secara interaktif.
          </p>
          <Image
            className="hidden md:block"
            src="/indaLanding.png"
            alt="gambar INDA"
            width={400}
            height={400}
            priority
          />
        </div>
      </section>

      <section className="mt-10 px-2 md:px-15" id="kemampuan">
        <div className="text-center">
          <p className="font-extrabold">INDA</p>
          <hr className="w-1/8 h-[2px] bg-dark-blue mx-auto my-4 border-none" />
          Apa yang bisa INDA lakukan untuk Anda?
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-10">
          <p className="cols-span-1 text-justify flex flex-col gap-10 white-to-gray p-10 rounded-lg shadow-lg">
            <AppstoreAddOutlined
              className="justify-center"
              style={{ fontSize: "30px" }}
            />
            Menampilkan data tabel statis BPS Provinsi Sumatera Utara yang terus
            diperbaharui
          </p>
          <p className="cols-span-1 text-justify flex flex-col gap-10 white-to-gray p-10 rounded-lg shadow-lg">
            <PieChartOutlined
              className="justify-center"
              style={{ fontSize: "30px" }}
            />
            Mengambil kesimpulan deskriptif terhadap pola data secara otomatis
          </p>
          <p className="cols-span-1 text-justify flex flex-col gap-10 white-to-gray p-10 rounded-lg shadow-lg">
            <FundOutlined
              className="justify-center"
              style={{ fontSize: "30px" }}
            />
            Membantu dalam pengambilan keputusan berbasis data
          </p>
          <p className="cols-span-1 text-justify flex flex-col gap-10 white-to-gray p-10 rounded-lg shadow-lg">
            <BulbOutlined
              className="justify-center"
              style={{ fontSize: "30px" }}
            />
            Memberikan saran dan konsultasi statistik secara interaktif
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
