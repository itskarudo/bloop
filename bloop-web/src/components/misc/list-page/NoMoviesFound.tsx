import { Clapperboard } from "lucide-react";

const NoMoviesFound = () => {
  return (
    <div className="space-y-4 h-[450px] flex justify-center items-center text-center">
      <div>
        <Clapperboard className="h-10 w-10 text-muted-foreground mx-auto" />

        <h3 className="mt-4 text-lg font-semibold">No movies to be found</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          You can add movies by clicking the button above.
        </p>
      </div>
    </div>
  );
};

export default NoMoviesFound;
