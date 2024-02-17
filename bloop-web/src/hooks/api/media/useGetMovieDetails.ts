import httpClient from "@/lib/httpClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ServerError, ServerSuccess } from "bloop-utils/types";

export const useGetMovieDetails = (listId: string, movieId: string) => {
  return useQuery<ServerSuccess, AxiosError<ServerError>>({
    queryKey: ["movie", movieId, listId],
    retry: false,
    queryFn: async ({ queryKey }) => {
      return (
        await httpClient.get<ServerSuccess>(
          `/media/movie/${queryKey[1]}/list/${queryKey[2]}`
        )
      ).data;
    },
  });
};
