import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import httpClient from "@/lib/httpClient";

export const useRemoveList = () => {
  return useMutation<
    AxiosResponse<ServerSuccess>,
    AxiosError<ServerError>,
    string
  >({
    mutationFn: (listId: string) => {
      return httpClient.delete(`/lists/${listId}`);
    },
  });
};
