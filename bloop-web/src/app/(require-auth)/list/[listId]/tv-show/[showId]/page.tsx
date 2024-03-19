"use client";

import { redirect } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useGetTVShowDetails } from "@/hooks/api/media/useGetTVShowDetails";
import SeasonsView from "@/components/misc/media-page/SeasonsView";
import { CheckCircle2, Heart, Popcorn, Tv } from "lucide-react";

interface Props {
  params: {
    listId: string;
    showId: string;
  };
}

const TVShowPage: React.FC<Props> = ({ params: { listId, showId } }) => {
  const { isPending, isError, data } = useGetTVShowDetails(listId, showId);

  if (isError) return redirect("/");

  if (isPending || !data) return null;
  const { showData, watchedEpisodes, watched } = data.data;

  return (
    <div className="relative min-h-screen flex flex-col px-4 lg:px-32">
      <div
        className="absolute top-0 left-0 z-0 w-full h-[600px] bg-cover bg-center before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-background before:via-transparent  before:to-background after:absolute after:w-full after:h-full after:bg-gradient-to-t after:from-background after:from-25% after:to-70%"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${showData.backdrop_path})`,
        }}
      ></div>
      <div className="relative pt-[420px] pb-20">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="static md:sticky top-6">
            <div className="rounded-md overflow-hidden shadow-md">
              <Image
                src={`https://image.tmdb.org/t/p/w500${showData.poster_path}`}
                alt={showData.title}
                width={230}
                height={345}
                className="h-auto w-auto object-cover"
              />
            </div>
            <div className="grid grid-cols-3 mt-2">
              <div className="flex flex-col items-center gap-1 p-3">
                <Heart />
                <p className="text-xs font-medium leading-none">
                  {Math.round(showData.vote_average * 10)}%
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 p-3">
                <Popcorn />
                <p className="text-xs font-medium leading-none">
                  {showData.popularity}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 p-3">
                <Tv />
                <p className="text-xs font-medium leading-none">
                  {showData.number_of_episodes} eps
                </p>
              </div>
            </div>
          </div>
          <div className="w-2/3 lg:w-1/2 space-y-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <h2 className="scroll-m-20 text-4xl font-bold tracking-tight">
                {showData.name}
              </h2>
              {watched && <CheckCircle2 strokeWidth={3} size={32} />}
            </div>
            <blockquote className="border-l-2 pl-6 italic text-muted-foreground">
              {showData.tagline}
            </blockquote>
            <p className="leading-7 text-muted-foreground">
              {showData.overview}
            </p>
            <div className="space-x-2">
              {showData.genres.map((genre: any) => (
                <Badge key={genre.id}>{genre.name}</Badge>
              ))}
            </div>
            <div className="space-y-6 pt-4">
              <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                Seasons & Episodes
              </h3>
              <div className="space-y-10">
                <SeasonsView
                  type="tv-show"
                  listId={listId}
                  mediaId={showId}
                  seasons={showData.seasons}
                  watchedEpisodes={watchedEpisodes}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShowPage;
