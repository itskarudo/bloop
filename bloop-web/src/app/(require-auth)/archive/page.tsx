import { Separator } from "@/components/ui/separator";
import { Archive, CloudRainWind } from "lucide-react";

const ArchivePage = () => {
  return (
    <div className="min-h-screen flex flex-col px-4 py-6 lg:px-8">
      <div className="flex gap-4 items-center my-6">
        <Archive size={48} />
        <h1 className="scroll-m-20 text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl outline-none">
          Archive
        </h1>
      </div>
      <Separator className="my-4" />
      <div className="flex-1 flex justify-center items-center">
        <div className="space-y-4 text-center">
          <CloudRainWind className="h-10 w-10 text-muted-foreground mx-auto" />

          <h3 className="mt-4 text-lg font-semibold">Nothing to see here</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You archive is empty.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;
