"use client";

import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import httpClient from "@/lib/httpClient";

export const useInviteUsers = (listId: string) => {
  return useMutation<
    AxiosResponse<ServerSuccess>,
    AxiosError<ServerError>,
    { usernames: string[] }
  >({
    mutationFn: (args) => {
      return httpClient.post(`/lists/${listId}/invite`, args);
    },
  });
};
