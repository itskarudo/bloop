"use client";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGetLists } from "@/hooks/api/lists/useGetLists";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SearchButton: React.FC = () => {
  const { isLoading, data } = useGetLists();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-9 group-[[data-collapsed=true]]:w-9 group-[[data-collapsed=false]]:px-4 group-[[data-collapsed=false]]:justify-start"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 group-[[data-collapsed=false]]:mr-2" />
        <span className="group-[[data-collapsed=true]]:sr-only">Search</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="My Lists">
            {isLoading || !data
              ? null
              : data.data.lists.map((list) => (
                  <CommandItem
                    key={list.id}
                    onSelect={() => {
                      router.push(`/list/${list.id}`);
                      setOpen(false);
                    }}
                  >
                    <span>{list.title ?? "Untitled"}</span>
                  </CommandItem>
                ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchButton;
