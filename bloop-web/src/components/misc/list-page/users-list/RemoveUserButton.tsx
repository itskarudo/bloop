"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Trash2 } from "lucide-react";
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
import { toast } from "sonner";
import { useRemoveUser } from "@/hooks/api/lists/useRemoveUser";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  listId: string;
  username: string;
  userId: string;
}

const RemoveUserButton: React.FC<Props> = ({ userId, username, listId }) => {
  const queryClient = useQueryClient();
  const removeUserMutation = useRemoveUser();
  const { user } = useAuth();

  const isSelf = userId === user?.id;

  const handleAction = async () => {
    await removeUserMutation.mutateAsync({ listId, userId });
    await queryClient.invalidateQueries({ queryKey: ["listUsers", listId] });
    if (isSelf) toast.success("Successfully left the list.");
    else toast.success(`Successfully removed @${username} from the list.`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost">
          {isSelf ? <LogOut size={16} /> : <Trash2 size={16} />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {isSelf
              ? "You are leaving the list, are you sure you want to do this?"
              : `You are kicking out @${username} from the list, are you sure you want to do this?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={removeUserMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAction}
            disabled={removeUserMutation.isPending}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveUserButton;
