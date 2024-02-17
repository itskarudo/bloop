import { Tv } from "lucide-react";

const NoTVShowsFound = () => {
  return (
    <div className="space-y-4 h-[450px] flex justify-center items-center text-center">
      <div>
        <Tv className="h-10 w-10 text-muted-foreground mx-auto" />

        <h3 className="mt-4 text-lg font-semibold">No TV shows to be found</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          You can add TV shows by clicking the button above.
        </p>
      </div>
    </div>
  );
};

export default NoTVShowsFound;
