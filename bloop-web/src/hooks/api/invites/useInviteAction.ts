"use client";

import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import httpClient from "@/lib/httpClient";

export const useInviteAction = (listId: string) => {
  return useMutation<
    AxiosResponse<ServerSuccess>,
    AxiosError<ServerError>,
    "accept" | "decline"
  >({
    mutationFn: (action) => {
      return httpClient.post(`/lists/${listId}/${action}-invite`);
    },
  });
};
