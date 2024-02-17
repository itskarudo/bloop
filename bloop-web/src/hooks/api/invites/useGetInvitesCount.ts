import httpClient from "@/lib/httpClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ServerError, ServerSuccess } from "bloop-utils/types";

export const useGetInvitesCount = () => {
  return useQuery<number, AxiosError<ServerError>>({
    queryKey: ["invitesCount"],
    queryFn: async () => {
      const res = (await httpClient.get<ServerSuccess>("/invites/count")).data;
      return res.data.count;
    },
  });
};
