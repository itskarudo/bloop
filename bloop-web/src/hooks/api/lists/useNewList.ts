"use client";

import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import * as z from "zod";
import { listsSchema } from "bloop-utils/validation";
import httpClient from "@/lib/httpClient";

export type NewListArgs = z.infer<typeof listsSchema>;

export const useNewList = () => {
  return useMutation<
    AxiosResponse<ServerSuccess>,
    AxiosError<ServerError>,
    NewListArgs
  >({
    mutationFn: (args: NewListArgs) => {
      return httpClient.post("/lists", args);
    },
  });
};
