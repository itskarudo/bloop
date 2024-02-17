import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import httpClient from "@/lib/httpClient";

export const useRemoveMedia = () => {
  return useMutation<
    AxiosResponse<ServerSuccess>,
    AxiosError<ServerError>,
    { listId: string; mediaId: number }
  >({
    mutationFn: ({ listId, mediaId }) => {
      return httpClient.delete(`/lists/${listId}/media/${mediaId}`);
    },
  });
};
