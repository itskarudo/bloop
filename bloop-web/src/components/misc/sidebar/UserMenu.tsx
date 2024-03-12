"use client";

import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const UserMenu = () => {
  const { user, logout } = useAuth();

  const handleLogOut = async () => {
    await logout();
    toast.success("Logged out successfully.");
  };

  return (
    <div className="flex h-[52px] py-8 items-center justify-center group-[[data-collapsed=true]]:h[52px] group-[[data-collapsed=false]]:px-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-card w-full px-2 py-1 h-auto shadow-sm group-[[data-collapsed=true]]:w-9 group-[[data-collapsed=true]]:border-0 group-[[data-collapsed=true]]:p-0 group-[[data-collapsed=true]]:rounded-full"
            size="icon"
          >
            <div className="w-full flex items-center">
              <Avatar className="hover:cursor-pointer h-9 w-9 shrink-0">
                <AvatarImage
                  src={user?.image ?? "https://github.com/itskarudo.png"}
                  className="object-cover"
                />
                <AvatarFallback>
                  {user?.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="ml-2 line-clamp-1 gap-1 group-[[data-collapsed=true]]:hidden">
                @{user?.username}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLogOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
