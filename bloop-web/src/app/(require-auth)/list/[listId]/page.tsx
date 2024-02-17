"use client";
import ActionsMenu from "@/components/misc/list-page/ActionsMenu";
import AddMediaDialog from "@/components/misc/list-page/add-media/AddMediaDialog";
import EditableTitle from "@/components/misc/list-page/EditableTitle";
import ListUsersView from "@/components/misc/list-page/users-list/ListUsersView";
import MediaEntry from "@/components/misc/list-page/MediaEntry";
import NoAnimeFound from "@/components/misc/list-page/NoAnimeFound";
import NoMoviesFound from "@/components/misc/list-page/NoMoviesFound";
import NoTVShowsFound from "@/components/misc/list-page/NoTVShowsFound";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetListDetails } from "@/hooks/api/lists/useGetListDetails";
import { FileText } from "lucide-react";
import { redirect } from "next/navigation";
import Loading from "./loading";
import { Media } from "bloop-utils/types";
import { useEffect, useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  params: {
    listId: string;
  };
}

const ListPage: React.FC<Props> = ({ params: { listId } }) => {
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState<{ media: Media; watched: boolean }[]>(
    []
  );
  const [shows, setShows] = useState<{ media: Media; watched: boolean }[]>([]);
  const [anime, setAnime] = useState<{ media: Media; watched: boolean }[]>([]);
  const [unwatchedOnly, setUnwatchedOnly] = useState(false);

  const { isPending, data, isError } = useGetListDetails(listId);

  useEffect(() => {
    if (isPending) return;
    if (isError || !data) return redirect("/");

    setTitle(data.data.list.title);
    const newList = data.data.list.listMedia.map((x) => ({
      media: {
        ...x.media,
        releaseDate: new Date(x.media.releaseDate),
      },
      watched: x.watched,
    }));

    setMovies(newList.filter((x) => x.media.type === "movie"));
    setShows(newList.filter((x) => x.media.type === "tv-show"));
    setAnime(newList.filter((x) => x.media.type === "anime"));
  }, [isError, data]);

  const displayMovies = useMemo(
    () => (unwatchedOnly ? movies.filter((x) => !x.watched) : movies),
    [movies, unwatchedOnly]
  );

  const displayShows = useMemo(
    () => (unwatchedOnly ? shows.filter((x) => !x.watched) : shows),
    [shows, unwatchedOnly]
  );

  const displayAnime = useMemo(
    () => (unwatchedOnly ? anime.filter((x) => !x.watched) : anime),
    [anime, unwatchedOnly]
  );

  if (isPending || !data) return <Loading />;

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="my-6 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <FileText size={48} />
          <EditableTitle title={title} listId={listId} />
        </div>
        <div>
          <ListUsersView listId={listId} />
          <ActionsMenu
            listId={listId}
            archived={data.data.list.listUsers[0].archived}
          />
        </div>
      </div>
      <Separator className="my-4" />
      <Tabs defaultValue="movies" className="h-full space-y-6">
        <div className="flex flex-col-reverse gap-4 items-start sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <TabsList>
              <TabsTrigger value="movies" className="relative">
                Movies
              </TabsTrigger>
              <TabsTrigger value="tv-shows">TV Shows</TabsTrigger>
              <TabsTrigger value="anime">Anime</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Switch
                id="unwatched-only"
                checked={unwatchedOnly}
                onCheckedChange={setUnwatchedOnly}
              />
              <Label htmlFor="unwatched-only">Unwatched Only</Label>
            </div>
          </div>
          <div className="mr-4">
            <AddMediaDialog listId={listId} />
          </div>
        </div>
        <TabsContent value="movies">
          {displayMovies.length === 0 ? (
            <NoMoviesFound />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayMovies.map((item) => (
                <MediaEntry key={item.media.id} data={item} listId={listId} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="tv-shows">
          {displayShows.length === 0 ? (
            <NoTVShowsFound />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayShows.map((item) => (
                <MediaEntry key={item.media.id} data={item} listId={listId} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="anime">
          {displayAnime.length === 0 ? (
            <NoAnimeFound />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayAnime.map((item) => (
                <MediaEntry key={item.media.id} data={item} listId={listId} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListPage;
