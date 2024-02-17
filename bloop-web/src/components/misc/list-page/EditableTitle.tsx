"use client";

import { useRenameList } from "@/hooks/api/lists/useRenameList";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface Props {
  listId: string;
  title: string;
}

const EditableTitle: React.FC<Props> = ({ title, listId }) => {
  const queryClient = useQueryClient();
  const renameListMutation = useRenameList();
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const kbHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        ref.current?.blur();
      }
    };

    const blurHandler = async () => {
      if (!ref.current || ref.current.innerText === title) return;
      if (ref.current.innerText.length > 32) {
        toast.error("List title must be between 1 and 32 characters.");
        ref.current!.innerText = title;
        return;
      }
      try {
        const newTitle = ref.current.innerText || "Untitled";
        await renameListMutation.mutateAsync({
          listId,
          title: newTitle,
        });
        ref.current!.innerText = newTitle;
        await queryClient.invalidateQueries({ queryKey: ["lists"] });
      } catch (e) {
        toast.error("List title must be between 1 and 32 characters.");
        ref.current!.innerText = title;
      }
    };

    ref.current?.addEventListener("blur", blurHandler);
    ref.current?.addEventListener("keydown", kbHandler);

    return () => {
      ref.current?.removeEventListener("keydown", kbHandler);
      ref.current?.removeEventListener("blur", blurHandler);
    };
  }, [title]);

  return (
    <h1
      className="scroll-m-20 text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl underline decoration-dashed decoration-foreground decoration-4 underline-offset-4 outline-none"
      ref={ref}
      contentEditable
      suppressContentEditableWarning
    >
      {title}
    </h1>
  );
};

export default EditableTitle;
