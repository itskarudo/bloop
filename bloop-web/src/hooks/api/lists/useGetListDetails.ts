import httpClient from "@/lib/httpClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  APIMedia,
  List,
  MediaLists,
  ServerError,
  ServerSuccess,
} from "bloop-utils/types";

type Result = {
  list: List & {
    listUsers: {
      archived: boolean;
    }[];
    listMedia: (MediaLists & {
      media: APIMedia;
    })[];
  };
};

export const useGetListDetails = (listId: string) => {
  return useQuery<ServerSuccess<Result>, AxiosError<ServerError>>({
    queryKey: ["listDetails", listId],
    queryFn: async ({ queryKey }) => {
      return (await httpClient.get<ServerSuccess>(`/lists/${queryKey[1]}`))
        .data;
    },
  });
};
