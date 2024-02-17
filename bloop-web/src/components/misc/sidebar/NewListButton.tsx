"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Tag, TagInput } from "../TagInput";
import { useState } from "react";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNewList } from "@/hooks/api/lists/useNewList";
import { zodResolver } from "@hookform/resolvers/zod";
import { listsSchema } from "bloop-utils/validation";
import { AxiosError } from "axios";
import { ServerError } from "bloop-utils/types";
import { getErrorMessage } from "bloop-utils/validation/getErrorMessage";
import { useQueryClient } from "@tanstack/react-query";

interface FormFields {
  title: string;
  invites: Tag[];
}

const NewListButton = () => {
  const queryClient = useQueryClient();
  const newListMutation = useNewList();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormFields>({
    defaultValues: {
      title: "",
      invites: [],
    },
    resolver: zodResolver(listsSchema),
  });

  const handleSubmit = async (values: FormFields) => {
    try {
      const { data } = await newListMutation.mutateAsync(values);
      await queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("List created successfully.");
      form.reset();
      setOpen(false);
      router.push(`/list/${data.data.listId}`);
    } catch (e) {
      const error = e as AxiosError<ServerError>;
      if (!error.response) return;

      for (let code of error.response?.data.errors)
        toast.error(getErrorMessage(code));
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-9 group-[[data-collapsed=true]]:w-9 group-[[data-collapsed=false]]:px-4 group-[[data-collapsed=false]]:justify-start"
        >
          <PlusCircle className="h-4 w-4 group-[[data-collapsed=false]]:mr-2" />
          <span className="group-[[data-collapsed=true]]:sr-only">
            Add list
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Create a new list</DialogTitle>
              <DialogDescription>
                Create and share your watch lists. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="text-right">Title</FormLabel>
                    <Input
                      placeholder="Fall Season 🍂"
                      className="col-span-4"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invites"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="text-right">Invites</FormLabel>
                    <div className="col-span-4">
                      <TagInput
                        {...field}
                        tags={field.value}
                        setTags={(tags) =>
                          form.setValue("invites", tags as Tag[])
                        }
                        placeholder="joe.mama"
                        textCase="lowercase"
                        inputFieldPostion="top"
                        direction="row"
                      />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={newListMutation.isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewListButton;
