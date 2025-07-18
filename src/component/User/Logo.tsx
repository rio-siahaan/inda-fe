import Image from "next/image"
import Link from "next/link"
import logoBps from "../../../public/bps.svg"

export default function Logo(){
    return(
        <Link href="/" className="flex items-center justify-center gap-5">
            <Image src={logoBps} alt="logo bps" width={30} height={30} priority/>
            <div className="">
                <p className="text-xs md:text-sm" style={{fontWeight:"bold"}}>INDA</p>
                <p className="italic text-xs md:text-sm">Intelligent Data Assistance</p>
            </div>
        </Link>
    )
}