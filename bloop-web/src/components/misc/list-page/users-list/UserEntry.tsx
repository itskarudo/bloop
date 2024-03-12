import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RemoveUserButton from "./RemoveUserButton";

interface Props {
  listId: string;
  user: {
    id: string;
    username: string;
    email: string;
    image: string | null;
  };
}

const UserEntry: React.FC<Props> = ({ user, listId }) => {
  return (
    <div key={user.id} className="flex items-center">
      <Avatar>
        <AvatarImage
          src={user?.image ?? "https://github.com/itskarudo.png"}
          className="object-cover"
          alt={`@${user.username}`}
        />
        <AvatarFallback>
          {user.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">@{user.username}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <div className="ml-auto font-medium">
        <RemoveUserButton
          userId={user.id}
          username={user.username}
          listId={listId}
        />
      </div>
    </div>
  );
};

export default UserEntry;
