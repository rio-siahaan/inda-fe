import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)));

export const useChatHistory = (conversationId?: string) => {
  const { data, error, isLoading, mutate } = useSWR<
    {
      role: string;
      message: string;
      responseTime: string;
      selectedModel: string;
    }[]
  >(
    conversationId
      ? `/api/chat/history?conversationId=${conversationId}`
      : null,
    fetcher,
    {
      dedupingInterval: 5_000,
      keepPreviousData: true,
    }
  );

  return {
    chat: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
