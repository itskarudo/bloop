"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInviteAction } from "@/hooks/api/invites/useInviteAction";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  listId: string;
  username: string;
  title: string;
}

const ListCard: React.FC<Props> = ({ username, title, listId }) => {
  const queryClient = useQueryClient();
  const inviteActionMutation = useInviteAction(listId);

  const handleAccept = async () => {
    await inviteActionMutation.mutateAsync("accept");
    queryClient.invalidateQueries({ queryKey: ["invites"] });
    queryClient.invalidateQueries({ queryKey: ["invitesCount"] });
    queryClient.invalidateQueries({ queryKey: ["lists"] });
  };

  const handleDecline = async () => {
    await inviteActionMutation.mutateAsync("decline");
    queryClient.invalidateQueries({ queryKey: ["invites"] });
    queryClient.invalidateQueries({ queryKey: ["invitesCount"] });
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src="https://github.com/itskarudo.png"
              alt={`@${username}`}
            />
            <AvatarFallback>
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-sm font-medium">
            Invited by @{username}
          </CardTitle>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="my-2 text-2xl font-bold">{title}</div>
        <div className="space-x-4 flex justify-end">
          <Button
            variant="secondary"
            disabled={inviteActionMutation.isPending}
            onClick={handleDecline}
          >
            Decline
          </Button>
          <Button
            disabled={inviteActionMutation.isPending}
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListCard;
