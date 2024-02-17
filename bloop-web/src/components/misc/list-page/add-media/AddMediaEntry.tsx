import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  title: string;
  subtitle: string;
  image?: string;
  selected: boolean;
  onPosterClick?: () => void;
}

const AddMediaEntry: React.FC<Props> = ({
  title,
  subtitle,
  image,
  selected,
  onPosterClick,
}) => {
  return (
    <div className="rounded-md space-y-2">
      <div
        className={cn(
          "h-auto w-auto rounded overflow-hidden",
          selected && "outline outline-4 outline-blue-500"
        )}
        onClick={onPosterClick}
      >
        {image ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${image}`}
            alt={title}
            width={250}
            height={330}
            className="h-auto w-auto object-cover cursor-pointer"
          />
        ) : (
          <Skeleton className="w-full h-full" />
        )}
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

export default AddMediaEntry;
