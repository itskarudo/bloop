import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import * as z from "zod";
import { loginSchema } from "bloop-utils/validation";
import httpClient from "@/lib/httpClient";

export type LoginArgs = z.infer<typeof loginSchema>;

export const useLogin = () => {
  return useMutation<ServerSuccess, AxiosError<ServerError>, LoginArgs>({
    mutationFn: async (args: LoginArgs) => {
      return (await httpClient.post("/auth/login", args)).data;
    },
  });
};
