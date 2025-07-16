"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  LoadingOutlined,
  RobotOutlined,
  SendOutlined,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!name) {
      alert("Profil pengguna belum siap, mohon tunggu sebentar...");
      return;
    }

    const optimistic = [
      ...(chat ?? []),
      { role: "user", message: input, responseTime: "", selectedModel: "" },
    ];
    mutate(optimistic, false);

    try {
      const response = await fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response_text: input,
          id_chat: conversationId,
          selectedModel,
          name,
          persona: personifikasi || "Dilayani dengan baik selayaknya pengguna layanan",
        }),
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson?.error || "Terjadi kesalahan.");
      }

      const { message, responseTime, model } = resJson;
      mutate([
        ...optimistic,
        { role: "bot", message, responseTime, selectedModel: model },
      ], false);

    } catch (error) {
      console.error("Error fetching chat:", error);
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

  return (
    <div className={`flex flex-col h-screen ${dark ? "bg-gray-500" : "bg-gray-200"}`}>
      {/* Header: Pilih model */}
      <div className="px-6 pt-4">
        <div className="flex justify-start mb-2">
          <div>
            <p className="text-xs font-bold mb-1">Pilih Model</p>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`border border-gray-300 rounded px-2 py-2 text-sm ${
                dark ? "bg-dark-blue text-white" : "bg-white text-gray-800"
              }`}
            >
              <option value="gemini">Gemini</option>
              <option value="llama">LLaMA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <div className={`${dark ? "text-white" : "text-gray-600"}`}>
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
                  <div>
                    <div
                      className={`${
                        dark
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-800"
                      } text-justify p-5 rounded-lg shadow`}
                    >
                      <ReactMarkdown
                        components={{
                          strong: ({ children }) => (
                            <strong className="font-bold">{children}</strong>
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
                      <div className="flex justify-between text-xs mt-1">
                        <p>{chat.selectedModel === "gemini" ? "Gemini" : "Llama"}</p>
                        <p>{chat.responseTime} ms</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className={`px-4 py-3 border-t ${dark ? "bg-gray-600" : "bg-gray-100"}`}
      >
        <div className="max-w-4xl mx-auto flex items-end gap-3">
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
              isLoading || !input.trim() || !name
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-80 cursor-pointer"
            }`}
            disabled={isLoading || !input.trim() || !name}
          >
            {isLoading ? <LoadingOutlined /> : <SendOutlined style={{ fontSize: 20 }} />}
          </button>
        </div>
      </form>
    </div>
  );
}
