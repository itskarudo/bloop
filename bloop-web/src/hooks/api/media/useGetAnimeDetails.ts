import httpClient from "@/lib/httpClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ServerError, ServerSuccess } from "bloop-utils/types";

export const useGetAnimeDetails = (listId: string, animeId: string) => {
  return useQuery<ServerSuccess, AxiosError<ServerError>>({
    queryKey: ["anime", animeId, listId],
    retry: false,
    queryFn: async ({ queryKey }) => {
      return (
        await httpClient.get<ServerSuccess>(
          `/media/anime/${queryKey[1]}/list/${queryKey[2]}`
        )
      ).data;
    },
  });
};
