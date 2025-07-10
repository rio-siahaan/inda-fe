"use client";

// import { useSession } from "next-auth/react";
import { DarkModeProvider } from "@/lib/context/DarkModeContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

export default function ChatClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  // const { data: session, status } = useSession();

  // useEffect(() => {
  //   if (status === "loading") return;
  //   if (status === "authenticated" && session?.user?.id) {
  //     startOrGetConversation(session?.user?.id);
  //   }
  // }, [status, session]);

  // const startOrGetConversation = async (userId: string) => {
  //   try {
  //     const res = await fetch("/api/chat/startOrGetConversation", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ id: userId }),
  //     });
  //     if (!res.ok) {
  //       const text = await res.text();
  //       console.error("Response failed with:", text);
  //       throw new Error("Gagal memulai atau mendapatkan percakapan");
  //     }
  //     const data = await res.json();
  //     if (data.conversationId) {
  //       router.replace(`/inda/${data.conversationId}`);
  //     }
  //   } catch (error) {
  //     console.error("Gagal mendapatkan conversationId", error);
  //   }
  // };

  return (
    <DarkModeProvider>
      {/* <ConversationProvider initialId={data.conversationId}> */}
      {children}
      {/* </ConversationProvider> */}
    </DarkModeProvider>
  );
}
