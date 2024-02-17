import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerResponse } from "bloop-utils/types";
import httpClient from "@/lib/httpClient";

export const useLogout = () => {
  return useMutation<ServerResponse, AxiosError<ServerResponse>>({
    mutationFn: () => {
      return httpClient.post("/auth/logout");
    },
  });
};
