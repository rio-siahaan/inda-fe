"use client"

import Image from "next/image";
import { useSession } from "next-auth/react";
import avatar from "../../../public/avatar-2.jpg"

export default function Admin() {
  const {data : session} = useSession()
  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <Image
            src={avatar}
            alt="admin"
            width={30}
            height={30}
            className="rounded-full"
          />
          <p className="font-bold">{session?.user?.name}</p>
        </div>
      </div>
    </>
  );
}
