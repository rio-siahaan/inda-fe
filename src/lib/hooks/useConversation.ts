import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)));

export const useConversations = (userId?: string) => {
  const { data, error, isLoading, mutate } = useSWR<
    { id: string; title: string }[]
  >(userId ? `/api/chat/conversations?userId=${userId}` : null, fetcher, {
    dedupingInterval: 10_000,
  });

  return {
    conversations: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
};
