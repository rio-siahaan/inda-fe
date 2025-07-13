import Link from "next/link";
import Image from "next/image";
import notFound from "../../public/404.png"

export default function NotFound() {
    return (
        <section className="h-screen block md:flex justify-center items-center py-20">
            <div className="gap-10">
                <p className="font-bold text-center">404 - Not Found</p>
                <p className="font-normal text-center">
                    Halaman yang Anda cari tidak ditemukan!
                </p>
                <p className="text-center">Kembali ke <Link href="/" className="no-underline hover:underline text-cyan">Halaman Awal</Link></p>
            </div>
            <Image src={notFound} alt="404" width={500} height={500}/>
        </section>
    );
}