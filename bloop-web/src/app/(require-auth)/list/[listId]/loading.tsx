import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const Loading: React.FC = () => {
  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="flex gap-4 items-center my-6">
        <Skeleton className="h-10 w-8 mr-2" />
        <Skeleton className="h-8 w-96" />
      </div>
      <Separator className="my-4" />
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton className="w-full aspect-[3/4]" key={i} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
