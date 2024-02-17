"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AddMediaArgs, useAddMedia } from "@/hooks/api/lists/useAddMedia";
import SelectMediaView from "./SelectMediaView";
import { getErrorMessage } from "bloop-utils/validation/getErrorMessage";
import { AxiosError } from "axios";
import { ServerError } from "bloop-utils/types";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  listId: string;
}

const AddMediaDialog: React.FC<Props> = ({ listId }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedMedia, setSelectedMedia] = useState<AddMediaArgs["mediaList"]>(
    []
  );
  const addMediaMutation = useAddMedia();

  const handleSave = async () => {
    try {
      await addMediaMutation.mutateAsync({
        listId,
        args: { mediaList: selectedMedia },
      });

      await queryClient.invalidateQueries({
        queryKey: ["listDetails", listId],
      });

      toast.success("Media added successfully.");
      setOpen(false);
      setSearchQuery("");
      setSelectedMedia([]);
    } catch (e) {
      const error = e as AxiosError<ServerError>;
      if (!error.response) return;

      for (let code of error.response?.data.errors)
        toast.error(getErrorMessage(code));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setSearchQuery("");
          setSelectedMedia([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add media
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[70%]">
        <Tabs
          onValueChange={() => {
            setSearchQuery("");
          }}
          defaultValue="movies"
          className="relative"
        >
          <DialogHeader className=" pt-8 px-4">
            <div className="flex flex-col gap-4 justify-between sm:flex-row">
              <div>
                <DialogTitle>Add media</DialogTitle>
                <DialogDescription>
                  Select media to add to your list, Click save when you're done.
                </DialogDescription>
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Search.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <TabsList className="my-4 grid w-full grid-cols-3">
                <TabsTrigger value="movies">Movies</TabsTrigger>
                <TabsTrigger value="tv-shows">TV Shows</TabsTrigger>
                <TabsTrigger value="anime">Anime</TabsTrigger>
              </TabsList>
            </div>
          </DialogHeader>

          <TabsContent value="movies">
            <SelectMediaView
              type="movies"
              selectedMedia={selectedMedia}
              setSelectedMedia={setSelectedMedia}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="tv-shows">
            <SelectMediaView
              type="tv-shows"
              selectedMedia={selectedMedia}
              setSelectedMedia={setSelectedMedia}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="anime">
            <SelectMediaView
              type="anime"
              selectedMedia={selectedMedia}
              setSelectedMedia={setSelectedMedia}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <DialogFooter>
            <Button
              type="submit"
              disabled={addMediaMutation.isPending}
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogFooter>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddMediaDialog;
