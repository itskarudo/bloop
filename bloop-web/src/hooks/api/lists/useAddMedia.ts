import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import * as z from "zod";
import { addMediaSchema } from "bloop-utils/validation";
import httpClient from "@/lib/httpClient";

export type AddMediaArgs = z.infer<typeof addMediaSchema>;

export const useAddMedia = () => {
  return useMutation<
    AxiosResponse<ServerSuccess>,
    AxiosError<ServerError>,
    { listId: string; args: AddMediaArgs }
  >({
    mutationFn: ({ listId, args }) => {
      return httpClient.post(`/lists/${listId}/media`, args);
    },
  });
};
