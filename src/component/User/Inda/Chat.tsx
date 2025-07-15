"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  LoadingOutlined,
  RobotOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDarkMode } from "../../../lib/context/DarkModeContext";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";
import Loading from "../../../component/Loading";
import { useChatHistory } from "../../../lib/hooks/useChatHistory";
import { useSession } from "next-auth/react";
import avatar from "../../../../public/avatar-2.jpg";

export default function ChatInda() {
  const { dark } = useDarkMode();
  const [input, setInput] = useState("");
  const { data: session } = useSession();
  const userImage = session?.user?.image;
  // const [chatLog, setChatLog] = useState<
  //   {
  //     role: string;
  //     message: string;
  //     responseTime: string;
  //     selectedModel: string;
  //   }[]
  // >([]);
  // const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("gemini");
  const bottomRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { chat, isLoading, mutate } = useChatHistory(conversationId);
  const [personifikasi, setPersonifikasi] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const fetchUser = async () => {
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
          setName(data.name || "");
        } else {
          console.error("Gagal ambil personifikasi:", data);
        }
      } catch (error) {
        console.error("Error fetch personifikasi:", error);
      }
    };
    fetchUser();
  }, [session]);

  //untuk ngirim ke fastapi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Input sudah dikirim");
    if (!input.trim()) return;
    if (!name || !personifikasi) {
      alert("Profil pengguna belum siap, mohon tunggu sebentar...");
      return;
    }

    // const userMessage = {
    //   role: "user",
    //   message: input,
    //   responseTime: "",
    //   selectedModel: "",
    // };
    // setChatLog((prev) => [...prev, userMessage]);
    // setLoading(true);
    const optimistic = [
      ...(chat ?? []),
      { role: "user", message: input, responseTime: "", selectedModel: "" },
    ];
    mutate(optimistic, false); // tampilkan langsung

    try {
      const response = await fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response_text: input,
          id_chat: conversationId,
          selectedModel: selectedModel,
          name: name,
          persona: personifikasi,
        }),
      });

      if (!response.body) {
        throw new Error("No response body from server");
      }

      const resJson = await response.json();

      if (!response.ok) {
        console.error(
          "Server returned error:",
          resJson?.error || "Unknown error"
        );
        throw new Error(resJson?.error || "Terjadi kesalahan.");
      }

      const { message, responseTime, model } = resJson;

      mutate(
        [
          ...optimistic,
          { role: "bot", message, responseTime, selectedModel: model },
        ],
        false
      );

      // const reader = response.body.getReader();
      // const decoder = new TextDecoder("utf-8");
      // const result = await response.json();
      // const { message, responseTime, model } = result;
      // const botMessage = { role: "bot", message: "" };
      // let fullMessage = "";

      // setChatLog((prev) => [...prev, botMessage]);

      // setChatLog((prev) => {
      //   const updated = [...prev];
      //   updated[updated.length - 1] = { ...botMessage, message: fullMessage };
      //   return updated;
      // });

      // setChatLog((prev) => [
      //   ...prev,
      //   {
      //     role: "bot",
      //     message: message,
      //     responseTime: responseTime,
      //     selectedModel: model,
      //   },
      // ]);
    } catch (error) {
      console.error("Error fetching chat:", error);
      // setChatLog((prev) => [
      //   ...prev,
      //   {
      //     role: "bot",
      //     message: "Terjadi kesalahan saat mengambil respons.",
      //     responseTime: "",
      //     selectedModel: "",
      //   },
      // ]);

      mutate([
        ...optimistic,
        {
          role: "bot",
          message: "Terjadi kesalahan saat mengambil respons.",
          responseTime: "",
          selectedModel: "",
        },
      ]);
    } finally {
      setInput("");
    }
  };

  const chatLog = chat?.length
    ? chat
    : [
        {
          role: "bot",
          message: `Halo ${name}, saya INDA siap membantu Anda hari ini.`,
          responseTime: "",
          selectedModel: "",
        },
      ];

  // const fetchChatHistory = async () => {
  //   try {
  //     const response = await fetch(
  //       `/api/chat/history?conversationId=${conversationId}`
  //     );
  //     if (!response.ok) {
  //       const text = await response.text();
  //       console.error("Server returned error page:", text);
  //       throw new Error("Gagal mengambil riwayat chat");
  //     }
  //     let history = await response.json();

  //     if (Array.isArray(history)) {
  //       if (history.length === 0) {
  //         setChatLog([
  //           {
  //             role: "bot",
  //             message: "Halo saya INDA! Ada yang bisa saya bantu?",
  //             responseTime: "0",
  //             selectedModel: "",
  //           },
  //         ]);
  //       } else {
  //         const cleanedHistory = history.map((item) => ({
  //           ...item,
  //           message: item.message.replace(/^data:\s*/, ""),
  //         }));
  //         setChatLog(cleanedHistory);
  //       }
  //     } else {
  //       console.error("Unexpected response format:", history);
  //       setChatLog([
  //         {
  //           role: "bot",
  //           message: "Riwayat chat tidak tersedia.",
  //           responseTime: "0 ms",
  //           selectedModel: "",
  //         },
  //       ]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching chat history:", error);
  //   }
  // };

  return (
    <>
      <div
        className={`flex-1 overflow-y-auto px-6 py-4 ${
          dark ? "bg-gray-500" : "bg-gray-200"
        }`}
      >
        {isLoading ? (
          <div className="h-1/2">
            <Loading />
          </div>
        ) : (
          <>
            {/* Pilihan model */}
            <div className="absolute mb-4">
              <p className="text-xs font-bold mb-1">Pilih Model</p>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className={`border border-gray-300 rounded px-2 py-2 text-sm ${
                  dark ? "bg-dark-blue text-white" : "bg-white text-gray-800"
                } cursor-pointer`}
              >
                <option value="gemini">Gemini</option>
                <option value="llama">LLaMA</option>
              </select>
            </div>

            <div className={`${dark ? "text-white" : "text-gray-600"} mt-20`}>
              {chatLog.map((chat, idx) => (
                <div
                  key={idx}
                  className={`w-full flex ${
                    chat.role === "user" ? "justify-end" : "justify-start"
                  } mb-5`}
                >
                  <div
                    className={`max-w-[70%] flex items-start gap-3 ${
                      chat.role === "user"
                        ? "flex-row-reverse ml-auto"
                        : "mr-auto"
                    }`}
                  >
                    {chat.role === "bot" && (
                      <RobotOutlined className="text-2xl mt-1" />
                    )}
                    {chat.role === "user" &&
                      (userImage ? (
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
                      ))}
                    {isLoading ? (
                      <div className="h-50">
                        <Loading />
                      </div>
                    ) : (
                      <div>
                        <div
                          className={`${
                            dark
                              ? "bg-gray-800 text-white"
                              : "bg-white text-gray-800"
                          }  text-justify p-5 rounded-lg shadow flex-col`}
                        >
                          <ReactMarkdown
                            components={{
                              strong: ({ children }) => (
                                <strong className="font-bold">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic">{children}</em>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc pl-6">{children}</ul>
                              ),
                              code: ({ children }) => (
                                <code className="bg-gray-200 px-1 rounded">
                                  {children}
                                </code>
                              ),
                            }}
                          >
                            {chat.message}
                          </ReactMarkdown>
                        </div>
                        {chat.role === "bot" && (
                          <div className="flex justify-between">
                            <p>
                              {chat.selectedModel == "gemini"
                                ? "Gemini"
                                : "Llama"}
                            </p>
                            <p>{chat.responseTime} ms</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isLoading && (
              <div className="flex flex-col gap-2">
                <div className="w-full flex justify-start mb-5">
                  <div className="max-w-[70%] flex items-start gap-3 mr-auto">
                    <RobotOutlined className="text-2xl animate-bounce mt-1" />
                    <div
                      className={`${
                        dark
                          ? "bg-dark-500 text-white"
                          : "bg-white text-gray-600"
                      } text-justify p-5 rounded-lg italic`}
                    >
                      <Loading />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>
      {/* </div> */}

      <form
        onSubmit={handleSubmit}
        className={`w-full px-4 py-3 ${dark ? "bg-gray-500" : "bg-gray-200"}`}
      >
        <div className="max-w-3xl mx-auto flex items-end gap-3 relative">
          <div className="flex-1 relative">
            <input
              type="text"
              id="input"
              placeholder=" "
              required
              className={`peer w-full border border-gray-300 rounded-lg px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 ${
                dark
                  ? "bg-gray-700 text-white border-gray-600"
                  : "text-gray-900"
              }`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <label
              htmlFor="input"
              className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Minta data atau diskusi
            </label>
          </div>
          <button
            type="submit"
            className={`p-2 rounded-lg transition ${
              dark
                ? "text-white bg-blue-600 hover:bg-blue-800"
                : "text-dark hover:bg-gray-300"
            } ${
              isLoading || !input.trim() || !name || !personifikasi
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-80 cursor-pointer"
            }`}
            disabled={isLoading || !input.trim() || !name || !personifikasi}
          >
            {isLoading ? (
              <LoadingOutlined />
            ) : (
              <SendOutlined style={{ fontSize: 20 }} />
            )}
          </button>
        </div>
      </form>
    </>
  );
}
