"use client";

import { useGetMovieDetails } from "@/hooks/api/media/useGetMovieDetails";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface Props {
  params: {
    listId: string;
    movieId: string;
  };
}

const MoviePage: React.FC<Props> = ({ params: { listId, movieId } }) => {
  const { isPending, isError, data } = useGetMovieDetails(listId, movieId);

  if (isError) return redirect("/");

  if (isPending) return null;

  const { movieData, watched } = data.data;

  return (
    <div className="relative min-h-screen flex flex-col px-4 lg:px-32">
      <div
        className="absolute top-0 left-0 z-0 w-full h-[600px] bg-cover bg-center before:absolute before:w-full before:h-full before:bg-gradient-to-r before:from-background before:via-transparent  before:to-background after:absolute after:w-full after:h-full after:bg-gradient-to-t after:from-background after:from-25% after:to-70%"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movieData.backdrop_path})`,
        }}
      ></div>
      <div className="relative pt-[420px] pb-20">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="rounded-md overflow-hidden relative">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
              alt={movieData.title}
              width={230}
              height={345}
              className="h-auto w-auto object-cover"
            />
          </div>
          <div className="w-2/3 lg:w-1/2 space-y-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <h2 className="scroll-m-20 text-4xl font-bold tracking-tight">
                {movieData.title} (
                {new Date(movieData.release_date).getFullYear()})
              </h2>
              {watched && <CheckCircle2 strokeWidth={3} size={32} />}
            </div>
            <blockquote className="border-l-2 pl-6 italic text-muted-foreground">
              {movieData.tagline}
            </blockquote>
            <p className="leading-7 text-muted-foreground">
              {movieData.overview}
            </p>
            <div className="space-x-2">
              {movieData.genres.map((genre: any) => (
                <Badge key={genre.id}>{genre.name}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
