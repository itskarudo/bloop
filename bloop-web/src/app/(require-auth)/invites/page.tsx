"use client";
import { Separator } from "@/components/ui/separator";
import { CloudRainWind, Inbox } from "lucide-react";
import ListCard from "@/components/misc/invites-page/ListCard";
import { useGetInvites } from "@/hooks/api/invites/useGetInvites";

const InvitesPage = () => {
  const { isPending, data } = useGetInvites();
  return (
    <div className="min-h-screen flex flex-col px-4 py-6 lg:px-8">
      <div className="flex gap-4 items-center my-6">
        <Inbox size={48} />
        <h1 className="scroll-m-20 text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl outline-none">
          Invites
        </h1>
      </div>
      <Separator className="my-4" />
      {!isPending && data?.data.invites.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.data.invites.map((invite) => (
            <ListCard
              key={invite.list.id}
              listId={invite.list.id}
              username={invite.inviter.username}
              title={invite.list.title}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex justify-center items-center">
          <div className="space-y-4 text-center">
            <CloudRainWind className="h-10 w-10 text-muted-foreground mx-auto" />

            <h3 className="mt-4 text-lg font-semibold">Nothing to see here</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              No invites to be found.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitesPage;
