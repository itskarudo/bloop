import { CloudRainWind } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="space-y-4 text-center">
        <CloudRainWind className="h-10 w-10 text-muted-foreground mx-auto" />

        <h3 className="mt-4 text-lg font-semibold">Nothing to see here</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          You can browse or add lists in the sidebar.
        </p>
      </div>
    </div>
  );
};

export default Home;
