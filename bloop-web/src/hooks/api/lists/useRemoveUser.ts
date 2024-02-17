import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import httpClient from "@/lib/httpClient";

export const useRemoveUser = () => {
  return useMutation<
    AxiosResponse<ServerSuccess>,
    AxiosError<ServerError>,
    { listId: string; userId: string }
  >({
    mutationFn: ({ listId, userId }) => {
      return httpClient.delete(`/lists/${listId}/users/${userId}`);
    },
  });
};
