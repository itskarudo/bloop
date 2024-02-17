import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ServerError, ServerSuccess } from "bloop-utils/types";
import * as z from "zod";
import { editProfileSchema } from "bloop-utils/validation";
import httpClient from "@/lib/httpClient";

export type EditProfileArgs = z.infer<typeof editProfileSchema>;

export const useEditProfile = () => {
  return useMutation<
    AxiosResponse<ServerSuccess>,
    AxiosError<ServerError>,
    EditProfileArgs
  >({
    mutationFn: async (args: EditProfileArgs) => {
      return (await httpClient.put("/profile", args)).data;
    },
  });
};
