import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import * as z from "zod";
import { registerSchema } from "bloop-utils/validation";
import httpClient from "@/lib/httpClient";

export type RegisterArgs = z.infer<typeof registerSchema>;

export const useRegister = () => {
  return useMutation<
    AxiosResponse<ServerSuccess>,
    AxiosError<ServerError>,
    RegisterArgs
  >({
    mutationFn: async (args: RegisterArgs) => {
      return (await httpClient.post("/auth/register", args)).data;
    },
  });
};
