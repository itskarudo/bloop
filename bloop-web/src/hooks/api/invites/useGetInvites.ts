import httpClient from "@/lib/httpClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Invite, List, ServerError, ServerSuccess } from "bloop-utils/types";

interface GetInvitesResponse {
  invites: (Invite & {
    list: List;
    inviter: {
      username: string;
      image: string | null;
    };
  })[];
}

export const useGetInvites = () => {
  return useQuery<ServerSuccess<GetInvitesResponse>, AxiosError<ServerError>>({
    queryKey: ["invites"],
    queryFn: async () => {
      return (await httpClient.get<ServerSuccess>("/invites")).data;
    },
  });
};
