"use client";

import Image from "next/image";
import Logo from "../../../component/User/Logo";
import {
  BulbFilled,
  BulbOutlined,
  EditOutlined,
  LoadingOutlined,
  RestOutlined,
} from "@ant-design/icons";
import { useDarkMode } from "../../../lib/context/DarkModeContext";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConversations } from "../../../lib/hooks/useConversation";
import Loading from "../../../component/Loading";
import avatar from "../../../../public/avatar-2.jpg";

type SidebarIndaProps = {
  sidebar: boolean;
  setSidebar: (value: boolean) => void;
};

export default function SidebarInda({ sidebar, setSidebar }: SidebarIndaProps) {
  const { dark, setDark } = useDarkMode();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;
  const router = useRouter();
  // const fetchedRef = useRef(false);
  const [showForm, setShowForm] = useState(false);
  const [personifikasi, setPersonifikasi] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const { conversations, isLoading, mutate } = useConversations(userId || "");

  // useEffect(() => {
  //   const fetchConversation = async () => {
  //     if (
  //       fetchedRef.current ||
  //       status !== "authenticated" ||
  //       !session?.user?.id
  //     ) {
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       const res = await fetch("/api/chat/startOrGetConversation", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           id: session?.user?.id,
  //         }),
  //       });

  //       const conversations = await res.json();

  //       if (Array.isArray(conversations)) {
  //         setSessionChat(conversations);
  //         fetchedRef.current = true;
  //       }
  //     } catch (error) {
  //       console.log("Tidak dapat menemukan percakapan karena ", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchConversation();
  // }, [status, session]);

  useEffect(() => {
    const fetchPersonifikasi = async () => {
      setLoading(true);
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/getProfile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session?.user?.email }),
        });
        const data = await res.json();

        if (res.ok) {
          setPersonifikasi(data.personifikasi || "");
        } else {
          console.error("Gagal ambil personifikasi:", data);
        }
      } catch (error) {
        console.error("Error fetch personifikasi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonifikasi();
  }, [showForm, session?.user?.email]);

  // const handleChangePersonification = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     const response = await fetch("/api/changeProfile", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: userName,
  //         personifikasi: personifikasi,
  //         email: userEmail,
  //       }),
  //     });
  //     router.refresh();
  //     if (!response.ok) {
  //       setStatus("Tidak dapat merubah personifikasi. Tolong coba lagi nanti!");
  //       return "";
  //     } else {
  //       await update({ personifikasi: personifikasi });
  //       setStatus("Sukses mengganti personifikasi");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAddSession = async () => {
    try {
      setLoading(true);
      if (!userId) return;
      const res = await fetch("/api/chat/session/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      const data = await res.json();
      await mutate();
      router.push(`/inda/${data.id}`);
      setSidebar(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSessionbyId = async (conversationId: string) => {
    try {
      setLoading(true);
      if (!userId) return;
      const res = await fetch("/api/chat/session/removeById", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, conversationId }),
      });

      const data = await res.json();
      await mutate();
      router.push(`/inda/${data.newConversationId}`);
      setSidebar(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAll = async () => {
    try {
      setLoading(true);
      if (!userId) return;
      const res = await fetch("/api/chat/session/removeAll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      await mutate();
      router.push(`/inda/${data.newConversationId}`);
      setSidebar(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {sidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}
      {sidebar }
      <div
        className={`fixed md:relative top-0 left-0 z-50 md:z-auto w-1/2 sm:w-2/5 md:w-1/5 min-h-screen px-4 py-6 transform transition-transform duration-300 ease-in-out ${
          sidebar ? "translate-x-0" : "hidden"
        } flex flex-col justify-between ${
          dark ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <Logo />

        {/* Chat List Section */}
        <div className="mt-5 h-1/2">
          <div className="flex justify-end mb-2">
            <button
              className="cursor-pointer text-xl hover:bg-gray-500 p-1 rounded-lg"
              onClick={handleAddSession}
              disabled={loading}
            >
              {loading ? (
                <LoadingOutlined />
              ) : (
                <EditOutlined title="Tambah percakapan" />
              )}
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-1">
            {loading ? (
              <div className="h-[50px]">
                <Loading />
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  className="flex justify-between items-center"
                  key={c.id}
                  onClick={() => setSidebar(false)}
                >
                  <a
                    href={`/inda/${c.id}`}
                    className="text-xs cursor-pointer hover:bg-gray-500 px-2 py-2 rounded-lg"
                  >
                    {c.title}
                  </a>
                  <button
                    className="cursor-pointer hover:bg-gray-500 px-2 py-2 rounded-lg"
                    title="Hapus percakapan"
                    onClick={() => handleRemoveSessionbyId(c.id)}
                  >
                    <RestOutlined />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex gap-5">
          <div className="flex flex-col w-full">
            {loading ? (
              <div className="h-[20px]">
                <Loading />
              </div>
            ) : (
              <button
                className="w-full cursor-pointer flex gap-3 items-center hover:bg-gray-500 p-2 rounded-lg mb-2"
                onClick={handleRemoveAll}
                disabled={loading}
              >
                <RestOutlined />
                <p className="text-xs">Hapus seluruh chat</p>
              </button>
            )}

            <button
              className="w-full cursor-pointer flex gap-3 items-center hover:bg-gray-500 p-2 rounded-lg mb-2"
              onClick={() => setDark(!dark)}
            >
              {dark ? <BulbOutlined /> : <BulbFilled />}
              <p className="text-xs">{dark ? "Mode gelap" : "Mode terang"}</p>
            </button>

            <div className="hover:bg-gray-500 p-2 rounded-lg mb-2 flex gap-2 items-center">
              {userImage ? (
                <Image
                  src={userImage}
                  alt="user"
                  width={30}
                  height={30}
                  className="rounded-full h-fit"
                />
              ) : (
                <Image
                  src={avatar}
                  alt="user"
                  width={30}
                  height={30}
                  className="rounded-full h-fit"
                />
              )}
              <p className="text-xs">{userName}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
