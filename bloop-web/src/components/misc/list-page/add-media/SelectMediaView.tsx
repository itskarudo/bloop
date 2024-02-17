"use client";
import { useInView } from "react-intersection-observer";
import { APIMedia, TMDBAnime, TMDBMovie, TMDBTVShow } from "bloop-utils/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddMediaEntry from "./AddMediaEntry";
import { useCallback, useEffect, useRef } from "react";
import { useSearchMedia } from "@/hooks/api/media/useSearchMedia";
import { Skeleton } from "@/components/ui/skeleton";

type MediaType = "movies" | "tv-shows" | "anime";

const getTitle = (
  type: MediaType,
  media: TMDBMovie | TMDBTVShow | TMDBAnime
) => {
  if (type === "movies") return (media as TMDBMovie).title;
  else return (media as TMDBTVShow).name;
};

const getReleaseDate = (
  type: MediaType,
  media: TMDBMovie | TMDBTVShow | TMDBAnime
) => {
  if (type === "movies") return (media as TMDBMovie).release_date;
  else return (media as TMDBTVShow).first_air_date;
};

interface Props {
  type: MediaType;
  searchQuery: string;
  selectedMedia: APIMedia[];
  setSelectedMedia: React.Dispatch<React.SetStateAction<APIMedia[]>>;
}

const SelectMediaView: React.FC<Props> = ({
  type,
  searchQuery,
  selectedMedia,
  setSelectedMedia,
}) => {
  const { isLoading, data, hasNextPage, fetchNextPage } = useSearchMedia(
    type,
    searchQuery
  );

  const isSelected = useCallback(
    (id: number) => selectedMedia.find((x) => x.id === id) !== undefined,
    [selectedMedia]
  );

  const switchIsSelected = useCallback(
    (media: TMDBMovie | TMDBTVShow | TMDBAnime) => {
      if (isSelected(media.id))
        setSelectedMedia((prev) => prev.filter((x) => x.id !== media.id));
      else
        setSelectedMedia((prev) => [
          {
            id: media.id,
            title: getTitle(type, media),
            releaseDate: getReleaseDate(type, media),
            type:
              type === "movies"
                ? "movie"
                : type === "tv-shows"
                  ? "tv-show"
                  : "anime",
            image: media.poster_path ?? null,
          },
          ...prev,
        ]);
    },
    [selectedMedia]
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const { ref, inView } = useInView({
    root: containerRef.current,
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView]);

  return (
    <ScrollArea className="h-[550px] my-4" ref={containerRef}>
      {isLoading || !data ? (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 rounded overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton className="w-full aspect-[3/4]" key={i} />
          ))}
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 rounded overflow-hidden">
          {data.pages.map((page, i) =>
            page.results.map((item, j) =>
              i === data.pages.length - 1 && j === page.results.length - 1 ? (
                <div ref={ref} key={item.id}>
                  <AddMediaEntry
                    title={getTitle(type, item)}
                    subtitle={`${new Date(
                      getReleaseDate(type, item)
                    ).getFullYear()}`}
                    image={item.poster_path ?? undefined}
                    selected={isSelected(item.id)}
                    onPosterClick={() => switchIsSelected(item)}
                  />
                </div>
              ) : (
                <div key={item.id}>
                  <AddMediaEntry
                    title={getTitle(type, item)}
                    subtitle={`${new Date(
                      getReleaseDate(type, item)
                    ).getFullYear()}`}
                    image={item.poster_path ?? undefined}
                    selected={isSelected(item.id)}
                    onPosterClick={() => switchIsSelected(item)}
                  />
                </div>
              )
            )
          )}
        </div>
      )}
    </ScrollArea>
  );
};

export default SelectMediaView;
