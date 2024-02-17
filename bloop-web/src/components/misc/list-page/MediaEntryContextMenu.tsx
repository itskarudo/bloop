"use client";

import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { useRemoveMedia } from "@/hooks/api/lists/useRemoveMedia";
import { useToggleWatched } from "@/hooks/api/lists/useToggleWatched";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  listId: string;
  mediaId: number;
  watched: boolean;
}

const MediaEntryContextMenu: React.FC<Props> = ({
  listId,
  mediaId,
  watched,
}) => {
  const queryClient = useQueryClient();
  const toggleWatchedMutation = useToggleWatched();
  const removeMediaMutation = useRemoveMedia();

  const markAsWatched = async () => {
    await toggleWatchedMutation.mutateAsync({ listId, mediaId });
    if (watched) toast.success("Removed from watched!");
    else toast.success("Marked as watched!");

    queryClient.invalidateQueries({ queryKey: ["listDetails", listId] });
  };

  const removeFromList = async () => {
    await removeMediaMutation.mutateAsync({ listId, mediaId });
    toast.success("Removed from the list!");
    queryClient.invalidateQueries({ queryKey: ["listDetails", listId] });
  };

  return (
    <ContextMenuContent>
      <ContextMenuItem onSelect={markAsWatched}>
        {watched ? "Remove From Watched" : "Mark As Watched"}
      </ContextMenuItem>
      <ContextMenuItem onSelect={removeFromList}>
        Remove From List
      </ContextMenuItem>
    </ContextMenuContent>
  );
};

export default MediaEntryContextMenu;
