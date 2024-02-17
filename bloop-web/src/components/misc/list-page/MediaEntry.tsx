import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import MediaEntryContextMenu from "./MediaEntryContextMenu";
import { Media } from "bloop-utils/types";
import { cn } from "@/lib/utils";

interface Props {
  listId: string;
  data: {
    media: Media;
    watched: boolean;
  };
}

const MediaEntry: React.FC<Props> = ({ listId, data: { media, watched } }) => {
  return (
    <div className="space-y-2">
      <ContextMenu>
        <ContextMenuTrigger>
          <Link href={`/list/${listId}/${media.type}/${media.id}`}>
            <div className="h-auto w-auto rounded-md overflow-hidden shadow group relative ">
              {media.image ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${media.image}`}
                  alt={media.title}
                  width={250}
                  height={330}
                  className={cn(
                    "h-auto w-auto object-cover transition-all group-hover:scale-105",
                    watched && "opacity-50"
                  )}
                />
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </div>
          </Link>
        </ContextMenuTrigger>
        <MediaEntryContextMenu
          listId={listId}
          watched={watched}
          mediaId={media.id}
        />
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <Link href={`/list/${listId}/${media.type}/${media.id}`}>
          <h3 className="font-medium hover:underline">{media.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground">
          {media.releaseDate.getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default MediaEntry;
