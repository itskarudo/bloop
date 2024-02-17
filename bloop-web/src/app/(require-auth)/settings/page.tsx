"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import {
  EditProfileArgs,
  useEditProfile,
} from "@/hooks/api/profile/useEditProfile";
import { getErrorMessage } from "bloop-utils/validation/getErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "bloop-utils/validation";
import { Settings } from "lucide-react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";

const SettingsPage = () => {
  const auth = useAuth();

  const mutation = useEditProfile();

  const form = useForm<EditProfileArgs>({
    defaultValues: {
      username: auth.user!.username,
      email: auth.user!.email,
      currentPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(editProfileSchema),
  });

  const onSubmit = async (values: EditProfileArgs) => {
    mutation.mutate(values, {
      onSuccess: async () => {
        await auth.refreshUser();
        form.reset({
          username: values.username,
          email: values.email,
        });
        toast.success("Profile Edited Successfully.");
      },
      onError: (e) => {
        for (let err of e.response!.data.errors)
          toast.error(getErrorMessage(err));
      },
    });
  };

  const onError = (errors: FieldErrors<EditProfileArgs>) => {
    if (errors.username?.message)
      toast.error(getErrorMessage(errors.username.message));
    if (errors.email?.message)
      toast.error(getErrorMessage(errors.email.message));
    if (errors.currentPassword?.message)
      toast.error(getErrorMessage(errors.currentPassword.message));
    if (errors.newPassword?.message)
      toast.error(getErrorMessage(errors.newPassword.message));
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 lg:px-8">
      <div className="flex gap-4 items-center my-6">
        <Settings size={48} />
        <h1 className="scroll-m-20 text-4xl text-foreground font-extrabold tracking-tight lg:text-5xl outline-none">
          Settings
        </h1>
      </div>
      <Separator className="my-4" />
      <div className="lg:w-1/2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder="john.doe@gmail.com"
                    type="email"
                    {...field}
                  />
                  <FormDescription>
                    This is your private email address. We will never share it.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <Input placeholder="**********" type="password" {...field} />
                  <FormDescription>
                    This is your current password.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <Input placeholder="**********" type="password" {...field} />
                  <FormDescription>
                    This is your new password. It must be at least 8 characters
                    long.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              Update profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SettingsPage;
