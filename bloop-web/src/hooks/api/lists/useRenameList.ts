import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import httpClient from "@/lib/httpClient";

interface RenameListArgs {
  listId: string;
  title: string;
}

export const useRenameList = () => {
  return useMutation<
    AxiosResponse<ServerSuccess>,
    AxiosError<ServerError>,
    RenameListArgs
  >({
    mutationFn: ({ listId, title }) => {
      return httpClient.put(`/lists/${listId}`, { title });
    },
  });
};
