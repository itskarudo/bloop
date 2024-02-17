import httpClient from "@/lib/httpClient";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  ServerSuccess,
  TMDBAnime,
  TMDBMovie,
  TMDBTVShow,
} from "bloop-utils/types";

export const useSearchMedia = (
  type: "movies" | "tv-shows" | "anime",
  query: string
) => {
  return useInfiniteQuery({
    queryKey: ["searchMedia", type, query],
    queryFn: async ({ queryKey, pageParam = 0 }) => {
      return (
        await httpClient.get<
          ServerSuccess<{
            total_results: number;
            results: (TMDBMovie | TMDBTVShow | TMDBAnime)[];
          }>
        >(`/media/search/${queryKey[1]}?query=${queryKey[2]}&page=${pageParam}`)
      ).data.data;
    },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return (lastPageParam + 1) * 60 < lastPage.total_results
        ? lastPageParam + 1
        : null;
    },
    initialPageParam: 0,
  });
};
