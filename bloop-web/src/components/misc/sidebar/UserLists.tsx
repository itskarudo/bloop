"use client";
import { FileText } from "lucide-react";
import Link from "next/link";
import SidebarButton from "./SidebarButton";
import { useGetLists } from "@/hooks/api/lists/useGetLists";

const UserLists: React.FC = () => {
  const { isLoading, data } = useGetLists();
  if (isLoading || !data) return null;
  return (
    <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
      {data.data.lists.map((list) => (
        <Link href={`/list/${list.id}`} key={list.id}>
          <SidebarButton
            Icon={FileText}
            title={list.title}
            path={`/list/${list.id}`}
          />
        </Link>
      ))}
    </nav>
  );
};

export default UserLists;
