import httpClient from "@/lib/httpClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ServerError, ServerSuccess, User } from "bloop-utils/types";

export const useGetUsers = (listId: string) => {
  return useQuery<
    ServerSuccess<{ users: Omit<User, "password">[] }>,
    AxiosError<ServerError>
  >({
    queryKey: ["listUsers", listId],
    queryFn: async ({ queryKey }) => {
      return (
        await httpClient.get<ServerSuccess>(`/lists/${queryKey[1]}/users`)
      ).data;
    },
  });
};
