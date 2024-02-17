import httpClient from "@/lib/httpClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ServerError, ServerSuccess } from "bloop-utils/types";

export const useGetTVShowDetails = (listId: string, showId: string) => {
  return useQuery<ServerSuccess, AxiosError<ServerError>>({
    queryKey: ["tv-show", showId, listId],
    retry: false,
    queryFn: async ({ queryKey }) => {
      return (
        await httpClient.get<ServerSuccess>(
          `/media/tv-show/${queryKey[1]}/list/${queryKey[2]}`
        )
      ).data;
    },
  });
};
