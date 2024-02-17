import httpClient from "@/lib/httpClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { List, ServerError, ServerSuccess } from "bloop-utils/types";

export const useGetLists = () => {
  return useQuery<ServerSuccess<{ lists: List[] }>, AxiosError<ServerError>>({
    queryKey: ["lists"],
    queryFn: async () => {
      return (await httpClient.get<ServerSuccess>("/lists")).data;
    },
  });
};
