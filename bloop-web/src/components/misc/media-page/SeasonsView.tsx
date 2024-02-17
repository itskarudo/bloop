"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { useToggleEpisodeWatched } from "@/hooks/api/media/useToggleEpisodeWatched";
import { toast } from "sonner";
import { getErrorMessage } from "bloop-utils/validation/getErrorMessage";
import { GenericErrorCodes } from "bloop-utils/types/ErrorCodes";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  type: "tv-show" | "anime";
  listId: string;
  mediaId: string;
  seasons: {
    id: number;
    name: string;
    episode_count: number;
  }[];
  watchedEpisodes: {
    season: number;
    episode: number;
  }[];
}

const EpisodeButton: React.FC<{
  type: "tv-show" | "anime";
  listId: string;
  mediaId: string;
  season: number;
  episode: number;
  watched: boolean;
}> = ({ type, listId, mediaId, season, episode, watched }) => {
  const queryClient = useQueryClient();

  const [isWatched, setIsWatched] = useState(watched);
  const toggleEpisodeMutation = useToggleEpisodeWatched(
    type,
    listId,
    mediaId,
    season,
    episode
  );

  const toggleWatched = async () => {
    try {
      setIsWatched((prev) => !prev);
      await toggleEpisodeMutation.mutateAsync();
      queryClient.invalidateQueries({ queryKey: ["tv-show", mediaId, listId] });
    } catch (e) {
      toast.error(getErrorMessage(GenericErrorCodes.SOMETHING_WENT_WRONG));
    }
  };

  return (
    <Button
      onClick={toggleWatched}
      variant={isWatched ? "default" : "secondary"}
      className="py-6"
      disabled={toggleEpisodeMutation.isPending}
    >
      {episode + 1}
    </Button>
  );
};

const SeasonsView: React.FC<Props> = ({
  type,
  listId,
  mediaId,
  seasons,
  watchedEpisodes,
}) => {
  return (
    <Accordion type="multiple" className="w-full">
      {seasons.map((season) => (
        <AccordionItem key={season.id} value={season.id.toString()}>
          <AccordionTrigger>{season.name}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {Array.from({ length: season.episode_count }).map((_, i) => (
                <EpisodeButton
                  key={i}
                  type={type}
                  listId={listId}
                  mediaId={mediaId}
                  season={season.id}
                  episode={i}
                  watched={
                    !!watchedEpisodes.find(
                      (x) => x.season === season.id && x.episode === i
                    )
                  }
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SeasonsView;

/*

*/
