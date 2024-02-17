"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRemoveList } from "@/hooks/api/lists/useRemoveList";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useArchiveList } from "@/hooks/api/lists/useArchiveList";
import { useUnarchiveList } from "@/hooks/api/lists/useUnarchiveList";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  listId: string;
  archived: boolean;
}

const ActionMenu: React.FC<Props> = ({ listId, archived }) => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const removeListMutation = useRemoveList();
  const archiveListMutation = useArchiveList();
  const unarchiveListMutation = useUnarchiveList();

  const toggleArchive = async () => {
    try {
      if (archived) {
        await unarchiveListMutation.mutateAsync(listId);
        toast.success("List archived successfully.");
      } else {
        await archiveListMutation.mutateAsync(listId);
        toast.success("List unarchived successfully.");
      }
      queryClient.invalidateQueries({ queryKey: ["listDetails", listId] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    } catch (e) {}
  };

  const handleDelete = async () => {
    try {
      await removeListMutation.mutateAsync(listId);
      await queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("List deleted successfully.");
      router.push("/");
    } catch (e) {}
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Get invite link</DropdownMenuItem>
          <DropdownMenuItem onSelect={toggleArchive}>
            {archived ? "Unarchive" : "Archive"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanant, you will not be able to recover this list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionMenu;
