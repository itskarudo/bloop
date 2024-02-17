"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  Icon: LucideIcon;
  title: string;
  label?: number;
  path?: string;
}

const SidebarButton: React.FC<Props> = ({ Icon, title, label, path }) => {
  const pathname = usePathname();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={pathname === path ? "secondary" : "ghost"}
          size="icon"
          className="w-full h-9 group-[[data-collapsed=true]]:w-9 group-[[data-collapsed=false]]:px-4 group-[[data-collapsed=false]]:justify-start"
        >
          <Icon className="h-4 w-4 group-[[data-collapsed=false]]:mr-2" />
          <span className="group-[[data-collapsed=true]]:sr-only">{title}</span>
          {label ? (
            <Badge className="group-[[data-collapsed=true]]:hidden ml-auto">
              {label}
            </Badge>
          ) : null}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" className="z-50">
        <p>
          {title} {label ? ` (${label})` : null}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SidebarButton;
