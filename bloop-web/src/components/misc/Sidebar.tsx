"use client";
import { Separator } from "@/components/ui/separator";
import NewListButton from "./sidebar/NewListButton";
import UserLists from "./sidebar/UserLists";
import UserMenu from "./sidebar/UserMenu";
import { Inbox, Archive } from "lucide-react";
import SidebarButton from "./sidebar/SidebarButton";
import Link from "next/link";
import SearchButton from "./sidebar/SearchButton";
import { useGetInvitesCount } from "@/hooks/api/invites/useGetInvitesCount";

const Sidebar = () => {
  const { isPending, data } = useGetInvitesCount();
  return (
    <div className="sticky top-0">
      <UserMenu />
      <Separator />
      <div className="flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          <NewListButton />
          <SearchButton />
          <Link href="/invites">
            <SidebarButton
              Icon={Inbox}
              title="Invites"
              label={!isPending ? data! : 0}
              path="/invites"
            />
          </Link>
          <Link href="/archive">
            <SidebarButton Icon={Archive} title="Archive" path="/archive" />
          </Link>
        </nav>
        <Separator />
        <UserLists />
      </div>
    </div>
  );
};

export default Sidebar;
