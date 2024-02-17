"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Users } from "lucide-react";
import UserEntry from "./UserEntry";
import InviteForm from "./InviteForm";
import { useAuth } from "@/context/AuthContext";
import { useGetUsers } from "@/hooks/api/lists/useGetUsers";

interface Props {
  listId: string;
}

const ListUsersView: React.FC<Props> = ({ listId }) => {
  const { user } = useAuth();
  const { isLoading, data } = useGetUsers(listId);

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Users className="w-4 h-4" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Users</p>
        </TooltipContent>
      </Tooltip>
      <SheetContent className="space-y-8">
        <SheetHeader>
          <SheetTitle>Users</SheetTitle>
          <SheetDescription>
            Users that have access to this list
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-8">
          <InviteForm listId={listId} />
          <div className="space-y-8">
            <UserEntry user={user!} listId={listId} />
            {isLoading || !data ? null : (
              <>
                {data.data.users.map((user) => (
                  <UserEntry key={user.id} user={user} listId={listId} />
                ))}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ListUsersView;
