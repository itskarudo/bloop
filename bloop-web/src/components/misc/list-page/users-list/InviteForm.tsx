"use client";

import { Form, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Tag, TagInput } from "@/components/misc/TagInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useInviteUsers } from "@/hooks/api/invites/useInviteUsers";

interface Props {
  listId: string;
}

const InviteForm: React.FC<Props> = ({ listId }) => {
  const inviteUsersMutation = useInviteUsers(listId);

  const form = useForm<{ invites: Tag[] }>({
    defaultValues: {
      invites: [],
    },
  });

  const onSubmit = async (values: { invites: Tag[] }) => {
    if (values.invites.length === 0) {
      toast.error("You must invite at least one user.");
      return;
    }

    try {
      const usernames = values.invites.map((invite) => invite.text);
      await inviteUsersMutation.mutateAsync({ usernames });
      form.reset();
      toast.success("Invites sent to users!");
    } catch (e) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-sm justify-between space-x-2"
      >
        <FormField
          control={form.control}
          name="invites"
          render={({ field }) => (
            <FormItem className="flex-1">
              <TagInput
                {...field}
                tags={field.value}
                setTags={(tags) => form.setValue("invites", tags as Tag[])}
                placeholder="joe.mama"
                textCase="lowercase"
                inputFieldPostion="top"
                direction="row"
                disabled={inviteUsersMutation.isPending}
              />
            </FormItem>
          )}
        />
        <Button disabled={inviteUsersMutation.isPending} type="submit">
          Invite
        </Button>
      </form>
    </Form>
  );
};

export default InviteForm;
