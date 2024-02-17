import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import httpClient from "@/lib/httpClient";

export const useToggleEpisodeWatched = (
  type: "tv-show" | "anime",
  listId: string,
  mediaId: string,
  season: number,
  episode: number
) => {
  return useMutation<AxiosResponse<ServerSuccess>, AxiosError<ServerError>>({
    mutationFn: () => {
      return httpClient.put(`/media/${type}/${mediaId}/list/${listId}`, {
        season,
        episode,
      });
    },
  });
};
